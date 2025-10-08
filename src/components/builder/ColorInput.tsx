import React from 'react';
import { usePopover } from '../../hooks/usePopover';
import AdvancedColorPicker from './advanced-controls/AdvancedColorPicker';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const { open, handleOpen, handleClose, getPopoverProps } = usePopover();

  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 block font-medium">{label}</label>
      <div
        onClick={handleOpen}
        className="w-full h-10 bg-background border border-border-color rounded-lg flex items-center px-3 cursor-pointer"
      >
        <div
          className="w-6 h-6 rounded border-2 border-white/20"
          style={{ backgroundColor: value || 'transparent' }}
        />
        <span className="ml-3 text-sm">{value || 'No Color'}</span>
      </div>
      
      {open && (
        <div {...getPopoverProps()}>
          <AdvancedColorPicker value={value} onChange={onChange} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default ColorInput;
