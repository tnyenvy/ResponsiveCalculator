import React, { useState, useRef, useEffect } from "react";
import { Page, Box, Text } from "zmp-ui";
import "../css/calculator.css";
import MoonIcon from '../assets/moon.svg';
import SunIcon from '../assets/sun.svg';
import CalculatorButton from '../components/CalculatorButton.jsx';

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const toggleRef = useRef(null);
  const pageRef = useRef(null);

  // Khởi tạo theme từ localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('calculator-theme');
    return savedTheme === 'dark' || savedTheme === null; 
  });  

  // Thêm body class và localStorage khi theme thay đổi
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('calculator-theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('calculator-theme', 'light');
    }
  }, [isDark]);

  // Cập nhật thời gian
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hiệu ứng chuyển theme
  const handleThemeToggle = () => {
    const button = toggleRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const maxRadius = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) +
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    );

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1';
    overlay.style.transition = 'clip-path 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)';

    if (isDark) {
      overlay.style.backgroundColor = '#F1F2F3';
      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      setIsDark(false);
      
      document.body.appendChild(overlay);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.clipPath = `circle(${maxRadius * 1.5}px at ${x}px ${y}px)`;
        });
      });
    } else {
      overlay.style.backgroundColor = '#000000';
      overlay.style.clipPath = `circle(${maxRadius * 1.5}px at ${x}px ${y}px)`;
      
      document.body.appendChild(overlay);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        });
      });

      setIsDark(true);
    }

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 700);
  };

  // Các hàm xử lý nút bấm
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
      case "+": return prev + current;
      case "−":
      case "-": return prev - current;
      case "×":
      case "*": return prev * current;
      case "÷":
      case "/": return current !== 0 ? prev / current : "Error";
      default: return current;
    }
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    const currentValue = parseFloat(display.replace(/,/g, ''));
    let result = performCalculation(previousValue, currentValue, operation);
    
    //Lấy 2 chữ số thập phân
    if (result !== "Error") {
      result = Math.round(result * 100) / 100;
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
      {/* Status Bar */}
      <Box className="status-bar">
        {/* Time */}
        <div className="status-time">{currentTime}</div>
        {/* Notch */}
        <div className="notch"></div>
        {/* Status Icons */}
        <div className="status-icons">
          {/* Mobile Signal */}
          <svg className="mobile-signal" width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0.5" y="6.5" width="2" height="4" rx="0.6" fill="currentColor"/>
            <rect x="4.5" y="4.5" width="2" height="6" rx="0.6" fill="currentColor"/>
            <rect x="8.5" y="2.5" width="2" height="8" rx="0.6" fill="currentColor"/>
            <rect x="12.5" y="0.5" width="2" height="10" rx="0.6" fill="currentColor"/>
          </svg>
          {/* WiFi */}
          <svg className="wifi" width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 10.5C8.82843 10.5 9.5 9.82843 9.5 9C9.5 8.17157 8.82843 7.5 8 7.5C7.17157 7.5 6.5 8.17157 6.5 9C6.5 9.82843 7.17157 10.5 8 10.5Z" fill="currentColor"/>
            <path d="M4.5 6C5.5 5 6.5 4.5 8 4.5C9.5 4.5 10.5 5 11.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M2 3C4 1 6 0.5 8 0.5C10 0.5 12 1 14 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {/* Battery */}
          <svg className="battery" width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="1.5" width="20" height="9" rx="2" stroke="currentColor" strokeOpacity="0.4"/>
            <rect x="2" y="3" width="17" height="6" rx="1" fill="currentColor"/>
            <path d="M21.5 4.5V7.5C22.5 7.2 23 6.5 23 6C23 5.5 22.5 4.8 21.5 4.5Z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </div>
      </Box>

      {/* Calculator Wrapper */}
      <Box className="calculator-wrapper">
        {/* Theme Toggle */}
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
          {/* Row 1 */}
          <CalculatorButton onClick={handleClear} className="gray">C</CalculatorButton>
          <CalculatorButton onClick={handlePlusMinus} className="gray">+/-</CalculatorButton>
          <CalculatorButton onClick={handlePercent} className="gray">%</CalculatorButton>
          <CalculatorButton onClick={() => handleOperator("÷")} className="blue">÷</CalculatorButton>

          {/* Row 2 */}
          <CalculatorButton onClick={() => handleNumber("7")} className="dark">7</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("8")} className="dark">8</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("9")} className="dark">9</CalculatorButton>
          <CalculatorButton onClick={() => handleOperator("×")} className="blue">×</CalculatorButton>

          {/* Row 3 */}
          <CalculatorButton onClick={() => handleNumber("4")} className="dark">4</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("5")} className="dark">5</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("6")} className="dark">6</CalculatorButton>
          <CalculatorButton onClick={() => handleOperator("-")} className="blue">−</CalculatorButton>

          {/* Row 4 */}
          <CalculatorButton onClick={() => handleNumber("1")} className="dark">1</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("2")} className="dark">2</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("3")} className="dark">3</CalculatorButton>
          <CalculatorButton onClick={() => handleOperator("+")} className="blue">+</CalculatorButton>

          {/* Row 5 */}
          <CalculatorButton onClick={handleDecimal} className="dark">.</CalculatorButton>
          <CalculatorButton onClick={() => handleNumber("0")} className="dark">0</CalculatorButton>
          <CalculatorButton onClick={handleBackspace} className="dark btn-backspace">⌫</CalculatorButton>
          <CalculatorButton onClick={handleEquals} className="blue">=</CalculatorButton>
        </Box>
      </Box>

      {/* HOME INDICATOR */}
      <Box className="home-indicator-container">
        <Box className="home-indicator-bar"></Box>
      </Box>
    </Page>
  );
}