import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-purple-400"
  };
  
  const sizeClasses = {
    small: "text-sm px-6 py-2",
    medium: "text-base px-8 py-3",
    large: "text-lg px-12 py-4"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      <span className="px-1">{children}</span>
    </button>
  );
};

export default Button; 