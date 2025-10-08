import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import SmartInput from './advanced-controls/SmartInput';

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
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {icon}
            </div>
            <SmartInput
              value={values[side.toLowerCase() as keyof typeof values] || ''}
              onChange={(val) => onValueChange(side, val)}
              placeholder="0px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourPointInput;
