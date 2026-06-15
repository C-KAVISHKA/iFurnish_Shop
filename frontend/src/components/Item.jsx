import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { motion } from "framer-motion";

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
        type: "spring",
        damping: 20
      },
    },
  };
};

const Item = ({ product }) => {
  return (
    <div className="group flex flex-col justify-between overflow-hidden bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link
        to={`/product/${product._id}`}
        className="relative overflow-hidden rounded-2xl bg-gray-50 flexCenter h-48 w-full mb-3"
      >
        <motion.img
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          src={product.image[0]}
          className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col flex-1">
        <h4 className="bold-15 line-clamp-1 text-gray-800 group-hover:text-secondary transition duration-300">
          {product.name}
        </h4>
        <div className="flexBetween mt-1.5 mb-2">
          <h5 className="h5 text-gray-900 font-semibold">${product.price}.00</h5>
          <div className="flex items-center gap-x-0.5">
            <FaStar className="text-yellow-400 text-xs" />
            <h5 className="h5 text-xs text-gray-500 relative top-[0.5px]">4.8</h5>
          </div>
        </div>
        <p className="line-clamp-3 text-xs text-gray-500 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default Item;
