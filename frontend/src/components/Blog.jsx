import React from "react";
import Title from "./Title";
import { blogs } from "../assets/data";
import { motion } from "framer-motion";

const fadeDown = (delay) => {
  return {
    hidden: { opacity: 0, y: -100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeRight = (delay) => {
  return {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeLeft = (delay) => {
  return {
    hidden: { opacity: 0, x: 100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blogs.map((blog, idx) => (
          <div
            key={blog.name || idx}
            className="bg-white border border-gray-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative overflow-hidden group h-[200px]">
              <motion.img
                variants={fadeDown(0.4)}
                initial="hidden"
                whileInView="show"
                src={blog.image}
                alt={blog.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                {blog.category || "Design"}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <motion.h3
                  variants={fadeDown(0.6)}
                  initial="hidden"
                  whileInView="show"
                  className="font-bold text-gray-800 text-base leading-snug mb-2 hover:text-secondary transition-colors"
                >
                  {blog.title}
                </motion.h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  Discover professional insights, style trends, and design tricks curated by our interior experts to help elevate your home.
                </p>
              </div>
              <button className="text-secondary hover:text-secondary/80 font-bold text-xs mt-4 inline-flex items-center gap-x-1 transition-colors self-start">
                Read More &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
