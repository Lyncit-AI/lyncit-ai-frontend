import React from 'react';

export function Card({ children, className = "", ...props }) {
  return (
    <div 
      className={`rounded-[16px] border border-gray-200 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}