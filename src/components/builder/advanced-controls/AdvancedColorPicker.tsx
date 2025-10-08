import React, { useState, useEffect } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

interface AdvancedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({ value, onChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('Picker');
  const [internalColor, setInternalColor] = useState(value || '#ffffff');
  const { globalColors, savedColors, recentColors, updateGlobalColor, addSavedColor, removeSavedColor, addRecentColor } = useBuilderStore();

  useEffect(() => {
    setInternalColor(value || '#ffffff');
  }, [value]);

  const handleColorChange = (color: string) => {
    setInternalColor(color);
    onChange(color);
  };

  const handleFinalChange = () => {
    addRecentColor(internalColor);
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
      <div className="w-full h-40 rounded-lg" style={{ backgroundColor: internalColor }} />
      <div className="mt-4 space-y-3">
        {/* Basic color picker functionality can be expanded here with canvas-based picker */}
        <input
          type="color"
          value={internalColor.startsWith('#') ? internalColor : '#ffffff'}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-10 p-0 border-none rounded cursor-pointer bg-transparent"
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={internalColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"
          />
          <button onClick={handleEyedropper} className="p-2 bg-border-color rounded-md hover:bg-primary-purple">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const GlobalColorsTab = () => (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-2">Theme Colors</h4>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(globalColors).map(([name, color]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleColorChange(color)}
                className={`w-full h-8 rounded border-2 transition-all ${value === color ? 'border-primary-purple' : 'border-transparent hover:border-white/50'}`}
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text-secondary capitalize">{name}</span>
            </div>
          ))}
        </div>
      </div>
       <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-2">Saved Colors</h4>
        <div className="grid grid-cols-5 gap-2">
          {savedColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(color)}
              className={`w-full h-8 rounded border-2 transition-all ${value === color ? 'border-primary-purple' : 'border-transparent hover:border-white/50'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <button onClick={() => addSavedColor(internalColor)} className="w-full h-8 rounded border-2 border-dashed border-border-color flex items-center justify-center hover:border-primary-purple">
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-2">Recently Used</h4>
        <div className="grid grid-cols-5 gap-2">
          {recentColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(color)}
              className={`w-full h-8 rounded border-2 transition-all ${value === color ? 'border-primary-purple' : 'border-transparent hover:border-white/50'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-72 bg-secondary-gray border border-border-color rounded-lg shadow-2xl flex flex-col">
      <div className="flex-shrink-0 border-b border-border-color">
        <div className="flex items-center -mb-px px-2">
          <button onClick={() => setActiveTab('Picker')} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === 'Picker' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Picker</button>
          <button onClick={() => setActiveTab('Global Colors')} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === 'Global Colors' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Global</button>
        </div>
      </div>
      <div className="flex-grow">
        {activeTab === 'Picker' ? <PickerTab /> : <GlobalColorsTab />}
      </div>
      <div className="flex-shrink-0 p-2 border-t border-border-color flex justify-between">
        <button onClick={() => { onChange(''); onClose(); }} className="p-2 text-text-secondary hover:text-red-400">
          <Trash2 size={16} />
        </button>
        <button onClick={handleFinalChange} className="px-4 py-1.5 text-sm font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90">
          Done
        </button>
      </div>
    </div>
  );
};

export default AdvancedColorPicker;
