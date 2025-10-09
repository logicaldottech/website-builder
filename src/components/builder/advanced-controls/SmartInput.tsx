import React, { useState, useEffect } from 'react';

interface SmartInputProps {
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
}

const spacingKeywords: Record<string, string> = {
  'none': '0px',
  'xs': '4px',
  'sm': '8px',
  'md': '16px',
  'lg': '32px',
  'xl': '64px',
};

const parseValue = (input: string): string => {
  const trimmed = input.trim().toLowerCase();
  
  // Check for keywords
  if (spacingKeywords[trimmed]) {
    return spacingKeywords[trimmed];
  }

  // Check for simple formulas (e.g., "16 * 2")
  const formulaMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([*\/+-])\s*(\d+(?:\.\d+)?)$/);
  if (formulaMatch) {
    const [, a, op, b] = formulaMatch;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    let result: number;
    switch (op) {
      case '*': result = numA * numB; break;
      case '/': result = numA / numB; break;
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      default: return input;
    }
    return `${result}px`;
  }

  // Return original if it's a valid CSS value or unknown
  return input;
};

const SmartInput: React.FC<SmartInputProps> = ({ value, placeholder, onChange }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleBlur = () => {
    const parsed = parseValue(internalValue);
    if (parsed !== value) {
      onChange(parsed);
    }
    setInternalValue(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      value={internalValue}
      placeholder={placeholder}
      onChange={(e) => setInternalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full pl-7 pr-2 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-slate focus:outline-none transition-all text-sm"
    />
  );
};

export default SmartInput;
