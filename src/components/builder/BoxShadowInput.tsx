import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import ColorInput from './ColorInput';

interface BoxShadowInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const parseBoxShadow = (value: string | undefined): { x: string; y: string; blur: string; spread: string; color: string } => {
  if (!value || value === 'none') {
    return { x: '0px', y: '0px', blur: '0px', spread: '0px', color: 'rgba(0,0,0,0)' };
  }

  // This is a simplified parser. It assumes color is the last part if it's a hex, rgb, or a named color.
  const parts = value.trim().split(/\s+(?![^(]*\))/); // Split by space, but not inside rgba()
  const colorPart = parts.find(p => p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl'));
  const numericParts = parts.filter(p => !(p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl')));
  
  return {
    x: numericParts[0] || '0px',
    y: numericParts[1] || '0px',
    blur: numericParts[2] || '0px',
    spread: numericParts[3] || '0px',
    color: colorPart || 'rgba(0,0,0,0.1)',
  };
};

const BoxShadowInput: React.FC<BoxShadowInputProps> = ({ label, value, onChange }) => {
  const [shadow, setShadow] = useState(parseBoxShadow(value));

  useEffect(() => {
    const { x, y, blur, spread, color } = shadow;
    if (!x && !y && !blur && !spread) {
      onChange('none');
      return;
    }
    const newBoxShadow = `${x || '0px'} ${y || '0px'} ${blur || '0px'} ${spread || '0px'} ${color || 'rgba(0,0,0,0)'}`.trim();
    if (newBoxShadow !== value) {
      onChange(newBoxShadow);
    }
  }, [shadow, onChange, value]);
  
  const handleToggle = () => {
    if (value && value !== 'none') {
      onChange('none');
      setShadow(parseBoxShadow('none'));
    } else {
      setShadow({ x: '0px', y: '4px', blur: '6px', spread: '-1px', color: 'rgba(0,0,0,0.1)' });
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
        <button onClick={handleToggle} className="text-xs text-primary-purple hover:underline">
          {hasShadow ? 'Remove' : 'Add'}
        </button>
      </div>
      {hasShadow && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="X Offset" value={shadow.x} onChange={v => handleChange('x', v)} placeholder="0px" />
            <TextInput label="Y Offset" value={shadow.y} onChange={v => handleChange('y', v)} placeholder="4px" />
            <TextInput label="Blur" value={shadow.blur} onChange={v => handleChange('blur', v)} placeholder="6px" />
            <TextInput label="Spread" value={shadow.spread} onChange={v => handleChange('spread', v)} placeholder="0px" />
          </div>
          <ColorInput label="Color" value={shadow.color} onChange={v => handleChange('color', v)} />
        </>
      )}
    </div>
  );
};

export default BoxShadowInput;
