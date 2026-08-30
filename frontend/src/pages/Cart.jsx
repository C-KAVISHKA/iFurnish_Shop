import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FaMinus, FaPlus, FaRegWindowClose } from "react-icons/fa";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { ProductContext } from "../context/ProductContext";

const Cart = () => {
  const { products, currency, cartItems, CartCount, navigate, updateQuantity } =
    useContext(ProductContext);
  const [cartData, setCartData] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      const initialQuantities = {};
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
            initialQuantities[`${items}-${item}`] = cartItems[items][item];
          }
        }
      }
      setCartData(tempData);
      setQuantities(initialQuantities);
    }
  }, [cartItems, products]);

  const increment = (id, size) => {
    const key = `${id}-${size}`;
    const newValue = quantities[key] + 1;
    setQuantities((prev) => ({ ...prev, [key]: newValue }));
    updateQuantity(id, size, newValue);
  };

  const decrement = (id, size) => {
    const key = `${id}-${size}`;
    if (quantities[key] > 1) {
      const newValue = quantities[key] - 1;
      setQuantities((prev) => ({ ...prev, [key]: newValue }));
      updateQuantity(id, size, newValue);
    }
  };

  const parseCustomPrice = (variantName, basePrice) => {
    if (typeof variantName === "string" && variantName.includes("Custom ($")) {
      const match = variantName.match(/Custom\s*\(\$([\d.]+)/);
      if (match && match[1]) {
        const parsed = parseFloat(match[1]);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return Number(basePrice) || 0;
  };

  return (
    <div>
      <div className="bg-primary/40 min-h-[60vh] mb-12 sm:mb-16">
        <div className="max-padd-container py-8 sm:py-10">
          <div className="flex items-center gap-x-3 mb-6">
            <Title title1={"Shopping"} title2={"Cart"} titleStyles={"h3"} />
            <span className="text-gray-400 text-xs sm:text-sm font-semibold relative -top-1">
              ({CartCount()} Items)
            </span>
          </div>

          {cartData.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flexCenter mx-auto mb-4 text-2xl">
                🛒
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={() => navigate("/collection")}
                className="btn-secondary text-xs sm:text-sm !py-2.5 !px-6"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
              {/* Cart Items List */}
              <div className="flex flex-col gap-3">
                {cartData.map((item, i) => {
                  const productData = products.find(
                    (product) => product._id === item._id
                  );
                  if (!productData) return null;
                  const key = `${item._id}-${item.size}`;
                  const unitPrice = parseCustomPrice(item.size, productData.price);
                  const isCustom = typeof item.size === "string" && item.size.includes("Custom (");

                  return (
                    <div key={i} className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100/80">
                      <div className="flex items-center gap-x-3 sm:gap-x-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl p-1 flexCenter shrink-0">
                          <img
                            src={productData.image[0]}
                            alt={productData.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex flex-col w-full min-w-0">
                          <div className="flexBetween gap-2">
                            <h5 className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                              {productData.name}
                            </h5>
                            <button
                              onClick={() => updateQuantity(item._id, item.size, 0)}
                              className="text-gray-400 hover:text-red-500 p-1 text-sm transition-colors"
                              aria-label="Remove item"
                            >
                              <FaRegWindowClose />
                            </button>
                          </div>
                          
                          {isCustom ? (
                            <div className="flex flex-wrap items-center gap-1.5 my-1">
                              <span className="text-[10px] font-bold bg-secondary/15 text-secondary px-2 py-0.5 rounded-md border border-secondary/25">
                                ✨ 3D Custom
                              </span>
                              <span className="text-[11px] text-gray-600 font-medium truncate max-w-[260px]">
                                {item.size.replace(/^Custom\s*\(\$[\d.]+\s*\|\s*/, "").replace(/\)$/, "")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] sm:text-xs text-secondary font-semibold my-0.5">
                              Material: {item.size}
                            </span>
                          )}
                          
                          <div className="flexBetween mt-2 pt-1 border-t border-gray-100">
                            <div className="flex items-center ring-1 ring-slate-900/10 rounded-full overflow-hidden bg-primary/40">
                              <button
                                onClick={() => decrement(item._id, item.size)}
                                className="p-1.5 sm:p-2 bg-white text-secondary rounded-full shadow-sm hover:bg-gray-50 active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                <FaMinus className="text-[9px] sm:text-xs" />
                              </button>
                              <span className="px-2.5 text-xs sm:text-sm font-semibold">{quantities[key]}</span>
                              <button
                                onClick={() => increment(item._id, item.size)}
                                className="p-1.5 sm:p-2 bg-white text-secondary rounded-full shadow-sm hover:bg-gray-50 active:scale-95"
                                aria-label="Increase quantity"
                              >
                                <FaPlus className="text-[9px] sm:text-xs" />
                              </button>
                            </div>
                            
                            <h4 className="font-bold text-sm sm:text-base text-gray-900">
                              {currency}
                              {(unitPrice * (quantities[key] || 1)).toFixed(2)}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>


              {/* Order Summary Checkout Card */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
                <CartTotal />
                <button
                  onClick={() => navigate("/place-order")}
                  className="w-full btn-secondary text-xs sm:text-sm !py-3 mt-6 shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
