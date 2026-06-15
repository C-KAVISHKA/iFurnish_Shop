import React from "react";

const Title = ({ title1, title2, titleStyles, title1Styles, paraStyles }) => {
  return (
    <div className={`${titleStyles} flex flex-col items-center text-center pb-6`}>
      <h3 
        className={`text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight ${title1Styles}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title1}
        <span className="text-secondary font-semibold"> {title2}</span>
      </h3>
      <div className="w-12 h-[3px] bg-secondary/80 mt-3 rounded-full"></div>
      <p className={`${paraStyles} text-gray-500 text-sm mt-3 max-w-md hidden`}>
        Discover the latest in modern furniture, crafted for style and comfort.
      </p>
    </div>
  );
};

export default Title;
