import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

const IconPickerModal: React.FC = () => {
  const { isIconPickerOpen, closeIconPicker, iconPickerCallback } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');

  const iconList = useMemo(() => Object.keys(LucideIcons).filter(key => 
    key !== 'createLucideIcon' && key !== 'icons' && typeof (LucideIcons as any)[key] === 'object'
  ), []);

  const filteredIcons = useMemo(() => 
    iconList.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
  , [searchQuery, iconList]);

  if (!isIconPickerOpen) return null;

  const handleIconSelect = (iconName: string) => {
    if (iconPickerCallback) {
      iconPickerCallback(iconName);
    }
    closeIconPicker();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeIconPicker}>
      <div className="bg-secondary-gray rounded-xl w-full max-w-3xl h-[70vh] flex flex-col shadow-2xl border border-border-color" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">Select an Icon</h2>
          <button onClick={closeIconPicker} className="p-1 rounded-md hover:bg-border-color"><X size={20} className="text-text-secondary" /></button>
        </div>
        <div className="p-4 border-b border-border-color flex-shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for icons..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg"
              autoFocus
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredIcons.map(iconName => {
              const IconComponent = (LucideIcons as any)[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => handleIconSelect(iconName)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-md aspect-square text-text-secondary hover:bg-primary-purple hover:text-white transition-colors"
                  title={iconName}
                >
                  <IconComponent size={24} />
                  <span className="text-xs truncate w-full text-center">{iconName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
