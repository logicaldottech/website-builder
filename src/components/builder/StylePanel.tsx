import React, { useState } from 'react';
import { produce } from 'immer';
import { Component, ImageFilters } from '../../types/builder';
import { ChevronDown, Search } from 'lucide-react';
import { useBuilderStore, findComponentPath } from '../../store/builderStore';
import ColorInput from './ColorInput';
import FourPointInput from './FourPointInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import BoxShadowInput from './BoxShadowInput';
import TextShadowInput from './TextShadowInput';
import GradientPicker from './advanced-controls/GradientPicker';
import SegmentedControl from './advanced-controls/SegmentedControl';

const StyleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-border" open>
    <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-alt">
      <span className="text-sm font-semibold text-text">{title}</span>
      <ChevronDown size={16} className="text-text-muted group-open:rotate-180 transition-transform" />
    </summary>
    <div className="p-4 space-y-4 bg-surface">
      {children}
    </div>
  </details>
);

const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center bg-surface-alt border border-border rounded-md p-0.5">{children}</div>
);

const ButtonGroupButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; title?: string }> = ({ onClick, isActive, children, title }) => (
  <button onClick={onClick} title={title} className={`flex-1 p-2 rounded-sm transition-colors text-xs capitalize ${isActive ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-border'}`}>
    {children}
  </button>
);

const TypographyControls: React.FC<{ styles: any, onStyleChange: (style: any) => void }> = ({ styles, onStyleChange }) => {
    const parseUnit = (value: string | undefined): { value: number, unit: string } => {
        if (!value) return { value: 0, unit: 'px' };
        const num = parseFloat(value);
        const unit = value.match(/px|%|em|rem|vw|vh/)?.[0] || 'px';
        return { value: isNaN(num) ? 0 : num, unit };
    };

    return (
        <>
            <SelectInput label="Font Family" value={styles.fontFamily} onChange={v => onStyleChange({ fontFamily: v })} options={[
                { value: 'inherit', label: 'Inherit' },
                { value: 'Poppins, sans-serif', label: 'Poppins' },
                { value: 'Arial, sans-serif', label: 'Arial' },
                { value: 'Verdana, sans-serif', label: 'Verdana' },
                { value: 'Georgia, serif', label: 'Georgia' },
                { value: '"Times New Roman", serif', label: 'Times New Roman' },
                { value: '"Courier New", monospace', label: 'Courier New' },
            ]} />
            <SliderInput label="Font Size" value={parseUnit(styles.fontSize).value} onChange={v => onStyleChange({ fontSize: `${v}px` })} min={8} max={120} unit="px" />
            <SelectInput label="Font Weight" value={styles.fontWeight} onChange={v => onStyleChange({ fontWeight: v })} options={[
                { value: '300', label: 'Light' }, { value: '400', label: 'Regular' }, { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi-Bold' }, { value: '700', label: 'Bold' }, { value: '900', label: 'Black' }
            ]} />
            <label className="text-xs font-semibold text-text-muted mb-1.5 mt-4 block">Text Transform</label>
            <ButtonGroup>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'none' })} isActive={!styles.textTransform || styles.textTransform === 'none'}>Default</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'uppercase' })} isActive={styles.textTransform === 'uppercase'}>Uppercase</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'lowercase' })} isActive={styles.textTransform === 'lowercase'}>Lowercase</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'capitalize' })} isActive={styles.textTransform === 'capitalize'}>Capitalize</ButtonGroupButton>
            </ButtonGroup>
            <label className="text-xs font-semibold text-text-muted mb-1.5 mt-4 block">Style & Decoration</label>
            <div className="grid grid-cols-2 gap-2">
                <ButtonGroup>
                    <ButtonGroupButton onClick={() => onStyleChange({ fontStyle: 'normal' })} isActive={!styles.fontStyle || styles.fontStyle === 'normal'}>Normal</ButtonGroupButton>
                    <ButtonGroupButton onClick={() => onStyleChange({ fontStyle: 'italic' })} isActive={styles.fontStyle === 'italic'}>Italic</ButtonGroupButton>
                </ButtonGroup>
                <ButtonGroup>
                    <ButtonGroupButton onClick={() => onStyleChange({ textDecoration: 'none' })} isActive={!styles.textDecoration || styles.textDecoration === 'none'}>None</ButtonGroupButton>
                    <ButtonGroupButton onClick={() => onStyleChange({ textDecoration: 'underline' })} isActive={styles.textDecoration === 'underline'}>Underline</ButtonGroupButton>
                    <ButtonGroupButton onClick={() => onStyleChange({ textDecoration: 'line-through' })} isActive={styles.textDecoration === 'line-through'}>Strike</ButtonGroupButton>
                </ButtonGroup>
            </div>
            <TextInput label="Line Height" value={styles.lineHeight} placeholder="e.g., 1.5 or 24px" onChange={v => onStyleChange({ lineHeight: v })} />
            <TextInput label="Letter Spacing" value={styles.letterSpacing} placeholder="e.g., 1.2px" onChange={v => onStyleChange({ letterSpacing: v })} />
        </>
    );
};

