import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, required, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
      {...props}
    />
  );
};

export default Input;