import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import ColorInput from './ColorInput';

interface TextShadowInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const parseTextShadow = (value: string | undefined): { x: string; y: string; blur: string; color: string } => {
  if (!value || value === 'none') {
    return { x: '0px', y: '0px', blur: '0px', color: 'rgba(0,0,0,0)' };
  }
  const parts = value.trim().split(/\s+(?![^(]*\))/);
  const colorPart = parts.find(p => p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl'));
  const numericParts = parts.filter(p => !(p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl')));
  
  return {
    x: numericParts[0] || '0px',
    y: numericParts[1] || '0px',
    blur: numericParts[2] || '0px',
    color: colorPart || 'rgba(0,0,0,0.5)',
  };
};

const TextShadowInput: React.FC<TextShadowInputProps> = ({ label, value, onChange }) => {
  const [shadow, setShadow] = useState(parseTextShadow(value));

  useEffect(() => {
    const { x, y, blur, color } = shadow;
    if (!x && !y && !blur && !color.includes('rgba(0,0,0,0)')) {
        const newTextShadow = `${x || '0px'} ${y || '0px'} ${blur || '0px'} ${color || 'rgba(0,0,0,0)'}`.trim();
        if (newTextShadow !== value) {
          onChange(newTextShadow);
        }
    }
  }, [shadow, onChange, value]);

  const handleToggle = () => {
    if (value && value !== 'none') {
      onChange('none');
      setShadow(parseTextShadow('none'));
    } else {
      setShadow({ x: '1px', y: '1px', blur: '2px', color: 'rgba(0,0,0,0.5)' });
    }
  };

  const handleChange = (part: keyof typeof shadow, newValue: string) => {
    setShadow(prev => ({ ...prev, [part]: newValue }));
  };

  const hasShadow = value && value !== 'none';

  return (
    <div className="space-y-3 p-3 border border-border-color rounded-lg">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-primary block">{label}</label>
        <button onClick={handleToggle} className="text-xs text-primary-slate hover:underline">
          {hasShadow ? 'Remove' : 'Add'}
        </button>
      </div>
      {hasShadow && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <TextInput label="X" value={shadow.x} onChange={v => handleChange('x', v)} placeholder="1px" />
            <TextInput label="Y" value={shadow.y} onChange={v => handleChange('y', v)} placeholder="1px" />
            <TextInput label="Blur" value={shadow.blur} onChange={v => handleChange('blur', v)} placeholder="2px" />
          </div>
          <ColorInput label="Color" value={shadow.color} onChange={v => handleChange('color', v)} />
        </>
      )}
    </div>
  );
};

export default TextShadowInput;