const StylePanel: React.FC = () => {
  const { selectedComponentId, components, updateComponentStyle, device } = useBuilderStore();
  const [activeStyleCategory, setActiveStyleCategory] = useState('Layout');
  
  if (!selectedComponentId) {
    return null; // Should be handled by parent
  }

  const pathResult = findComponentPath(selectedComponentId, components);
  if (!pathResult) return null;
  const selectedComponent = pathResult.component;

  const handleStyleChange = (style: Partial<Component['props']['style']['desktop']>) => {
    updateComponentStyle(selectedComponent.id, style, device);
  };

  const currentStyles = selectedComponent.props.style[device] || {};
  const parseUnit = (value: string | undefined): { value: number, unit: string } => {
    if (!value) return { value: 0, unit: 'px' };
    const num = parseFloat(value);
    const unit = value.match(/px|%|em|rem|vw|vh/)?.[0] || 'px';
    return { value: isNaN(num) ? 0 : num, unit };
  };

  const renderLayoutControls = () => (
    <>
      <StyleSection title="Sizing">
        <TextInput label="Width" value={currentStyles.width} placeholder="e.g., 100%" onChange={v => handleStyleChange({ width: v })}/>
        <TextInput label="Height" value={currentStyles.height} placeholder="e.g., 300px" onChange={v => handleStyleChange({ height: v })}/>
      </StyleSection>
      <StyleSection title="Spacing">
        <FourPointInput label="Margin"
          values={{ top: currentStyles.marginTop, right: currentStyles.marginRight, bottom: currentStyles.marginBottom, left: currentStyles.marginLeft }}
          onValueChange={(side, value) => handleStyleChange({ [`margin${side}`]: value })}
        />
        <FourPointInput label="Padding"
          values={{ top: currentStyles.paddingTop, right: currentStyles.paddingRight, bottom: currentStyles.paddingBottom, left: currentStyles.paddingLeft }}
          onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
        />
      </StyleSection>
    </>
  );

  const renderTypographyControls = () => (
    <StyleSection title="Typography">
      <TypographyControls styles={currentStyles} onStyleChange={handleStyleChange} />
    </StyleSection>
  );

  const renderColorControls = () => {
    const isGradient = currentStyles.backgroundImage && currentStyles.backgroundImage.includes('gradient');
    return (
      <>
        <StyleSection title="Fill">
          <label className="text-xs font-semibold text-text-muted mb-1.5 block">Background Type</label>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'none' })} isActive={!isGradient}>Solid</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'linear-gradient(to right, #6C63FF, #00C2FF)' })} isActive={isGradient}>Gradient</ButtonGroupButton>
          </ButtonGroup>
          <div className="mt-4">
            {isGradient ? (
              <GradientPicker value={currentStyles.backgroundImage} onChange={v => handleStyleChange({ backgroundImage: v })} />
            ) : (
              <ColorInput label="Background Color" value={currentStyles.backgroundColor} onChange={v => handleStyleChange({ backgroundColor: v })} />
            )}
          </div>
        </StyleSection>
        <StyleSection title="Text">
          <ColorInput label="Text Color" value={currentStyles.color} onChange={v => handleStyleChange({ color: v })} />
        </StyleSection>
      </>
    );
  };
  
  const renderEffectsControls = () => (
    <>
      <StyleSection title="Border">
        <TextInput label="Border" value={currentStyles.border} placeholder="e.g., 1px solid #ccc" onChange={v => handleStyleChange({ border: v })} />
        <SliderInput label="Border Radius" value={parseUnit(currentStyles.borderRadius).value} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={100} unit="px" />
      </StyleSection>
      <StyleSection title="Shadow">
        <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
        <TextShadowInput label="Text Shadow" value={currentStyles.textShadow} onChange={v => handleStyleChange({ textShadow: v })} />
      </StyleSection>
    </>
  );

  return (
    <div className="text-text bg-surface h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-base">{selectedComponent.type}</h3>
        <p className="text-xs text-text-muted truncate">ID: {selectedComponent.id}</p>
      </div>

      {/* Search & Tabs */}
      <div className="p-3 border-b border-border flex-shrink-0 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search properties..."
            className="w-full h-10 pl-9 pr-3 bg-surface-alt border border-border rounded-md focus:border-primary transition-all text-sm placeholder:text-text-muted"
          />
        </div>
        <SegmentedControl
          tabs={['Layout', 'Typography', 'Colors', 'Effects', 'Interactions']}
          activeTab={activeStyleCategory}
          onTabChange={setActiveStyleCategory}
        />
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto">
        {activeStyleCategory === 'Layout' && renderLayoutControls()}
        {activeStyleCategory === 'Typography' && renderTypographyControls()}
        {activeStyleCategory === 'Colors' && renderColorControls()}
        {activeStyleCategory === 'Effects' && renderEffectsControls()}
        {activeStyleCategory === 'Interactions' && <div className="p-8 text-center text-text-muted text-sm">Interaction controls coming soon.</div>}
      </div>
    </div>
  );
};

export default StylePanel;
