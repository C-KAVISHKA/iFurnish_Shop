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
      className="card-hover group flex flex-col justify-between overflow-hidden bg-white border border-gray-100/80 rounded-3xl p-4 shadow-sm"
    >
      <Link
        to={`/product/${product._id}`}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 flexCenter h-48 w-full mb-3"
      >
        <motion.img
          src={product.image[0]}
          className="h-40 w-auto object-contain transition-transform duration-700 group-hover:scale-110"
          whileHover={{ rotate: [0, -2, 2, 0] }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl flex items-end justify-center pb-3">
          <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
            Quick View
          </span>
        </div>
      </Link>
      <div className="flex flex-col flex-1">
        <h4 className="bold-15 line-clamp-1 text-gray-800 group-hover:text-secondary transition duration-300">
          {product.name}
        </h4>
        <div className="flexBetween mt-1.5 mb-2">
          <h5 className="h5 text-gray-900 font-bold">
            <span className="text-secondary">${product.price}</span>
            <span className="text-xs text-gray-400 font-normal">.00</span>
          </h5>
          <div className="flex items-center gap-x-1 bg-amber-50 px-2 py-0.5 rounded-full">
            <FaStar className="text-amber-400 text-[11px]" />
            <span className="text-[11px] text-amber-600 font-semibold">4.8</span>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-gray-400 leading-relaxed mb-3">
          {product.description}
        </p>
        <Link 
          to={`/product/${product._id}`}
          className="mt-auto flex items-center justify-center gap-x-2 bg-gradient-to-r from-secondary to-[#d4795f] text-white text-xs font-semibold py-2.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20"
        >
          <TbShoppingBagPlus className="text-base" />
          View Product
        </Link>
      </div>
    </motion.div>
  );
};

export default Item;
