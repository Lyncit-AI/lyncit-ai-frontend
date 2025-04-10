import React from 'react';

export function Button({ children, variant = "default", className = "", ...props }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "bg-black text-white hover:bg-gray-800";
    }
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md font-medium ${getVariantClasses()} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}