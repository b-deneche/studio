import { useState, useCallback } from 'react';

const MAX_DISPLAY_LENGTH = 15;

export interface CalculatorLogic {
  displayValue: string;
  handleDigitClick: (digit: string) => void;
  handleOperatorClick: (operator: string) => void;
  handleEqualsClick: () => void;
  handleDecimalClick: () => void;
  handleClearClick: () => void;
  handleMemoryClear: () => void;
  handleMemoryRecall: () => void;
  handleMemoryAdd: () => void;
  handleMemorySubtract: () => void;
  handleGrandTotalClear: () => void;
  handleGrandTotalRecall: () => void;
  memoryHasValue: boolean;
}

export function useCalculatorLogic(): CalculatorLogic {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [grandTotalValue, setGrandTotalValue] = useState<number>(0);
  const [memoryHasValue, setMemoryHasValue] = useState<boolean>(false);

  const formatDisplayValue = (num: number): string => {
    let strNum = String(num);
    if (strNum.length > MAX_DISPLAY_LENGTH) {
      if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-5 && num !== 0)) {
        strNum = num.toExponential(MAX_DISPLAY_LENGTH - 6); // Adjust precision for exponent
      } else {
        // Try to fit by removing decimal places if it's a float
        const decimalPointIndex = strNum.indexOf('.');
        if (decimalPointIndex !== -1) {
            strNum = num.toFixed(Math.max(0, MAX_DISPLAY_LENGTH - 1 - decimalPointIndex));
             if (strNum.length > MAX_DISPLAY_LENGTH) { // if still too long, truncate
                strNum = strNum.substring(0, MAX_DISPLAY_LENGTH);
             }
        } else {
             strNum = strNum.substring(0, MAX_DISPLAY_LENGTH); // Truncate integers
        }
      }
    }
     // Remove trailing zeros after decimal point if not ending with '.'
    if (strNum.includes('.') && !strNum.endsWith('.')) {
      strNum = strNum.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1');
    }
    return strNum;
  };


  const handleDigitClick = useCallback((digit: string) => {
    if (displayValue === 'Error') {
      setDisplayValue(digit);
      setWaitingForOperand(false);
      return;
    }
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      if (displayValue.length < MAX_DISPLAY_LENGTH) {
        setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
      }
    }
  }, [displayValue, waitingForOperand]);

  const handleDecimalClick = useCallback(() => {
    if (displayValue === 'Error') {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (!displayValue.includes('.')) {
      if (displayValue.length < MAX_DISPLAY_LENGTH -1) {
        setDisplayValue(displayValue + '.');
      }
    }
  }, [displayValue, waitingForOperand]);

  const performCalculation = useCallback(() => {
    const prev = previousValue;
    const current = parseFloat(displayValue);

    if (operator && prev !== null && !isNaN(current)) {
      let result: number;
      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            setDisplayValue('Error');
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
            return NaN; // Indicate error
          }
          result = prev / current;
          break;
        default:
          return current; // Should not happen
      }
      return result;
    }
    return parseFloat(displayValue); // Return current if no operation to perform
  }, [previousValue, displayValue, operator]);

  const handleOperatorClick = useCallback((op: string) => {
    if (displayValue === 'Error') return;

    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) {
      setDisplayValue('Error');
      return;
    }
    
    if (operator && !waitingForOperand) { // If there's a pending operation and new number entered
      const result = performCalculation();
      if (isNaN(result)) return; // Error handled in performCalculation
      setDisplayValue(formatDisplayValue(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperator(op);
    setWaitingForOperand(true);
  }, [displayValue, operator, waitingForOperand, performCalculation]);

  const handleEqualsClick = useCallback(() => {
    if (displayValue === 'Error' || !operator || previousValue === null) return;

    const result = performCalculation();
    if (isNaN(result)) return; 

    const formattedResult = formatDisplayValue(result);
    setDisplayValue(formattedResult);
    setGrandTotalValue(prevGT => prevGT + result);
    setPreviousValue(null); // According to some calculators, prev value is result for repeated equals
    // setPreviousValue(result); // Or reset for new calculation
    setOperator(null); // Clear operator after equals
    setWaitingForOperand(true);
  }, [displayValue, operator, previousValue, performCalculation]);

  const handleClearClick = useCallback(() => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, []);

  const handleMemoryClear = useCallback(() => {
    setMemoryValue(0);
    setMemoryHasValue(false);
  }, []);

  const handleMemoryRecall = useCallback(() => {
    if (displayValue === 'Error') setDisplayValue('0');
    setDisplayValue(formatDisplayValue(memoryValue));
    setWaitingForOperand(true);
  }, [memoryValue, displayValue]);

  const handleMemoryAdd = useCallback(() => {
    if (displayValue === 'Error') return;
    const current = parseFloat(displayValue);
    if (!isNaN(current)) {
      const newMemVal = memoryValue + current;
      setMemoryValue(newMemVal);
      setMemoryHasValue(true);
    }
     setWaitingForOperand(true);
  }, [displayValue, memoryValue]);

  const handleMemorySubtract = useCallback(() => {
    if (displayValue === 'Error') return;
    const current = parseFloat(displayValue);
    if (!isNaN(current)) {
      const newMemVal = memoryValue - current;
      setMemoryValue(newMemVal);
      setMemoryHasValue(true);
    }
    setWaitingForOperand(true);
  }, [displayValue, memoryValue]);

  const handleGrandTotalClear = useCallback(() => {
    setGrandTotalValue(0);
  }, []);

  const handleGrandTotalRecall = useCallback(() => {
    if (displayValue === 'Error') setDisplayValue('0');
    setDisplayValue(formatDisplayValue(grandTotalValue));
    setWaitingForOperand(true);
  }, [grandTotalValue, displayValue]);

  return {
    displayValue,
    handleDigitClick,
    handleOperatorClick,
    handleEqualsClick,
    handleDecimalClick,
    handleClearClick,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
    handleGrandTotalClear,
    handleGrandTotalRecall,
    memoryHasValue,
  };
}
