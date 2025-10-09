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
      <label className="text-xs font-semibold text-text-muted mb-1.5 block">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 h-11 pl-3 pr-7 bg-surface-alt border border-border rounded-md focus:border-primary transition-all text-sm"
          />
          {unit && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
