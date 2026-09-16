import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import Item from "./Item";

const PopularProducts = () => {
  const { products } = useContext(ShopContext);
  const [popularProducts, setpopularProducts] = useState([]);

  useEffect(() => {
    const data = products.filter((item) => item.popular);
    // Keep the original DB order — the first products in the array
    // are the flagship 3D-ready ones, so they naturally appear first
    setpopularProducts(data.slice(0, 8));
  }, [products]);

  return (
    <section className="max-padd-container py-12 sm:py-16 bg-primary">
      <Title
        title1={"Popular"}
        title2={"Products"}
        titleStyles={"pb-6 sm:pb-10"}
        paraStyles={"!block"}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
        {popularProducts.map((product) => (
          <Item product={product} key={product._id} />
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
