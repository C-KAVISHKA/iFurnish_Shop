import React, { useState } from "react";
import { FaMailBulk } from "react-icons/fa";
import { FaLocationDot, FaPhone, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const contactInfo = [
  {
    icon: FaLocationDot,
    title: "Location",
    detail: "132 Colombo Street, Colombo",
  },
  {
    icon: FaPhone,
    title: "Phone",
    detail: "+94 775434 344",
  },
  {
    icon: FaMailBulk,
    title: "Email Support",
    detail: "ifurnishshop@gmail.com",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-16">
      <motion.div 
        className="bg-white border border-gray-100/60 shadow-xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-secondary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        {/* Support Section */}
        <motion.div 
          className="flex items-start justify-between flex-col lg:flex-row gap-8 pb-8 border-b border-gray-100 bg-gradient-to-br from-[#fbf9f6]/60 to-transparent p-6 sm:p-8 rounded-[1.75rem] relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-gray-800">
              We are always here to <span className="gradient-text">help</span>
            </h4>
            <p className="text-gray-500 text-sm mt-1">
              Need assistance? Our team is here to support you with any inquiries
              anytime!
            </p>
          </motion.div>
          <div className="flexStart flex-wrap gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flexCenter gap-x-4 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flexCenter group-hover:bg-secondary group-hover:shadow-lg group-hover:shadow-secondary/20 transition-all duration-300">
                  <info.icon className="text-secondary text-sm group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-700 text-sm">
                    {info.title}
                  </h5>
                  <p className="text-gray-500 text-xs">
                    {info.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="mt-10 mb-8 bg-gradient-to-r from-tertiary to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-1">Subscribe to Our Newsletter</h4>
              <p className="text-white/60 text-xs">Get exclusive deals, design tips, and early access to new arrivals.</p>
            </div>
            <div className="flex w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input text-sm px-5 py-3 rounded-l-xl text-white placeholder-white/40 w-full sm:w-64 bg-white/10"
              />
              <button className="bg-secondary hover:bg-secondary/90 px-5 py-3 rounded-r-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/30 flex items-center gap-x-2 whitespace-nowrap">
                Subscribe <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Footer Links */}
        <motion.div 
          className="flex items-start justify-between flex-wrap gap-12 mt-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex flex-col max-w-sm gap-y-4">
            <div className="text-2xl font-bold tracking-tight text-gray-800">
              iFurnish<span className="text-secondary font-semibold">Shop</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover stylish and functional furniture designed to elevate your
              space with comfort and elegance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-x-3 mt-2">
              {["𝕏", "f", "in", "📸"].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-secondary hover:text-white text-gray-500 text-xs font-bold flexCenter transition-all duration-300 hover:shadow-md hover:shadow-secondary/20"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="flexStart gap-7 xl:gap-x-36 flex-wrap">
            <motion.ul variants={itemVariants}>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Customer Service</h4>
              {["Help center", "Payment methods", "Contact", "Shipping status", "Complaints"].map((item, i) => (
                <li key={i} className="my-2">
                  <a href="" className="link-underline text-gray-400 hover:text-secondary text-xs transition duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </motion.ul>
            <motion.ul variants={itemVariants}>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Legal</h4>
              {["Privacy Policy", "Cookie settings", "Terms & conditions", "Cancelation", "Imprint"].map((item, i) => (
                <li key={i} className="my-2">
                  <a href="" className="link-underline text-gray-400 hover:text-secondary text-xs transition duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </motion.ul>
            <motion.ul variants={itemVariants}>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Others</h4>
              {["Our teams", "Sustainability", "Press", "Jobs", "Newsletter"].map((item, i) => (
                <li key={i} className="my-2">
                  <a href="" className="link-underline text-gray-400 hover:text-secondary text-xs transition duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
        
        {/* Copyrights */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-[#faf8f6] to-[#f5f0eb] text-gray-400 text-xs py-4 px-8 rounded-2xl mt-10 gap-2">
          <span>&copy; 2026 iFurnish Shop. All Rights Reserved.</span>
          <span>Channasadhruwan@gmail.com</span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
