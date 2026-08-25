import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl =
    rawBackendUrl &&
    (rawBackendUrl.includes("localhost") || rawBackendUrl.includes("127.0.0.1"))
      ? `http://${window.location.hostname}:5000`
      : rawBackendUrl || "http://localhost:5000";

  const currency = "$";
  const delivery_charges = 15.0;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch user cart from backend and merge any pending guest items
  const syncUserCart = async (authToken, currentUserId) => {
    if (!authToken || !currentUserId) return;

    try {
      // 1. Check if guest had items in localStorage before login
      const guestCartRaw = localStorage.getItem("guestCart");
      if (guestCartRaw) {
        try {
          const guestCart = JSON.parse(guestCartRaw);
          for (const itemId in guestCart) {
            for (const size in guestCart[itemId]) {
              const qty = guestCart[itemId][size];
              for (let i = 0; i < qty; i++) {
                await axios.post(
                  `${backendUrl}/api/cart/add`,
                  { userId: currentUserId, itemId, sizes: size },
                  { headers: { Authorization: `Bearer ${authToken}` } }
                );
              }
            }
          }
        } catch (e) {
          console.error("Error merging guest cart:", e);
        } finally {
          localStorage.removeItem("guestCart");
        }
      }

      // 2. Fetch authoritative user cart from MongoDB
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        { userId: currentUserId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data && response.data.success) {
        const userCart = response.data.cartData || {};
        setCartItems(userCart);
        localStorage.setItem("cartItems", JSON.stringify(userCart));
      }
    } catch (error) {
      console.error("Error syncing cart on login:", error);
    }
  };

  // React to token changes (Login, Logout, Initial Load)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const extractedUserId = decoded._id || decoded.userId || decoded.id;
        setUserId(extractedUserId);
        syncUserCart(token, extractedUserId);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    } else {
      // Logged out / Guest session: Clean up user cart and load guest cart
      setUserId(null);
      localStorage.removeItem("cartItems");
      const guestCartRaw = localStorage.getItem("guestCart");
      if (guestCartRaw) {
        try {
          setCartItems(JSON.parse(guestCartRaw));
        } catch {
          setCartItems({});
        }
      } else {
        setCartItems({});
      }
    }
  }, [token]);

  // Add Item to Cart
  const addToCart = async (itemId, sizes) => {
    if (!sizes) {
      toast.error("Please select a material.");
      return;
    }

    const cartData = structuredClone(cartItems || {});
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][sizes] = (cartData[itemId][sizes] || 0) + 1;

    setCartItems(cartData);
    toast.success("Item added to cart.");

    if (token && userId) {
      localStorage.setItem("cartItems", JSON.stringify(cartData));
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { userId, itemId, sizes },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error syncing cart to backend:", error);
      }
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartData));
    }
  };

  // Get Total Item Count in Cart
  const CartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  // Update Item Quantity
  const updateQuantity = async (itemId, sizes, quantity) => {
    const cartData = structuredClone(cartItems || {});
    if (cartData[itemId] && cartData[itemId][sizes] !== undefined) {
      if (quantity <= 0) {
        delete cartData[itemId][sizes];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][sizes] = quantity;
      }
    }

    setCartItems(cartData);

    if (token && userId) {
      localStorage.setItem("cartItems", JSON.stringify(cartData));
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { userId, itemId, sizes, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error updating cart in backend:", error);
        toast.error("Failed to update cart.");
      }
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartData));
    }
  };

  // Calculate Total Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            const product = products.find((p) => p._id === items);
            if (product) {
              totalAmount += product.price * cartItems[items][item];
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
  };

  const getUserCart = async () => {
    if (token && userId) {
      await syncUserCart(token, userId);
    }
  };

  // Unified Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("guestCart");
    setToken("");
    setUserId(null);
    setCartItems({});
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const value = {
    currency,
    delivery_charges,
    products,
    loading,
    cartItems,
    setCartItems,
    addToCart,
    CartCount,
    updateQuantity,
    getCartAmount,
    setToken,
    token,
    backendUrl,
    getUserCart,
    userId,
    navigate,
    logout,
  };

  return (
    <ProductContext.Provider value={value}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
