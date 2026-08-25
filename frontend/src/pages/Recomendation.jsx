import React, { useState, useContext } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { FaFileUpload, FaRegCheckCircle, FaSearch } from "react-icons/fa";
import { FaCircleNotch } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Recommendations = () => {
  const { products } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Set the maximum number of products to display
  const maxProductsToShow = 3;

  const getProductByImageName = (imagePath, productsList) => {
    if (!imagePath || !productsList) return null;
    
    // Only attempt to match with actual store inventory if the AI recommended an image from the 'images' directory
    // (since our store inventory files are only located in the /images/ folder).
    // This prevents collisions where 'table dataset/image_1.jpeg' incorrectly matches the store's '/images/image_1.jpeg'.
    const normalizedPath = imagePath.replace(/\\/g, '/').toLowerCase();
    if (!normalizedPath.startsWith('images/')) return null;

    const filename = normalizedPath.split('/').pop();
    
    return productsList.find(p => 
      p.image && p.image.some(img => {
        const imgFilename = img.replace(/\\/g, '/').split('/').pop().toLowerCase();
        return imgFilename === filename;
      })
    );
  };

  const getRecBaseUrl = () => {
    const envUrl = import.meta.env.VITE_RECOMMENDATION_URL;
    if (envUrl && envUrl.trim() !== "") {
      return envUrl.trim().replace(/\/+$/, "");
    }
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return isLocal ? "http://localhost:5001" : "https://skincare-resend-emcee.ngrok-free.dev";
  };

  const mapRecommendationsToProducts = (imagePaths) => {
    const recBase = getRecBaseUrl();
    return imagePaths.map((imagePath, index) => {
      const matchedProduct = getProductByImageName(imagePath, products);
      if (matchedProduct) {
        return matchedProduct;
      }
      const cleanImgPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
      return {
        _id: `dummy_${index}`,
        name: `Furniture ${index + 1}`,
        description: `Experience the comfort and modern styling of this premium design item.`,
        price: Math.round(150 + index * 35),
        image: [`${recBase}/${encodeURI(cleanImgPath)}`],
        isDummy: true
      };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    if (file) {
      setUploadedImageURL(URL.createObjectURL(file));
    }
  };

  const fetchRecommendations = async () => {
    if (!selectedImage) {
      alert("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setLoading(true);
    try {
      const recBase = getRecBaseUrl();
      const response = await axios.post(
        `${recBase}/recommend`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Bypass-Tunnel-Reminder": "true"
          },
        }
      );
      const aiOutput = response.data.recommendations;
      // Limit the number of images to maxProductsToShow
      const limitedImages = aiOutput.slice(0, maxProductsToShow);
      const mappedProducts = mapRecommendationsToProducts(limitedImages);
      setRecommendations(mappedProducts);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setRecommendations([]);
    setUploadedImageURL("");
  };

  // Animation variants for better UI feedback
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Hero Section with Natural Living Room Photo Background */}
      <div className="relative overflow-hidden mb-8 w-full py-12 sm:py-16 shadow-lg">
        {/* Natural Background Photo */}
        <div className="absolute inset-0 bg-rc bg-cover bg-center"></div>
        {/* Soft Neutral Contrast Overlay - Preserves Real Photo Colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55 backdrop-blur-[0.5px]"></div>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Section with Animated Title */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-2 sm:mb-4 tracking-tight text-white drop-shadow-sm font-serif">
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-amber-200"
              >
                AI Visual
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {" Similarity Search"}
              </motion.span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-xs sm:text-base md:text-lg max-w-2xl mx-auto px-2 font-light"
            >
              Upload a photo of furniture you like and our ResNet-50 deep learning engine will find similar catalog items instantly.
            </motion.p>
          </motion.div>
          
          {/* Upload Section */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glassmorphism p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl mx-auto mb-8 sm:mb-10 border border-white/50 bg-white/85 backdrop-blur-xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative inline-block w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                  aria-label="Upload an image"
                />
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 ${
                    selectedImage ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" : "bg-gradient-to-r from-secondary to-[#d4795f] hover:from-[#a04a34] hover:to-secondary"
                  } text-white rounded-xl cursor-pointer text-xs sm:text-sm font-medium shadow-md w-full sm:w-auto transition duration-300`}
                >
                  {selectedImage ? (
                    <>
                      <FaRegCheckCircle size={18} />
                      <span>Uploaded</span>
                    </>
                  ) : (
                    <>
                      <FaFileUpload size={18} />
                      <span>Upload Image</span>
                    </>
                  )}
                </motion.div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <motion.button
                  whileHover={selectedImage ? { scale: 1.02, y: -1 } : {}}
                  whileTap={selectedImage ? { scale: 0.98 } : {}}
                  onClick={fetchRecommendations}
                  disabled={!selectedImage}
                  className={`${
                    selectedImage
                      ? "bg-gradient-to-r from-secondary to-[#d4795f] hover:from-[#a04a34] hover:to-secondary text-white shadow-md font-semibold"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium transition duration-300`}
                >
                  Find Similar <FaSearch size={14} />
                </motion.button>
                
                <motion.button
                  whileHover={selectedImage ? { scale: 1.02, y: -1 } : {}}
                  whileTap={selectedImage ? { scale: 0.98 } : {}}
                  onClick={handleReset}
                  disabled={!selectedImage}
                  className={`${
                    selectedImage
                      ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium transition duration-300`}
                >
                  Reset <FaCircleNotch size={14} />
                </motion.button>
              </div>
            </div>

            {/* Image Preview Section */}
            {uploadedImageURL && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-base sm:text-xl font-semibold mb-3 text-gray-800">Your Uploaded Image</h2>
                <div className="border-2 border-secondary/30 p-2 rounded-2xl shadow-lg bg-white">
                  <img
                    src={uploadedImageURL}
                    alt="Uploaded furniture"
                    className="h-36 w-36 sm:h-48 sm:w-48 object-cover rounded-xl"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">We'll find products similar to this image</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Loading Indicator */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 sm:py-12"
            >
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-secondary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-transparent border-t-secondary rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-white font-medium text-xs sm:text-sm drop-shadow">Extracting 2,048-D features & matching catalog...</p>
            </motion.div>
          )}

          {/* Recommendations Section - 2 Column Mobile Grid */}
          {!loading && recommendations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-8 sm:mt-12"
            >
              <h2 className="text-xl sm:text-3xl font-bold mb-6 text-center text-white drop-shadow">
                <span className="text-amber-200">Recommended</span> Products
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
                {recommendations.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)" }}
                    className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-36 xs:h-44 sm:h-60 overflow-hidden bg-gray-50 flexCenter p-2">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-secondary to-[#d4795f] text-white rounded-full px-2 sm:px-3.5 py-0.5 sm:py-1 text-xs sm:text-sm font-bold shadow-md">
                        ${product.price}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <h3 className="text-xs sm:text-base font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                      <p className="text-gray-400 text-[11px] sm:text-xs mb-3 line-clamp-2 hidden xs:block">{product.description}</p>
                      <Link 
                        to={product.isDummy ? "/collection" : `/product/${product._id}`} 
                        className="block w-full mt-auto"
                      >
                        <button className="w-full bg-gradient-to-r from-secondary to-[#d4795f] hover:from-[#a04a34] hover:to-secondary text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!loading && !recommendations.length && !uploadedImageURL && (
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center py-8"
            >
              <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 max-w-md mx-auto shadow-xl">
                <FaFileUpload className="text-secondary text-5xl mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Upload an image to get started</h3>
                <p className="text-gray-600 text-sm">We'll use AI to find similar furniture products that match your style.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;