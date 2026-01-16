"use client";

const LoadingSkeleton = () => {
  return (
    <div className="m-0 flex flex-col items-center justify-center">
      <div className="w-40 h-6 bg-gray-500 rounded animate-pulse"></div>
    </div>
  );
};

export default LoadingSkeleton;
