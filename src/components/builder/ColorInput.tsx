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
      <label className="text-xs font-semibold text-text-muted mb-1.5 block">{label}</label>
      <div
        onClick={handleOpen}
        className="w-full h-11 bg-surface-alt border border-border rounded-md flex items-center px-3 cursor-pointer"
      >
        <div
          className="w-6 h-6 rounded-sm border-2 border-white/20 dark:border-black/20"
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
