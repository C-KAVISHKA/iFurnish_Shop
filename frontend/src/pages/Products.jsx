import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Filter, Search, Star } from "lucide-react";

const Products = () => {
  const { products, loading, addToCart } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const text = "Discover our exclusive range of high-quality products";

  // Extract unique categories
  const categories = ["All", ...new Set(products.map(product => product.category || "Uncategorized"))];

  // Filter products based on search and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== "All") {
      result = result.filter(product => product.category === activeCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        className="relative h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            className="absolute w-full h-full object-cover"
          >
            <source src="/videos/hero-3.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          {/* Responsive heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-500"
            style={{ fontFamily: "'Dancing Script', cursive" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Our Products
          </motion.h1>
          
          {/* Subtitle animation */}
          <p className="text-xs sm:text-base md:text-xl text-white/90 mt-2 max-w-md">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03, duration: 0.1 }}
              >
                {char}
              </motion.span>
            ))}
          </p>
          
          {/* Search Bar */}
          <motion.div 
            className="mt-5 sm:mt-8 w-full max-w-xl relative px-2 sm:px-0"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-secondary text-gray-700 pr-12 bg-white/95 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 text-gray-400" size={18} />
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Navigation */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto overflow-x-auto pb-1 flex items-center gap-1.5 sm:gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <p className="text-gray-400 text-xs sm:text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        {/* Products Grid - 2 Column Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="relative overflow-hidden group">
                <Link to={`/single-product/${product._id}`} className="block cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100/50 flexCenter">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-36 xs:h-44 sm:h-56 object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </Link>
                
                {product.popular && (
                  <div className="absolute top-2 left-2 bg-secondary text-white px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                    POPULAR
                  </div>
                )}
              </div>
              
              <div className="p-3 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < (product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                    />
                  ))}
                  <span className="text-[10px] sm:text-xs text-gray-400 ml-1">
                    (4.8)
                  </span>
                </div>
                
                <Link to={`/single-product/${product._id}`} className="block">
                  <h3 className="font-bold text-gray-800 text-xs sm:text-base mb-1 hover:text-secondary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-400 text-[11px] sm:text-xs line-clamp-2 mb-3 hidden xs:block">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div>
                    <span className="text-secondary font-bold text-sm sm:text-lg">
                      ${product.price}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product._id, product.sizes?.[0] || "Wood")}
                    className="bg-gradient-to-r from-secondary to-[#d4795f] text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold hover:shadow-md transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl p-4">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4">Try changing your search or filter criteria</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('All');}}
              className="px-5 py-2.5 bg-secondary text-white text-xs sm:text-sm rounded-full hover:bg-secondary/90 transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;