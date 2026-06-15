import React from "react";
import { FaMailBulk } from "react-icons/fa";
import { FaLocationDot, FaPhone, FaQuestion } from "react-icons/fa6";
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

const Footer = () => {
  return (
    <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-16">
      <div className="bg-white border border-gray-100/60 shadow-xl rounded-[2.5rem] p-8 md:p-12">
        <div className="flex items-start justify-between flex-col lg:flex-row gap-8 pb-8 border-b border-gray-100 bg-[#fbf9f6]/40 p-6 sm:p-8 rounded-[1.75rem]">
          <div>
            <motion.h4
              variants={fadeUp(0.4)}
              initial="hidden"
              whileInView="show"
              className="text-xl font-bold text-gray-800"
            >
              We are always here to help
            </motion.h4>
            <motion.p variants={fadeUp(0.6)} initial="hidden" whileInView="show" className="text-gray-500 text-sm mt-1">
              Need assistance? Our team is here to support you with any inquiries
              anytime!
            </motion.p>
          </div>
          <div className="flexStart flex-wrap gap-8">
            <div className="flexCenter gap-x-4">
              <FaLocationDot className="text-secondary text-lg" />
              <div>
                <motion.h5
                  variants={fadeUp(0.8)}
                  initial="hidden"
                  whileInView="show"
                  className="font-bold text-gray-700 text-sm"
                >
                  Location
                </motion.h5>
                <motion.p
                  variants={fadeUp(1.0)}
                  initial="hidden"
                  whileInView="show"
                  className="text-gray-500 text-xs"
                >
                  132 Colombo Street, Colombo
                </motion.p>
              </div>
            </div>
            <div className="flexCenter gap-x-4">
              <FaPhone className="text-secondary text-lg" />
              <div>
                <motion.h5
                  variants={fadeUp(1.2)}
                  initial="hidden"
                  whileInView="show"
                  className="font-bold text-gray-700 text-sm"
                >
                  Phone
                </motion.h5>
                <motion.p
                  variants={fadeUp(1.4)}
                  initial="hidden"
                  whileInView="show"
                  className="text-gray-500 text-xs"
                >
                  +94 775434 344
                </motion.p>
              </div>
            </div>
            <div className="flexCenter gap-x-4">
              <FaMailBulk className="text-secondary text-lg" />
              <div>
                <motion.h5
                  variants={fadeUp(1.6)}
                  initial="hidden"
                  whileInView="show"
                  className="font-bold text-gray-700 text-sm"
                >
                  Email Support
                </motion.h5>
                <motion.p
                  variants={fadeUp(1.8)}
                  initial="hidden"
                  whileInView="show"
                  className="text-gray-500 text-xs"
                >
                  ifurnishshop@gmail.com
                </motion.p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start justify-between flex-wrap gap-12 mt-12">
          {/* logo - Left side */}
          <div className="flex flex-col max-w-sm gap-y-4">
            <div className="text-2xl font-bold tracking-tight text-gray-800">
              iFurnish<span className="text-secondary font-semibold">Shop</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover stylish and functional furniture designed to elevate your
              space with comfort and elegance.
            </p>
          </div>
          <div className="flexStart gap-7 xl:gap-x-36 flex-wrap">
            <ul>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Customer Service</h4>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Help center
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Payment methods
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Contact
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Shipping status
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Complaints
                </a>
              </li>
            </ul>
            <ul>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Legal</h4>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Privacy Policy
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Cookie settings
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Terms & conditions
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Cancelation
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Imprint
                </a>
              </li>
            </ul>
            <ul>
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Others</h4>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Our teams
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Sustainability
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Press
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Jobs
                </a>
              </li>
              <li className="my-2">
                <a href="" className="text-gray-400 hover:text-secondary text-xs transition duration-300">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* copyrights */}
        <div className="flex justify-between items-center bg-[#faf8f6] text-gray-400 text-xs py-3 px-8 rounded-2xl mt-8">
          <span>&copy; 2026 iFurnish Shop. All Rights Reserved.</span>
          <span>matheeshacham08@gmail.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
