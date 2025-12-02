import React, { useState } from "react";
import { Page, Box, Button, Text } from "zmp-ui";
import "../css/calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isDark, setIsDark] = useState(true);

  const handleNumber = (num) => {
    setDisplay(display === "0" ? num : display + num);
  };

  const handleOperator = (op) => {
    setEquation(display + op);
    setDisplay("0");
  };

  const handleEquals = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation("");
    } catch {
      setDisplay("Error");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handlePlusMinus = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleDecimal = () => {
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleBackspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
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
        <Button onClick={() => setIsDark(!isDark)}>         {/* sửa icon sau*/}
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </Box>
    {/* Display */}
    <Box className="calc-display">
        {equation && <Text className="equation">{equation}</Text>}
        <Text className="result">{formatNumber(display)}</Text>
    </Box>
    </Box>
      {/* Buttons */}
      <Box className="calc-grid">
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
        <button onClick={handleBackspace} className="btn dark">⌫</button>
        <button onClick={handleEquals} className="btn blue">=</button>
      </Box>
    </Page>
  );
}
