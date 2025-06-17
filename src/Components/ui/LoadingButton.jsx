import { useState, useEffect } from "react";

const LoadingButton = ({
  children,
  isLoading,
  onClick,
  className,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-1.5">
          <div className="animate-bounce delay-100 h-1.5 w-1.5 rounded-full bg-current opacity-75"></div>
          <div className="animate-bounce delay-200 h-1.5 w-1.5 rounded-full bg-current opacity-75"></div>
          <div className="animate-bounce delay-300 h-1.5 w-1.5 rounded-full bg-current opacity-75"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
