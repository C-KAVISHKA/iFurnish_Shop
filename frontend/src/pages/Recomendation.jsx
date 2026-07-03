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
    const filename = imagePath.replace(/\\/g, '/').split('/').pop().toLowerCase();
    
    return productsList.find(p => 
      p.image && p.image.some(img => {
        const imgFilename = img.replace(/\\/g, '/').split('/').pop().toLowerCase();
        return imgFilename === filename;
      })
    );
  };

  const mapRecommendationsToProducts = (imagePaths) => {
    return imagePaths.map((imagePath, index) => {
      const matchedProduct = getProductByImageName(imagePath, products);
      if (matchedProduct) {
        return matchedProduct;
      }
      
      const cleanImgPath = "/" + imagePath.replace(/\\/g, '/');
      return {
        _id: `dummy_${index}`,
        name: `Furniture ${index + 1}`,
        description: `Experience the comfort and modern styling of this premium design item.`,
        price: Math.round(150 + index * 35),
        image: [cleanImgPath],
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
      const response = await axios.post(
        `http://${window.location.hostname}:5001/recommend`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
    <div className="min-h-screen bg-gradient-to-tr from-[#faf8f6] via-[#f7f3ed] to-[#f0e9df]">
      <div className="relative overflow-hidden mb-8 w-full py-16 bg-gradient-to-r from-secondary/80 to-indigo-500/80">
        <div className="absolute inset-0 bg-rc bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Section with Animated Title */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 tracking-tight">
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-secondary"
              >
                AI
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {" Product Recommendations"}
              </motion.span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Upload a photo of furniture you like and we'll find similar products for you instantly.
            </motion.p>
          </motion.div>
          
          {/* Upload Section */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glassmorphism p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto mb-10 border border-white/40"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
                  className={`flex items-center justify-center gap-2 px-6 py-3 ${
                    selectedImage ? "bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600" : "bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary"
                  } text-white rounded-xl cursor-pointer font-medium shadow-md w-full sm:w-auto transition duration-300`}
                >
                  {selectedImage ? (
                    <>
                      <FaRegCheckCircle size={20} />
                      <span>Uploaded</span>
                    </>
                  ) : (
                    <>
                      <FaFileUpload size={20} />
                      <span>Upload Image</span>
                    </>
                  )}
                </motion.div>
              </div>
              
              <motion.button
                whileHover={selectedImage ? { scale: 1.02, y: -1 } : {}}
                whileTap={selectedImage ? { scale: 0.98 } : {}}
                onClick={fetchRecommendations}
                disabled={!selectedImage}
                className={`${
                  selectedImage
                    ? "bg-gradient-to-r from-secondary to-indigo-500 hover:from-secondary/90 hover:to-indigo-600 shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium w-full sm:w-auto transition duration-300`}
              >
                Find Similar <FaSearch />
              </motion.button>
              
              <motion.button
                whileHover={selectedImage ? { scale: 1.02, y: -1 } : {}}
                whileTap={selectedImage ? { scale: 0.98 } : {}}
                onClick={handleReset}
                disabled={!selectedImage}
                className={`${
                  selectedImage
                    ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium w-full sm:w-auto transition duration-300`}
              >
                Reset <FaCircleNotch />
              </motion.button>
            </div>

            {/* Image Preview Section */}
            {uploadedImageURL && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Uploaded Image</h2>
                <div className="border-2 border-secondary/30 p-2.5 rounded-2xl shadow-lg bg-white">
                  <img
                    src={uploadedImageURL}
                    alt="Uploaded furniture"
                    className="h-48 w-48 object-cover rounded-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">We'll find products similar to this image</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Loading Indicator */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-secondary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Finding similar products...</p>
            </motion.div>
          )}

          {/* Recommendations Section */}
          {!loading && recommendations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                <span className="text-secondary">Recommended</span> Products
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                {recommendations.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)" }}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-secondary text-white rounded-full px-3.5 py-1 text-sm font-bold shadow-md">
                        ${product.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-5 h-12 overflow-hidden text-ellipsis line-clamp-2">{product.description}</p>
                      <Link 
                        to={product.isDummy ? "/collection" : `/product/${product._id}`} 
                        className="block w-full"
                      >
                        <button className="w-full bg-gradient-to-r from-secondary to-indigo-500 hover:from-secondary/90 hover:to-indigo-600 text-white py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm">
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
              <div className="bg-secondary/5 border border-secondary/15 rounded-3xl p-8 max-w-md mx-auto shadow-inner">
                <FaFileUpload className="text-secondary text-5xl mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Upload an image to get started</h3>
                <p className="text-gray-600">We'll use AI to find similar furniture products that match your style.</p>
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