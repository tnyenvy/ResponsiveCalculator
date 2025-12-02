import React, { useState, useRef } from "react";
import { Page, Box, Button, Text } from "zmp-ui";
import "../css/calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const toggleRef = useRef(null);

  // Hiệu ứng chuyển theme
  const handleThemeToggle = (e) => {
    const button = toggleRef.current;
    if (!button) return;
    // vị trí toggle
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Tạo element hình tròn cho hiệu ứng
    const circle = document.createElement('div');
    circle.style.position = 'fixed';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = '0';
    circle.style.height = '0';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.pointerEvents = 'none';
    circle.style.zIndex = '9999';
    circle.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
    circle.style.backgroundColor = isDark ? '#F1F2F3' : '#000000';
    document.body.appendChild(circle);

    // Trigger animation
    requestAnimationFrame(() => {
      const maxDimension = Math.max(window.innerWidth, window.innerHeight);
      const diameter = maxDimension * 2.5;
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
    });

    // Đổi theme sau một chút delay
    setTimeout(() => {
      setIsDark(!isDark);
    }, 100);

    // Xóa element sau khi animation hoàn thành
    setTimeout(() => {
      document.body.removeChild(circle);
    }, 600);
  };

  const handleNumber = (num) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    const currentValue = parseFloat(display.replace(/,/g, ''));
    
    if (previousValue !== null && operation && !shouldResetDisplay) {
      // Thực hiện phép tính trước đó
      const result = performCalculation(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
      setEquation(`${result}${op}`);
    } else {
      setPreviousValue(currentValue);
      setEquation(`${display}${op}`);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const performCalculation = (prev, current, op) => {
    switch (op) {
      case "+":
        return prev + current;
      case "−":
      case "-":
        return prev - current;
      case "×":
      case "*":
        return prev * current;
      case "÷":
      case "/":
        return current !== 0 ? prev / current : "Error";
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;

    const currentValue = parseFloat(display.replace(/,/g, ''));
    const result = performCalculation(previousValue, currentValue, operation);
    
    setDisplay(String(result));
    setEquation("");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handlePercent = () => {
    const value = parseFloat(display.replace(/,/g, ''));
    setDisplay(String(value / 100));
    setShouldResetDisplay(true);
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display.replace(/,/g, ''));
    setDisplay(String(value * -1));
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== "Error") {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const formatNumber = (num) => {
    if (num === "0" || num === "Error") return num;
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <Page className={isDark ? "calc dark" : "calc"}>
      <Box className="calculator-wrapper">

        <Box className="theme-toggle">
          <div 
            ref={toggleRef}
            className={`toggle-switch ${isDark ? "dark" : "light"}`} 
            onClick={handleThemeToggle}>

            <div className="toggle-icon">
              {isDark ? (
                // Icon Mặt trăng (Dark mode)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#4B5EFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                // Icon Mặt trời (Light mode)
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" stroke="#4B5EFC" strokeWidth="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#4B5EFC" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>

            {/* Hình tròn */}
            <div className="toggle-circle"></div>
          </div>
        </Box>

        {/* Display */}
        <Box className="calc-display">
          {equation && <Text className="equation">{equation}</Text>}
          <Text className="result">{formatNumber(display)}</Text>
        </Box>

        {/* Buttons */}
        <Box className="calc-keypad">
          <button onClick={handleClear} className="btn gray">C</button>
          <button onClick={handlePlusMinus} className="btn gray">+/-</button>
          <button onClick={handlePercent} className="btn gray">%</button>
          <button onClick={() => handleOperator("÷")} className="btn blue">÷</button>

          <button onClick={() => handleNumber("7")} className="btn dark">7</button>
          <button onClick={() => handleNumber("8")} className="btn dark">8</button>
          <button onClick={() => handleNumber("9")} className="btn dark">9</button>
          <button onClick={() => handleOperator("×")} className="btn blue">×</button>

          <button onClick={() => handleNumber("4")} className="btn dark">4</button>
          <button onClick={() => handleNumber("5")} className="btn dark">5</button>
          <button onClick={() => handleNumber("6")} className="btn dark">6</button>
          <button onClick={() => handleOperator("-")} className="btn blue">−</button>

          <button onClick={() => handleNumber("1")} className="btn dark">1</button>
          <button onClick={() => handleNumber("2")} className="btn dark">2</button>
          <button onClick={() => handleNumber("3")} className="btn dark">3</button>
          <button onClick={() => handleOperator("+")} className="btn blue">+</button>

          <button onClick={handleDecimal} className="btn dark">.</button>
          <button onClick={() => handleNumber("0")} className="btn dark">0</button>
          <button onClick={handleBackspace} className="btn dark btn-backspace">⌫</button>
          <button onClick={handleEquals} className="btn blue">=</button>
        </Box>
      </Box>

      {/* HOME INDICATOR */}
      <Box className="home-indicator-container">
        <Box className="home-indicator-bar"></Box>
      </Box>
    </Page>
  );
}