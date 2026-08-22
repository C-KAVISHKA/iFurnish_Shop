import React, { useContext, useEffect, useState } from "react";
import ShowSearch from "../components/ShowSearch";
import Item from "../components/Item";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import SkeletonCard from "../components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaAngleDown, FaAngleUp } from "react-icons/fa";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavant");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const itemsPerPage = 12;

  const toggleFilter = (value, setState) => {
    setState((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (category.length) {
      filtered = filtered.filter((product) =>
        category.includes(product.category)
      );
    }
    if (subCategory.length) {
      filtered = filtered.filter((product) =>
        subCategory.includes(product.subCategory)
      );
    }
    if (search && showSearch) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  };

  const applySorting = (productList) => {
    if (sortType === "price") {
      return productList.sort((a, b) => a.price - b.price);
    }
    if (sortType === "rating") {
      return productList.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }
    return productList;
  };

  useEffect(() => {
    const filtered = applyFilters();
    const sorted = applySorting(filtered);
    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [category, subCategory, search, showSearch, sortType, products]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [category, subCategory, search, showSearch, sortType, currentPage]);

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="max-padd-container !px-2 sm:!px-6 lg:!px-12">
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden flex items-center justify-between bg-primary p-3 rounded-2xl mb-4">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex items-center gap-x-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
        >
          <FaFilter className="text-secondary" />
          <span>Filters & Sort</span>
          {showMobileFilter ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        <span className="text-xs text-gray-500 font-medium">
          {filteredProducts.length} items
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-16">
        {/* Filter Sidebar */}
        <div
          className={`${
            showMobileFilter ? "block" : "hidden"
          } sm:block w-full sm:min-w-64 sm:w-64 bg-primary p-4 sm:pt-8 sm:pl-6 rounded-2xl sm:rounded-r-xl`}
        >
          <ShowSearch />
          <div className="p-4 mt-4 bg-white rounded-xl shadow-sm">
            <h5 className="h5 mb-3 font-bold text-gray-800">Categories</h5>
            <div className="flex flex-col gap-2 text-xs sm:text-sm font-light">
              {["Tables", "Chairs", "Sofas"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-secondary">
                  <input
                    onChange={(e) => toggleFilter(e.target.value, setCategory)}
                    type="checkbox"
                    checked={category.includes(cat)}
                    className="cursor-pointer rounded text-secondary focus:ring-secondary"
                    value={cat}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="p-4 mt-4 bg-white rounded-xl shadow-sm">
            <h5 className="h5 mb-3 font-bold text-gray-800">Sub Categories</h5>
            <div className="flex flex-col gap-2 text-xs sm:text-sm font-light">
              {["Office", "Home", "Outdoor"].map((subCat) => (
                <label
                  key={subCat}
                  className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-secondary"
                >
                  <input
                    onChange={(e) =>
                      toggleFilter(e.target.value, setSubCategory)
                    }
                    type="checkbox"
                    checked={subCategory.includes(subCat)}
                    className="cursor-pointer rounded text-secondary focus:ring-secondary"
                    value={subCat}
                  />
                  <span>{subCat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="p-4 mt-4 bg-white rounded-xl shadow-sm">
            <h5 className="h5 mb-3 font-bold text-gray-800">Sort By</h5>
            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              className="w-full bg-primary border border-slate-900/5 outline-none text-gray-700 text-xs sm:text-sm h-9 px-3 rounded-lg"
            >
              <option value="relavant">Relevant</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 bg-primary p-3 sm:p-6 rounded-2xl sm:rounded-l-xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : getPaginatedProducts().length > 0 ? (
              getPaginatedProducts().map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, type: "spring", damping: 18 }}
                >
                  <Item product={product} />
                </motion.div>
              ))
            ) : (
              <div className="flexCenter h-64 justify-center col-span-full text-gray-500 font-medium text-sm">
                No products found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10 mb-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`btn-secondary !py-1.5 !px-3 text-xs ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn-light !py-1.5 !px-3 text-xs ${
                    currentPage === i + 1 && "!bg-tertiary text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                } btn-secondary !py-1.5 !px-3 text-xs`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collection;
