import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <div className="max-padd-container py-8 sm:py-12 flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-5 sm:p-8 md:p-12 rounded-3xl shadow-xl max-w-6xl w-full border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sm:mb-16">
            <div className="max-w-lg">
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">About Us</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Experience the future of furniture shopping with our AR and AI-powered solutions.
              </p>
            </div>
            <Link to="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto btn-secondary text-xs sm:text-sm !py-3 !px-6 shadow-md hover:shadow-lg transition">
                Contact Us
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 bg-gray-50/70 p-5 rounded-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-2 sm:mb-3">01</h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Who We Are</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We redefine interior design with cutting-edge technology, making your vision a reality.
              </p>
            </div>

            <div className="col-span-1 bg-gray-50/70 p-5 rounded-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-2 sm:mb-3">02</h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">What We Do</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our AI-driven recommendations and AR visualization bring your dream furniture to life.
              </p>
            </div>

            <div className="col-span-1 bg-gray-50/70 p-5 rounded-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-2 sm:mb-3">03</h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">How We Help</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Explore and customize furniture in real-time using AR, ensuring a perfect fit for your space.
              </p>
            </div>

            <div className="col-span-1 bg-gray-50/70 p-5 rounded-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-2 sm:mb-3">04</h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Your Story</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Elevate your home with smart furniture choices guided by AI-powered insights.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
            <div className="col-span-1 h-48 sm:h-64">
              <img
                src="/1.png"
                alt="Interior design"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="col-span-1 h-48 sm:h-64">
              <img
                src="/b4.png"
                alt="Modern furniture"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="col-span-1 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 sm:gap-4 h-48 sm:h-64">
              <img
                src="/bg.jpg"
                alt="Chair design"
                className="w-full h-full object-cover rounded-2xl"
              />
              <img
                src="/b3.png"
                alt="Living room"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;