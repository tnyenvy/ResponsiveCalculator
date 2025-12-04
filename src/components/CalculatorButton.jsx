import React from 'react';

const CalculatorButton = ({ onClick, className, children }) => {
  return (
    <button 
      onClick={onClick} 
      className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default CalculatorButton;