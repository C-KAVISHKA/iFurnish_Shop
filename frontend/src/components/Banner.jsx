import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import banner1 from "../assets/4.jpg";
import { motion, AnimatePresence } from "framer-motion";
import banner2 from "../assets/b2.png";
import banner3 from "../assets/b3.png";
import banner4 from "../assets/b4.png";

const Banner = () => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const banners = [banner1, banner2, banner3, banner4];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 mb-16">
      <motion.div 
        className="flexBetween bg-white border border-gray-100/60 shadow-xl rounded-[2.5rem] overflow-hidden relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Text Content */}
        <div className="hidden lg:block flex-1 px-8 xl:px-16 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block bg-secondary/10 text-secondary text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full uppercase mb-4">
              Premium Collection
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h2 uppercase font-extrabold text-gray-800 tracking-tight"
          >
            Unmatched Quality,
            <br />
            <span className="gradient-text">Endless Style</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base uppercase font-medium text-gray-400 mt-2 tracking-wide"
          >
            Discover furniture that redefines comfort and quality
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex mt-8"
          >
            <Link
              to={"/collection"}
              className="btn-premium btn-secondary !pr-0 !py-0 flexCenter rounded-full gap-x-2 group shadow-md"
            >
              Explore Collection
              <FaArrowRight className="bg-white text-tertiary rounded-full h-9 w-9 p-3 m-[3px] group-hover:-rotate-[20deg] transition-all duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* Banner Image with crossfade */}
        <div className="flex-1 w-full h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={bannerIndex}
              src={banners[bannerIndex]}
              alt="Banner"
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Banner Progress Indicators */}
        <div className="absolute bottom-4 right-4 flex gap-x-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === bannerIndex
                  ? "w-6 bg-secondary"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;
