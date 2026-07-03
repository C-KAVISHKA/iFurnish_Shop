import React from "react";
import { motion } from "framer-motion";

const Title = ({ title1, title2, titleStyles, title1Styles, paraStyles }) => {
  return (
    <motion.div 
      className={`${titleStyles} flex flex-col items-center text-center pb-6`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 
        className={`text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight ${title1Styles}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title1}
        <span className="gradient-text font-semibold"> {title2}</span>
      </h3>
      <motion.div 
        className="flex items-center gap-x-1.5 mt-4"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
        <div className="w-12 h-[3px] bg-gradient-to-r from-secondary to-[#d4795f] rounded-full"></div>
        <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
      </motion.div>
      <p className={`${paraStyles} text-gray-500 text-sm mt-3 max-w-md hidden`}>
        Discover the latest in modern furniture, crafted for style and comfort.
      </p>
    </motion.div>
  );
};

export default Title;
