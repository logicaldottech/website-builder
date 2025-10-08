import React from 'react';

const themeColors = {
  'primary-purple': '#6E42E8',
  'background': '#0B0A0E',
  'secondary-gray': '#15141A',
  'text-primary': '#F0F0F0',
  'text-secondary': '#A0A0A0',
  'border-color': '#2A292F',
  'canvas-light-bg': '#FFFFFF'
};

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 block font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-background"
        />
        <input
          type="text"
          placeholder="#RRGGBB"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"
        />
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Object.entries(themeColors).map(([name, color]) => (
          <button
            key={name}
            title={name}
            onClick={() => onChange(color)}
            className={`w-full h-6 rounded border-2 transition-all ${value.toLowerCase() === color.toLowerCase() ? 'border-primary-purple' : 'border-transparent hover:border-white/50'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorInput;
