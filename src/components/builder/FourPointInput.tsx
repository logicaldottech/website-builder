import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';

type Side = 'Top' | 'Right' | 'Bottom' | 'Left';

interface FourPointInputProps {
  label: string;
  values: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  onValueChange: (side: Side, value: string) => void;
}

const FourPointInput: React.FC<FourPointInputProps> = ({ label, values, onValueChange }) => {
  const inputs: { side: Side, icon: React.ReactNode }[] = [
    { side: 'Top', icon: <ArrowUp size={12} className="text-text-secondary" /> },
    { side: 'Right', icon: <ArrowRight size={12} className="text-text-secondary" /> },
    { side: 'Bottom', icon: <ArrowDown size={12} className="text-text-secondary" /> },
    { side: 'Left', icon: <ArrowLeft size={12} className="text-text-secondary" /> },
  ];

  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 block font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {inputs.map(({ side, icon }) => (
          <div key={side} className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
              {icon}
            </div>
            <input
              type="text"
              placeholder="0px"
              value={values[side.toLowerCase() as keyof typeof values] || ''}
              onChange={(e) => onValueChange(side, e.target.value)}
              className="w-full pl-7 pr-2 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourPointInput;
