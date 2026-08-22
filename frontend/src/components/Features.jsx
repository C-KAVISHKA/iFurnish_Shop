import React from "react";
import img2 from "../assets/features/2.jpg";
import img6 from "../assets/features/6.jpg";
import { motion } from "framer-motion";
import { FaCube, FaShieldAlt, FaBrain } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const features = [
  {
    icon: FaCube,
    title: "AR Powered Space Visualizer",
    description:
      "Transform the way you shop for furniture with our cutting-edge AR-powered experience! Visualize how each piece fits into your space in real-time, explore different styles, colors, and arrangements, and make confident decisions before you buy.",
    gradient: "from-orange-500/10 to-amber-500/5",
    iconColor: "text-orange-500",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Checkout & Payments",
    description:
      "Enjoy a safe and seamless shopping experience with our highly secure payment options. We use advanced encryption and trusted payment gateways to protect your transactions, ensuring your personal and financial information remains safe.",
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: FaBrain,
    title: "Smart AI Recommendation",
    description:
      "Discover the perfect furniture effortlessly with our AI-powered recommendation system! Simply upload an image, and our smart AI will suggest matching products tailored to your style. Plus, get personalized design advice from our AI Assistant.",
    gradient: "from-violet-500/10 to-purple-500/5",
    iconColor: "text-violet-500",
  },
];

const Features = () => {
  return (
    <section className="max-padd-container pt-10 sm:pt-14 pb-12 sm:pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_2fr] gap-6 gap-y-8 sm:gap-y-12 rounded-xl">
        {/* Decorative Images */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flexCenter gap-x-4 sm:gap-x-10"
        >
          <motion.div variants={imageVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={img2}
              alt="Feature showcase"
              className="rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-500 h-14 sm:h-20 w-auto object-cover"
            />
          </motion.div>
          <motion.div variants={imageVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={img6}
              alt="Feature showcase"
              className="rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-500 h-14 sm:h-20 w-auto object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-nowrap gap-4 sm:gap-6 mt-4 sm:mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="card-hover flex-1 bg-white border border-gray-100 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm min-h-[220px] sm:min-h-[280px] flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="feature-icon-circle mb-4 sm:mb-5">
                  <feature.icon className={`text-lg sm:text-xl ${feature.iconColor} transition-colors duration-300`} />
                </div>
                
                <h4 className="capitalize text-secondary font-bold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-secondary/90 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
