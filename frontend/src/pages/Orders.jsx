import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import Footer from "../components/Footer";
import { ProductContext } from "../context/ProductContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Orders = () => {
  const { products, currency, quantity, backendUrl, token } =
    useContext(ProductContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded?.id;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Full API Response:", response.data); // Debugging log

      if (response.status === 200 && Array.isArray(response.data)) {
        let allOrdersItem = [];

        response.data.forEach((order) => {
          order.items?.forEach((item) => {
            allOrdersItem.push({
              ...item,
              date: order.date,
              status: order.status,
              paymentMethod: order.paymentMethod,
              payment: order.payment,
            });
          });
        });

        console.log("Processed Orders:", allOrdersItem); // Debugging log
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div>
      <div className="bg-primary/40 min-h-[60vh] mb-12 sm:mb-16">
        <div className="max-padd-container py-8 sm:py-10">
          <Title title1={"Order"} title2={"History"} titleStyles={"h3"} />
          
          {orderData.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flexCenter mx-auto mb-4 text-2xl">
                📦
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                You haven't placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4 mt-6">
              {orderData.map((item, i) => (
                <div key={i} className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl p-1 flexCenter shrink-0">
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 w-full min-w-0">
                      <h5 className="font-bold text-gray-800 text-sm sm:text-base capitalize truncate mb-1">
                        {item.name}
                      </h5>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
                        <span className="font-bold text-secondary text-sm">
                          {currency}{item.price}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                        {item.sizes && <span className="bg-gray-100 px-2 py-0.5 rounded-md">Size: {item.sizes}</span>}
                        <span className="text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                        <span className="uppercase text-[10px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-md">
                          {item.paymentMethod}
                        </span>
                      </div>
                      
                      <div className="flexBetween pt-2 border-t border-gray-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-xs font-semibold text-gray-700 capitalize">{item.status}</span>
                        </div>
                        <button 
                          onClick={loadOrderData} 
                          className="btn-secondary text-xs !py-1.5 !px-4 shadow-sm"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
