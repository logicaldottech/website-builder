import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
}) => {
  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 block font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 pl-2 pr-7 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm"
          />
          {unit && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-secondary pointer-events-none">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
