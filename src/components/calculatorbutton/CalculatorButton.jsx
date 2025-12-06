import React from 'react';
import './CalculatorButton.scss';

const CalculatorButton = ({ 
  onClick, 
  children, 
  type = 'default', 
  variant = 'dark'   
}) => {
  return (
    <button 
      onClick={onClick} 
      className={`calc-button calc-button--${type} calc-button--${variant}`}
    >
      {children}
    </button>
  );
};

export default CalculatorButton;