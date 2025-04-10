import React, { createContext, useContext, useState } from 'react';

const RadioGroupContext = createContext();

export function RadioGroup({ children, value, onChange, className = "", ...props }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ value: selectedValue, onChange: handleChange }}>
      <div className={`flex flex-col ${className}`} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className = "", ...props }) {
  const context = useContext(RadioGroupContext);
  
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={context?.value === value}
      onChange={() => context?.onChange(value)}
      className={`w-4 h-4 ${className}`}
      {...props}
    />
  );
}