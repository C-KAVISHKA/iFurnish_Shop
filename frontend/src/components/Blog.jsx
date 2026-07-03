import React from "react";
import Title from "./Title";
import { blogs } from "../assets/data";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

export default function Blog() {
  return (
    <section className="max-padd-container py-16">
      <Title
        title1={"Our Expert"}
        title2={"Blog"}
        title1Styles={"pb-10"}
        paraStyles={"!block"}
      />
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.name || idx}
            variants={cardVariants}
            className="card-hover bg-white border border-gray-100/60 rounded-3xl overflow-hidden shadow-sm flex flex-col group"
          >
            <div className="relative overflow-hidden h-[200px]">
              <img
                src={blog.image}
                alt={blog.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-3 left-3 bg-gradient-to-r from-secondary to-[#d4795f] text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full uppercase shadow-sm">
                {blog.category || "Design"}
              </div>
              {/* Read time badge */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                5 min read
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-secondary transition-colors duration-300">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  Discover professional insights, style trends, and design tricks curated by our interior experts to help elevate your home.
                </p>
              </div>
              <button className="flex items-center gap-x-2 text-secondary hover:text-secondary/80 font-bold text-xs mt-4 transition-colors self-start group/btn">
                Read More 
                <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
