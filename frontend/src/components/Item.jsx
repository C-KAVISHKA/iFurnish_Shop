import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { motion } from "framer-motion";
import { TbShoppingBagPlus } from "react-icons/tb";

const Item = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="card-hover group flex flex-col justify-between overflow-hidden bg-white border border-gray-100/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm"
    >
      <Link
        to={`/product/${product._id}`}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 flexCenter h-36 xs:h-44 sm:h-48 w-full mb-2 sm:mb-3"
      >
        <motion.img
          src={product.image[0]}
          alt={product.name}
          className="h-28 xs:h-36 sm:h-40 w-auto object-contain transition-transform duration-700 group-hover:scale-110"
          whileHover={{ rotate: [0, -2, 2, 0] }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl flex items-end justify-center pb-3">
          <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
            Quick View
          </span>
        </div>
      </Link>
      <div className="flex flex-col flex-1">
        <h4 className="text-xs sm:text-sm font-bold line-clamp-1 text-gray-800 group-hover:text-secondary transition duration-300">
          {product.name}
        </h4>
        <div className="flexBetween mt-1 mb-1.5 sm:mb-2">
          <h5 className="text-sm sm:text-base text-gray-900 font-bold">
            <span className="text-secondary">${product.price}</span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-normal">.00</span>
          </h5>
          <div className="flex items-center gap-x-0.5 sm:gap-x-1 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-full">
            <FaStar className="text-amber-400 text-[10px] sm:text-[11px]" />
            <span className="text-[10px] sm:text-[11px] text-amber-600 font-semibold">4.8</span>
          </div>
        </div>
        <p className="line-clamp-2 text-[11px] sm:text-xs text-gray-400 leading-relaxed mb-2 sm:mb-3 hidden xs:block">
          {product.description}
        </p>
        <Link 
          to={`/product/${product._id}`}
          className="mt-auto flex items-center justify-center gap-x-1.5 sm:gap-x-2 bg-gradient-to-r from-secondary to-[#d4795f] text-white text-[11px] sm:text-xs font-semibold py-2 sm:py-2.5 rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-secondary/20"
        >
          <TbShoppingBagPlus className="text-sm sm:text-base" />
          View Product
        </Link>
      </div>
    </motion.div>
  );
};

export default Item;
