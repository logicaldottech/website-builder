import React, { useState, useEffect } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

interface AdvancedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({ value, onChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('Global');
  const [internalColor, setInternalColor] = useState(value || '#ffffff');
  const { globalColors, savedColors, recentColors, addSavedColor, addRecentColor } = useBuilderStore();

  useEffect(() => {
    setInternalColor(value || '#ffffff');
  }, [value]);

  const handleColorChange = (color: string) => {
    setInternalColor(color);
    onChange(color);
  };

  const handleFinalChange = () => {
    if (internalColor) {
      addRecentColor(internalColor);
    }
    onClose();
  };

  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch (e) {
        console.log('EyeDropper was canceled.');
      }
    } else {
      alert('Your browser does not support the EyeDropper API.');
    }
  };
  
  const PickerTab = () => (
    <div className="p-4">
      <div className="w-full h-40 rounded-lg border border-border" style={{ backgroundColor: internalColor }} />
      <div className="mt-4 space-y-3">
        <input
          type="color"
          value={internalColor.startsWith('#') ? internalColor : '#ffffff'}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-10 p-0 border-none rounded cursor-pointer bg-transparent"
        />
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">#</span>
            <input
              type="text"
              value={internalColor.startsWith('#') ? internalColor.substring(1) : internalColor}
              onChange={(e) => handleColorChange(`#${e.target.value}`)}
              className="w-full pl-6 pr-3 py-2 bg-surface-alt border border-border rounded-md focus:border-primary transition-all text-sm"
            />
          </div>
          <button onClick={handleEyedropper} className="p-2.5 bg-surface-alt rounded-md hover:bg-border border border-border">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const ColorSwatch: React.FC<{ color: string, name?: string }> = ({ color, name }) => (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={() => handleColorChange(color)}
        className={`w-full h-8 rounded-md border-2 transition-all ${value === color ? 'border-primary' : 'border-transparent hover:border-border'}`}
        style={{ backgroundColor: color }}
        title={name || color}
      />
      {name && <span className="text-[10px] text-text-muted capitalize truncate">{name}</span>}
    </div>
  );

  const GlobalColorsTab = () => (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-text-muted mb-2 px-1">Theme Colors</h4>
        <div className="grid grid-cols-5 gap-x-2 gap-y-3">
          {Object.entries(globalColors).map(([name, color]) => <ColorSwatch key={name} name={name} color={color} />)}
        </div>
      </div>
       <div className="h-px bg-border -mx-4" />
       <div>
        <h4 className="text-xs font-semibold text-text-muted mb-2 px-1">Saved Colors</h4>
        <div className="grid grid-cols-5 gap-x-2 gap-y-3">
          {savedColors.map((color, index) => <ColorSwatch key={index} color={color} />)}
          <button onClick={() => addSavedColor(internalColor)} className="w-full h-8 rounded-md border-2 border-dashed border-border flex items-center justify-center hover:border-primary text-text-muted hover:text-primary">
            <Plus size={16} />
          </button>
        </div>
      </div>
      {recentColors.length > 0 && (
        <>
          <div className="h-px bg-border -mx-4" />
          <div>
            <h4 className="text-xs font-semibold text-text-muted mb-2 px-1">Recently Used</h4>
            <div className="grid grid-cols-5 gap-x-2 gap-y-3">
              {recentColors.map((color, index) => <ColorSwatch key={index} color={color} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-72 bg-surface border border-border rounded-lg shadow-2xl flex flex-col">
      <div className="flex-shrink-0 border-b border-border">
        <div className="flex items-center -mb-px px-2">
          <button onClick={() => setActiveTab('Global')} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === 'Global' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}>Global</button>
          <button onClick={() => setActiveTab('Picker')} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === 'Picker' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}>Picker</button>
        </div>
      </div>
      <div className="flex-grow">
        {activeTab === 'Picker' ? <PickerTab /> : <GlobalColorsTab />}
      </div>
      <div className="flex-shrink-0 p-2 border-t border-border flex justify-between items-center">
        <button onClick={() => { onChange(''); onClose(); }} className="p-2 text-text-muted hover:text-danger" title="Clear color">
          <Trash2 size={16} />
        </button>
        <button onClick={handleFinalChange} className="px-4 h-9 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-600">
          Done
        </button>
      </div>
    </div>
  );
};

export default AdvancedColorPicker;
