import React from 'react';

interface TextInputProps {
  label: string;
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  labelHidden?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, placeholder, onChange, labelHidden }) => {
  return (
    <div>
      {!labelHidden && <label className="text-xs font-semibold text-text-muted mb-1.5 block">{label}</label>}
      <input
        type="text"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 bg-surface-alt border border-border rounded-md focus:border-primary transition-all text-sm placeholder:text-text-muted"
      />
    </div>
  );
};

export default TextInput;
