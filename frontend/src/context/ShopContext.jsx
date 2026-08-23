import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = (rawBackendUrl.includes("localhost") || rawBackendUrl.includes("127.0.0.1"))
    ? `http://${window.location.hostname}:5000`
    : rawBackendUrl;
  const delivery_charges = 15.00;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [cartItems, setCartItems] = useState({});

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.data.success && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading user cart:", error);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a material / option");
      return;
    }
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart successfully!");

    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, sizes: size },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      } catch (error) {
        console.error("Error syncing cart to backend:", error);
      }
    }
  };

  useEffect(() => {
    if (cartItems && Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size] !== undefined) {
        cartData[itemId][size] = quantity;
      }
    }
    setCartItems(cartData);

    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, sizes: size, quantity },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      } catch (error) {
        console.error("Error updating cart on backend:", error);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            const product = products.find((product) => product._id === items);
            if (product) {
              totalAmount += product.price * cartItems[items][item];
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching products");
    }
  };

  useEffect(() => {
    getProductsData();
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    } else {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const value = {
    currency,
    delivery_charges,
    navigate,
    products,
    token,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    setToken,
    addToCart,
    getCartCount,
    cartItems,
    setCartItems,
    updateQuantity,
    getCartAmount,
    backendUrl,
    getUserCart
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
