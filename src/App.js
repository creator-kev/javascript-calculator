import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const handleNumber = (num) => {
    if (evaluated) {
      setDisplay(num);
      setFormula(num);
      setEvaluated(false);
    } else {
      if (display === '0') {
        setDisplay(num);
        setFormula(num);
      } else {
        // User Story #10: No multiple leading zeros
        if (display === '0' && num === '0') {
          return;
        }
        setDisplay(display + num);
        setFormula(formula + num);
      }
    }
  };

  const handleOperator = (op) => {
    if (evaluated) {
      setFormula(display + op);
      setEvaluated(false);
    } else {
      // User Story #13: If 2+ operators are entered consecutively, use the last one
      // Special case for minus, which can be used as a negative sign
      if (op === '-' && !isLastCharOperator(formula) || !isLastCharOperator(formula)) {
        setFormula(formula + op);
      } else if (op !== '-') {
        // Replace last operator(s)
        let newFormula = formula;
        while (isLastCharOperator(newFormula)) {
          newFormula = newFormula.slice(0, -1);
        }
        setFormula(newFormula + op);
      } else if (isLastCharOperator(formula) && !isLastCharOperatorMinus(formula)) {
        setFormula(formula + op);
      }
    }
    setDisplay(op);
  };

  const handleDecimal = () => {
    // User Story #11: Don't allow multiple decimals in a number
    if (evaluated) {
      setDisplay('0.');
      setFormula('0.');
      setEvaluated(false);
    } else {
      if (!display.includes('.')) {
        setDisplay(display + '.');
        
        // If the last character of formula is an operator, append '0.'
        if (isLastCharOperator(formula)) {
          setFormula(formula + '0.');
        } else {
          setFormula(formula + '.');
        }
      }
    }
  };

  const handleEquals = () => {
    if (!evaluated) {
      try {
        // User Story #15: Have several decimal places of precision
        let result = evaluateFormula(formula);
        
        // Display the result with reasonable precision
        setDisplay(result.toString());
        setFormula(formula + '=' + result);
        setEvaluated(true);
      } catch (e) {
        setDisplay('Error');
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setEvaluated(false);
  };

  // Helper function to evaluate the formula using formula logic
  const evaluateFormula = (formula) => {
    // Replace × with * and ÷ with / for JavaScript eval
    let expression = formula.replace(/×/g, '*').replace(/÷/g, '/');
    
    // Clean formula before evaluation
    // Remove trailing operators
    while (isLastCharOperator(expression)) {
      expression = expression.slice(0, -1);
    }
    
    // Use Function constructor instead of eval for better safety
    // This approach follows formula/expression logic
    return parseFloat(Function('"use strict";return (' + expression + ')')().toFixed(10));
  };

  // Helper to check if the last character is an operator
  const isLastCharOperator = (str) => {
    return ['+', '-', '*', '/', '×', '÷'].includes(str.charAt(str.length - 1));
  };

  // Helper to check if the last character is minus
  const isLastCharOperatorMinus = (str) => {
    return str.charAt(str.length - 1) === '-';
  };

  return (
    <div className="calculator">
      <div className="formula">{formula}</div>
      <div id="display">{display}</div>
      <div className="buttons">
        <button id="clear" onClick={handleClear}>AC</button>
        <button id="divide" onClick={() => handleOperator('/')}>/</button>
        <button id="multiply" onClick={() => handleOperator('*')}>*</button>
        <button id="seven" onClick={() => handleNumber('7')}>7</button>
        <button id="eight" onClick={() => handleNumber('8')}>8</button>
        <button id="nine" onClick={() => handleNumber('9')}>9</button>
        <button id="subtract" onClick={() => handleOperator('-')}>-</button>
        <button id="four" onClick={() => handleNumber('4')}>4</button>
        <button id="five" onClick={() => handleNumber('5')}>5</button>
        <button id="six" onClick={() => handleNumber('6')}>6</button>
        <button id="add" onClick={() => handleOperator('+')}>+</button>
        <button id="one" onClick={() => handleNumber('1')}>1</button>
        <button id="two" onClick={() => handleNumber('2')}>2</button>
        <button id="three" onClick={() => handleNumber('3')}>3</button>
        <button id="zero" onClick={() => handleNumber('0')}>0</button>
        <button id="decimal" onClick={handleDecimal}>.</button>
        <button id="equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default App;