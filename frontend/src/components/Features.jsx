import React from "react";
import img1 from "../assets/features/5.jpg";
import img2 from "../assets/features/2.jpg";
import img3 from "../assets/features/3.jpg";
import img4 from "../assets/features/4.jpg";
import img6 from "../assets/features/6.jpg";
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

const Features = () => {
  return (
    <section className="max-padd-container pt-14 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_2fr] gap-6 gap-y-12 rounded-xl">
        <div className="flexCenter gap-x-10">
          <motion.div
            variants={fadeUp(0.4)}
            initial="hidden"
            whileInView="show"
          >
            <img
              src={img2}
              alt=""
              height={77}
              width={222}
              className="rounded-full "
            />
          </motion.div>
          <motion.div
            variants={fadeUp(0.8)}
            initial="hidden"
            whileInView="show"
          >
            <img
              src={img6}
              alt=""
              height={77}
              width={222}
              className="rounded-full "
            />
          </motion.div>
        </div>
        <div className="flexCenter flex-wrap lg:flex-nowrap gap-6 mt-12">
          <div className="flex-1 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[260px] flex flex-col justify-between">
            <motion.h4
              variants={fadeDown(0.2)}
              initial="hidden"
              whileInView="show"
              className="h4 capitalize text-secondary font-bold text-lg mb-3"
            >
              AR Powered Space Visualizer
            </motion.h4>
            <motion.p
              variants={fadeUp(0.4)}
              initial="hidden"
              whileInView="show"
              className="text-gray-500 text-sm leading-relaxed"
            >
              Transform the way you shop for furniture with our cutting-edge
              AR-powered experience! Visualize how each piece fits into your
              space in real-time, explore different styles, colors, and
              arrangements, and make confident decisions before you buy.
            </motion.p>
          </div>
          
          <div className="flex-1 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[260px] flex flex-col justify-between">
            <motion.h4
              variants={fadeDown(0.4)}
              initial="hidden"
              whileInView="show"
              className="h4 capitalize text-secondary font-bold text-lg mb-3"
            >
              Secure Checkout & Payments
            </motion.h4>
            <motion.p
              variants={fadeUp(0.6)}
              initial="hidden"
              whileInView="show"
              className="text-gray-500 text-sm leading-relaxed"
            >
              Enjoy a safe and seamless shopping experience with our highly
              secure payment options. We use advanced encryption and trusted
              payment gateways to protect your transactions, ensuring your
              personal and financial information remains safe.
            </motion.p>
          </div>
          
          <div className="flex-1 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[260px] flex flex-col justify-between">
            <motion.h4
              variants={fadeDown(0.6)}
              initial="hidden"
              whileInView="show"
              className="h4 capitalize text-secondary font-bold text-lg mb-3"
            >
              Smart AI Recommendation
            </motion.h4>
            <motion.p 
              variants={fadeUp(0.8)} 
              initial="hidden" 
              whileInView="show"
              className="text-gray-500 text-sm leading-relaxed"
            >
              Discover the perfect furniture effortlessly with our AI-powered recommendation system! Simply upload an image, and our smart AI will suggest matching products tailored to your style. Plus, get personalized design advice from our AI Assistant.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
