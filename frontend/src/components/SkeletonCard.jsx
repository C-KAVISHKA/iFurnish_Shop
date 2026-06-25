import React from "react";

const SkeletonCard = () => {
  return (
    <div className="relative bottom-12 animate-pulse w-full max-w-[280px] sm:max-w-[220px] mx-auto">
      {/* Ghost Image Card */}
      <div className="relative top-12 overflow-hidden m-2.5 rounded-xl bg-gray-200/80 h-60 w-60 sm:w-48 sm:h-48 xs:w-40 xs:h-40 mx-auto"></div>
      
      {/* Ghost Details Card */}
      <div className="p-3 rounded-lg pt-12 h-52 bg-white/70 border border-gray-200/50 shadow flex flex-col justify-between">
        <div>
          {/* Title bar */}
          <div className="h-4 bg-gray-200/80 rounded w-3/4 mb-3"></div>
          {/* Price & Rating bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-3 bg-gray-200/80 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200/80 rounded w-1/8"></div>
          </div>
          {/* Description bars */}
          <div className="space-y-2">
            <div className="h-2.5 bg-gray-200/80 rounded w-full"></div>
            <div className="h-2.5 bg-gray-200/80 rounded w-5/6"></div>
            <div className="h-2.5 bg-gray-200/80 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
