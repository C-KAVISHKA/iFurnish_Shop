import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { FaBarsStaggered, FaRegCircleUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { TbBasket } from "react-icons/tb";
import { RiUserLine } from "react-icons/ri";
import { RiAiGenerate } from "react-icons/ri";
import { ShopContext } from "../context/ShopContext";
import { ProductContext } from "../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import chatbotIcon from "../assets/chatbot2.png";

const Header = () => {
  const { getCartCount, navigate } = useContext(ShopContext);
  const { token, setToken, CartCount } = useContext(ProductContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navi = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  return (
    <header className={`header-sticky w-full px-4 sm:px-6 lg:px-8 ${scrolled ? "header-scrolled" : ""}`}>
      <div className="flex items-center justify-between py-2 sm:py-3 max-w-[1440px] mx-auto">
        {/* Logo - Responsive sizing */}
        <Link to="/" className="flex items-center gap-x-2 group">
          <motion.div 
            className="text-xl font-bold sm:text-2xl md:text-3xl tracking-tight text-tertiary"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            iFurnish<span className="text-secondary font-semibold">Shop</span>
          </motion.div>
        </Link>

        {/* Navigation - Hidden on mobile, visible on xl */}
        <div className="hidden xl:block">
          <NavBar
            containerStyles="flex items-center justify-center gap-x-2 lg:gap-x-4 medium-15 ring-1 ring-slate-900/5 rounded-full py-1 px-2 bg-white/60 backdrop-blur-sm"
          />
        </div>

        {/* Action Icons - Fully responsive */}
        <div className="flex items-center gap-x-1 xs:gap-x-2 sm:gap-x-4 md:gap-x-6">
          {/* Mobile Menu Toggle */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="xl:hidden"
          >
            <FaBarsStaggered
              onClick={toggleMenu}
              className="cursor-pointer text-lg sm:text-xl hover:text-secondary transition-colors duration-300"
            />
          </motion.div>
          
          {/* AI-Powered Search - Responsive */}
          <div 
            className="relative"
            onMouseEnter={() => setShowAITooltip(true)} 
            onMouseLeave={() => setShowAITooltip(false)}
          >
            <motion.div 
              className="flex items-center cursor-pointer rounded-full"
              onClick={() => navi("/recommendations")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Base search icon for all devices */}
              <div className="flex items-center gap-x-1 bg-gradient-to-r from-secondary/10 to-secondary/5 p-1.5 sm:p-2 rounded-full hover:from-secondary/15 hover:to-secondary/10 transition-all duration-300">
                {/* AI icon - hidden on smallest screens */}
                <motion.div
                  className="hidden xs:block"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <RiAiGenerate className="text-base sm:text-lg text-secondary" />
                </motion.div>
                <FaSearch className="text-base sm:text-lg" />
              </div>
            </motion.div>
            
            {/* Tooltip - Responsive positioning */}
            <AnimatePresence>
              {showAITooltip && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute -left-12 xs:-left-16 top-10 bg-white p-2.5 rounded-xl shadow-lg text-xs w-36 text-center z-50 ring-1 ring-slate-900/5 font-medium"
                >
                  <span className="gradient-text font-bold">AI</span>-Powered Search
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 ring-1 ring-slate-900/5 ring-b-0 ring-r-0"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* AI Assistant */}
          <Link to="/ai-assistant" className="relative cursor-pointer flex">
            <motion.img
              src={chatbotIcon}
              alt="chatbot"
              className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.2 }}
            />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative cursor-pointer flex">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <TbBasket className="text-xl xs:text-2xl sm:text-[27px]" />
              <motion.span 
                className="bg-gradient-to-r from-secondary to-[#d4795f] text-white text-[10px] xs:text-[11px] sm:text-[12px] absolute font-semibold left-1 -top-2 xs:left-1.5 xs:-top-2.5 sm:-top-3.5 flexCenter w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] rounded-full shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {CartCount()}
              </motion.span>
            </motion.div>
          </Link>

          {/* User Menu */}
          <div className="group relative">
            <div>
              {token ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <FaRegCircleUser className="text-lg sm:text-xl md:text-[20px] cursor-pointer hover:text-secondary transition-colors duration-300" />
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-secondary hover:to-[#d4795f] hover:text-white text-xs xs:text-sm rounded-full py-1.5 px-3 sm:py-2 sm:px-4 cursor-pointer flex items-center justify-center gap-x-1 sm:gap-x-2 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Login <RiUserLine className="text-lg sm:text-xl" />
                </motion.button>
              )}
            </div>
            {token && (
              <ul className="bg-white/95 backdrop-blur-md p-2 w-28 sm:w-36 ring-1 ring-slate-900/5 rounded-xl absolute right-0 top-6 sm:top-7 hidden group-hover:flex flex-col text-xs sm:text-sm shadow-xl z-50 overflow-hidden">
                <li className="hover:bg-secondary/10 rounded-lg cursor-pointer text-tertiary p-2 sm:p-2.5 transition-colors duration-200">
                  <Link to="/profile">Profile</Link>
                </li>
                <li
                  onClick={() => navigate("orders")}
                  className="hover:bg-secondary/10 rounded-lg cursor-pointer text-tertiary p-2 sm:p-2.5 transition-colors duration-200"
                >
                  Orders
                </li>
                <li
                  onClick={logout}
                  className="hover:bg-red-50 hover:text-red-500 rounded-lg cursor-pointer text-tertiary p-2 sm:p-2.5 transition-colors duration-200"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only shown when toggled */}
      <AnimatePresence>
        {menuOpened && (
          <motion.div 
            className="xl:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <NavBar
              containerStyles="flex items-start flex-col w-full max-w-xs mx-auto gap-y-1 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-slate-900/5 z-50 mt-2 mb-3"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;