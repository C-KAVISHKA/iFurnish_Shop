import React from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import XrHitModelContainer from "./components/xr-hit-model/XrHitModelContainer";
import PlaceOrder from "./pages/PlaceOrder";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Recommendations from "./pages/Recomendation";
import ChatBot from "./pages/Chatbot";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Verify from "./pages/Verify";
import About from "./pages/About";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const App = () => {
  const location = useLocation();

  return (
    <main className="overflow-hidden text-[#404040] bg-[#faf8f6] min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          fontSize: "14px",
        }}
      />
      <ScrollToTop />
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={pageTransition.transition}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/single-product/:productId" element={<SingleProduct />} />
            <Route path="/products" element={<Products />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/recommendations" element={<Recommendations />} />
            {/*  <Route path="/ar-view/:productId" element={<ArView />} /> */}
            <Route path="/arview" element={<XrHitModelContainer />} />
            <Route path="/ai-assistant" element={<ChatBot />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default App;
