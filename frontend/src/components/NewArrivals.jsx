import React, { useContext, useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Title from "./Title";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Item from "./Item";
import { ShopContext } from "../context/ShopContext";

const NewArrivals = () => {
  const { products } = useContext(ShopContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const data = products.slice(0, 10);
    setNewArrivals(data);
  }, [products]);

  return (
    <section className="max-padd-container pt-12 sm:pt-16 pb-6 bg-primary">
      <Title title1={'New'} title2={'Arrivals'} titleStyles={'pb-6 sm:pb-10'} paraStyles={'!block'}/>
      <Swiper
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.3,
            spaceBetween: 12,
          },
          380: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 28,
          },
        }}
        navigation={false}
        modules={[Autoplay, Pagination]}
        className="h-[400px] xs:h-[450px] sm:h-[460px] pb-8"
      >
        {newArrivals.map((product) => (
          <SwiperSlide key={product._id || product.id}>
            <Item product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default NewArrivals;
