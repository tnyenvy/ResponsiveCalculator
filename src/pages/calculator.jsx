import React, { useState, useRef } from "react";
import { Page, Box, Button, Text } from "zmp-ui";
import "../css/calculator.css";
import MoonIcon from '../assets/moon.svg';
import SunIcon from '../assets/sun.svg';


export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const toggleRef = useRef(null);
  const pageRef = useRef(null);

  // Hiệu ứng chuyển theme với animation rõ ràng hơn
  const handleThemeToggle = (e) => {
    const button = toggleRef.current;
    const page = pageRef.current;
    if (!button || !page) return;

    // Vị trí toggle
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Tạo element hình tròn cho hiệu ứng
    const circle = document.createElement('div');
    circle.className = 'theme-transition-circle';
    circle.style.position = 'fixed';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.borderRadius = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.pointerEvents = 'none';
    circle.style.zIndex = '999';
    circle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    if (isDark) {
      // Dark -> Light
      circle.style.width = '30px';
      circle.style.height = '30px';
      circle.style.backgroundColor = '#F1F2F3';
      circle.style.opacity = '1';
      
      document.body.appendChild(circle);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const maxDimension = Math.max(window.innerWidth, window.innerHeight);
          const diameter = maxDimension * 3;
          circle.style.width = `${diameter}px`;
          circle.style.height = `${diameter}px`;
        });
      });
      
      setTimeout(() => {
        setIsDark(false);
      }, 200);

    } else {
      // Light -> Dark
      const maxDimension = Math.max(window.innerWidth, window.innerHeight);
      const diameter = maxDimension * 3;
      
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      circle.style.backgroundColor = '#000000';
      circle.style.opacity = '1';
      
      document.body.appendChild(circle);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circle.style.width = '30px';
          circle.style.height = '30px';
          circle.style.opacity = '0';
        });
      });

      setIsDark(true);
    }

    // Xóa element sau khi animation hoàn thành
    setTimeout(() => {
      if (document.body.contains(circle)) {
        document.body.removeChild(circle);
      }
    }, 300);
  };

  const handleNumber = (num) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };


  //Các hàm xử lý toán học
  const handleOperator = (op) => {
    const currentValue = parseFloat(display.replace(/,/g, ''));
    
    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = performCalculation(previousValue, currentValue, operation);
      
      setDisplay(String(result));
      setPreviousValue(result);
      setEquation(`${formatNumber(String(result))}${op}`);
    } else {
      setPreviousValue(currentValue);
      setEquation(`${formatNumber(display)}${op}`);
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
    let result = performCalculation(previousValue, currentValue, operation);
    
    // Làm tròn 3 chữ số thập phân
    if (result !== "Error") {
      result = Math.round(result * 1000) / 1000;
    }
    
    setDisplay(String(result));
    setEquation(`${formatNumber(String(previousValue))}${operation}${formatNumber(String(currentValue))}`);
    
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
    <Page ref={pageRef} className={isDark ? "calc dark" : "calc"}>
      <Box className="calculator-wrapper">

        <Box className="theme-toggle">
          <div 
            ref={toggleRef}
            className={`toggle-switch ${isDark ? "dark" : "light"}`} 
            onClick={handleThemeToggle}>

            <div className="toggle-icon">
                {isDark ? (
                    <img src={MoonIcon} alt="Moon" width="20" height="20" />
                ) : (
                    <img src={SunIcon} alt="Sun" width="20" height="20" />
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