import React from 'react';

export function Label({ children, htmlFor, className = "", ...props }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`text-sm font-medium ${className}`} 
      {...props}
    >
      {children}
    </label>
  );
}