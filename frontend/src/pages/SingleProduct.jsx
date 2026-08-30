import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "../context/ProductContext"; // Updated to use ProductContext
import { FaCamera, FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import ProductDescription from "../components/ProductDescription";
import ProductFeatures from "../components/ProductFeatures";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../components/Footer";
import { getModelForProduct } from "../utils/modelMapper";

const SingleProduct = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ProductContext); // Using ProductContext
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProduct(selectedProduct);
      setImage(selectedProduct.image[0]);
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="max-padd-container">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
        <div className="flex gap-6 sm:gap-12 flex-col xl:flex-row bg-primary shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8">
          {/* Product Images Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-center sm:items-start justify-center flex-1">
            <div className="flex sm:flex-col gap-2 overflow-x-auto max-w-full p-1 no-scrollbar">
              {product.image.map((img, index) => (
                <img
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl cursor-pointer object-cover border-2 transition-all ${
                    image === img ? "border-secondary shadow-md scale-105" : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                  src={img}
                  key={index}
                  alt="product thumbnail"
                  onClick={() => setImage(img)}
                />
              ))}
            </div>
            <div className="w-full max-w-sm sm:max-w-md aspect-square bg-white rounded-2xl p-4 shadow-sm flexCenter overflow-hidden">
              <img className="w-full h-full object-contain transition-transform duration-500 hover:scale-105" src={image} alt={product.name} />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 xl:px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h3>
            <div className="flex items-center gap-2 text-yellow-500 mb-3">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
              <span className="text-gray-400 text-xs sm:text-sm font-medium">(134 Reviews)</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-secondary mb-3">{currency}{product.price}.00</h4>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.sort((a, b) => {
                    const order = ["XS", "S", "M", "L", "XL", "XXL"];
                    return order.indexOf(a) - order.indexOf(b);
                  }).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSize(item)}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                        size === item ? "bg-secondary text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-6">
              <button
                className="w-full sm:flex-1 bg-secondary text-white font-semibold py-3 px-6 rounded-xl flexCenter gap-x-2 hover:bg-secondary/90 shadow-md transition-all duration-300"
                onClick={() => addToCart(product._id, size || (product.sizes && product.sizes[0]) || "Standard")}
              >
                Add to Cart <TbShoppingBagPlus className="text-lg" />
              </button>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button className="p-3.5 bg-white text-gray-600 rounded-xl hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-100 shadow-sm">
                  <FaHeart />
                </button>
                <Link to={`/arview?id=${product._id}&model=${getModelForProduct(product)}&price=${product.price}`} className="flex-1 sm:flex-initial">
                  <button className="w-full p-3.5 px-4 bg-white text-secondary font-semibold rounded-xl hover:bg-secondary/10 transition-colors border border-secondary/20 shadow-sm flexCenter gap-x-2 text-xs sm:text-sm whitespace-nowrap" aria-label="View in AR">
                    <FaCamera />
                    <span>3D AR View</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200/60 text-gray-500 text-xs sm:text-sm">
              <FaTruckFast className="text-secondary text-base" />
              <span>Fast delivery right to your door</span>
            </div>
          </div>
        </div>

        <ProductDescription />
        <ProductFeatures />
        <RelatedProducts category={product.category} subCategory={product.subCategory} />
      </div>
      <Footer />
    </div>
  );
};

export default SingleProduct;
