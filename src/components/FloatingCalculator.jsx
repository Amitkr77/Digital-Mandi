"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calculator, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have cn utility for class merging

const calculate = (a, op, b) => {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
};

export default function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("0");
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const inputNumber = (num) => {
    let newValue;
    if (waitingForOperand) {
      newValue = num.toString();
      setWaitingForOperand(false);
    } else {
      newValue = value === "0" ? num.toString() : value + num;
    }
    setValue(newValue);
    setDisplayValue(newValue);
  };

  const inputDecimal = () => {
    let newValue;
    if (waitingForOperand) {
      newValue = "0.";
      setWaitingForOperand(false);
    } else if (!value.includes(".")) {
      newValue = value + ".";
    } else {
      return; // Already has decimal
    }
    setValue(newValue);
    setDisplayValue(newValue);
  };

  const clear = () => {
    setValue("0");
    setDisplayValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (waitingForOperand || value === "Error") return;
    if (value.length > 1) {
      const newValue = value.slice(0, -1);
      setValue(newValue === "" ? "0" : newValue);
      setDisplayValue(newValue === "" ? "0" : newValue);
    } else {
      setValue("0");
      setDisplayValue("0");
    }
  };

  const toggleSign = () => {
    if (value === "0" || value === "Error") return;
    const num = parseFloat(value);
    const newValue = (-num).toString();
    setValue(newValue);
    setDisplayValue(newValue);
  };

  const percent = () => {
    if (value === "0" || value === "Error") return;
    const num = parseFloat(value) / 100;
    const newValue = num.toString();
    setValue(newValue);
    setDisplayValue(newValue);
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(value) || 0;
    let newPrevious = previousValue;
    let newDisplay = displayValue;

    if (waitingForOperand) {
      // Replace the operator
      setOperator(nextOperator);
      return;
    }

    if (previousValue !== null && operator !== null) {
      const result = calculate(previousValue, operator, inputValue);
      if (isNaN(result)) {
        setValue("Error");
        setDisplayValue("Error");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }
      newPrevious = result;
      newDisplay = result.toString();
    } else {
      newPrevious = inputValue;
      newDisplay = inputValue.toString();
    }

    setPreviousValue(newPrevious);
    setDisplayValue(newDisplay);
    setValue("0");
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const equals = () => {
    if (previousValue === null || operator === null || waitingForOperand) return;

    const inputValue = parseFloat(value) || 0;
    const result = calculate(previousValue, operator, inputValue);
    if (isNaN(result)) {
      setValue("Error");
      setDisplayValue("Error");
    } else {
      setValue(result.toString());
      setDisplayValue(result.toString());
    }
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleButtonClick = (btn) => {
    if (typeof btn === "number") {
      inputNumber(btn);
    } else if (btn === ".") {
      inputDecimal();
    } else if (btn === "C") {
      clear();
    } else if (btn === "⌫") {
      backspace();
    } else if (btn === "±") {
      toggleSign();
    } else if (btn === "%") {
      percent();
    } else if (btn === "÷") {
      inputOperator("/");
    } else if (btn === "×") {
      inputOperator("*");
    } else if (["+", "-"].includes(btn)) {
      inputOperator(btn);
    } else if (btn === "=") {
      equals();
    }
  };

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const key = e.key;
      e.preventDefault();

      if (key >= "0" && key <= "9") {
        inputNumber(parseInt(key));
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "+") {
        inputOperator("+");
      } else if (key === "-") {
        inputOperator("-");
      } else if (key === "*") {
        inputOperator("*");
      } else if (key === "/") {
        inputOperator("/");
      } else if (key === "Enter" || key === "=") {
        equals();
      } else if (key === "Escape") {
        setIsOpen(false);
      } else if (key.toLowerCase() === "c") {
        clear();
      } else if (key === "Backspace") {
        backspace();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, value, previousValue, operator, waitingForOperand]);

  // Focus on calculator when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const buttons = [
    ["C", "⌫", "%", "÷"],
    [7, 8, 9, "×"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="], // Special row: 0 spans 2, . col3, = col4
  ];

  const panelWidth = isMobile ? "w-[calc(100vw-2rem)] max-w-sm" : "w-80";
  const panelHeight = isMobile ? "h-[70vh] max-h-[500px]" : "";
  const panelBottom = isMobile ? "bottom-16" : "bottom-20";
  const buttonSize = isMobile ? "h-14 text-base" : "h-16 text-lg";
  const textSize = isMobile ? "text-2xl sm:text-3xl" : "text-4xl";
  const padding = isMobile ? "p-2" : "p-3";
  const headerPadding = isMobile ? "p-2 sm:p-3" : "p-4";

  const formatDisplay = (val) => {
    if (val === "Error") return "Error";
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString(undefined, { maximumFractionDigits: 10 });
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-50 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/20",
          isMobile ? "bottom-4 right-4 h-14 w-14" : "bottom-4 right-4 h-16 w-16"
        )}
        size="icon"
        aria-label="Open Calculator"
      >
        <Calculator className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
      </Button>

      {/* Calculator Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300",
            panelWidth,
            panelHeight,
            panelBottom,
            "right-4"
          )}
        >
          {/* Header */}
          <div className={cn("flex justify-between items-center border-b bg-linear-to-r from-muted/50 to-background/50", headerPadding)}>
            <h3 className={cn("font-bold tracking-wide", isMobile ? "text-sm sm:text-base" : "text-lg")}>
              Calculator
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className={cn(
                "h-8 w-8 p-0 rounded-full hover:bg-accent/80 transition-colors",
                isMobile && "h-7 w-7"
              )}
            >
              <X className={cn(isMobile ? "h-4 w-4" : "h-4 w-4")} />
            </Button>
          </div>

          {/* Display */}
          <div
            ref={inputRef}
            className={cn(
              "flex items-end justify-end px-4 py-2 bg-linear-to-b from-background to-muted/30",
              isMobile ? "h-16 text-2xl sm:h-20" : "h-20"
            )}
            tabIndex={0}
            style={{ outline: "none" }}
          >
            <span
              className={cn(
                "font-mono font-bold text-right select-none drop-shadow-sm",
                textSize,
                "text-foreground/90"
              )}
            >
              {formatDisplay(displayValue)}
            </span>
          </div>

          {/* Buttons Grid */}
          <div className={cn("grid grid-cols-4 gap-1.5 flex-1", padding)}>
            {buttons.map((row, rowIndex) =>
              row.map((btn, colIndex) => {
                const isLastRow = rowIndex === buttons.length - 1;
                const isZero = btn === 0;
                const isEquals = btn === "=";
                let colSpan = 1;
                if (isLastRow && isZero) {
                  colSpan = 2;
                } else if (isLastRow && isEquals) {
                  colSpan = 1; // But since placed after ., it will be col4, but to span? Wait, no need, since row len=3, grid will place = in col4
                }
                const isOperator = ["÷", "×", "-", "+", "="].includes(btn);
                const isFunction = ["C", "⌫", "%"].includes(btn);
                const buttonVariant = isOperator
                  ? "default"
                  : isFunction
                  ? "secondary"
                  : "outline";
                const buttonColor = isOperator
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : isFunction
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "hover:bg-accent hover:text-accent-foreground";

                return (
                  <Button
                    key={`${rowIndex}-${colIndex}`}
                    variant={buttonVariant}
                    size="sm"
                    onClick={() => handleButtonClick(btn)}
                    className={cn(
                      buttonSize,
                      "rounded-xl font-mono font-semibold transition-all duration-200 active:scale-95",
                      colSpan > 1 && `col-span-${colSpan}`,
                      buttonColor,
                      isEquals && "row-span-2 col-start-4" // Make = span two rows for better look, adjust grid
                    )}
                  >
                    {btn === "÷" ? "÷" : btn === "×" ? "×" : btn}
                  </Button>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}