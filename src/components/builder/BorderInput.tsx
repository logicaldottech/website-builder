import React from 'react';
import SelectInput from './SelectInput';
import TextInput from './TextInput';
import ColorInput from './ColorInput';
import { SectionBorder } from '../../types/builder';

interface BorderInputProps {
  label: string;
  value: SectionBorder | undefined;
  onChange: (value: SectionBorder | undefined) => void;
}

const BorderInput: React.FC<BorderInputProps> = ({ label, value, onChange }) => {
  const handlePartChange = (part: Partial<SectionBorder>) => {
    onChange({ ...(value || {}), ...part });
  };

  const hasValue = value && (value.width || value.color);

  if (!hasValue) {
    return (
       <button onClick={() => onChange({ style: 'solid', width: '1px', color: '#A0A0A0' })} className="w-full text-sm text-text-secondary hover:text-text-primary p-2 border border-dashed border-border-color rounded-lg">
        Add {label}
      </button>
    )
  }

  return (
    <div className="space-y-3 p-3 border border-border-color rounded-lg relative">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-primary block">{label}</label>
        <button onClick={() => onChange(undefined)} className="text-xs text-red-400 hover:underline">Remove</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectInput
          label="Style"
          value={value?.style || 'solid'}
          onChange={(v) => handlePartChange({ style: v as any })}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
          ]}
        />
        <TextInput
          label="Width"
          value={value?.width}
          placeholder="e.g., 1px"
          onChange={(v) => handlePartChange({ width: v })}
        />
      </div>
      <ColorInput
        label="Color"
        value={value?.color || ''}
        onChange={(v) => handlePartChange({ color: v })}
      />
    </div>
  );
};

export default BorderInput;
