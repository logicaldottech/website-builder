import React from 'react';
import { Component } from '../../types/builder';
import { ChevronDown, AlignCenter, AlignEndHorizontal, AlignStartHorizontal, AlignStartVertical, AlignCenterVertical, AlignEndVertical, RectangleHorizontal, RectangleVertical, AlignLeft, AlignRight } from 'lucide-react';
import { useBuilderStore, findComponentPath } from '../../store/builderStore';
import ColorInput from './ColorInput';
import FourPointInput from './FourPointInput';
import SliderInput from './SliderInput';

const StyleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-border-color" open>
    <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-border-color/50">
      <span className="text-sm font-medium text-text-primary">{title}</span>
      <ChevronDown size={16} className="text-text-secondary group-open:rotate-180 transition-transform" />
    </summary>
    <div className="p-3 space-y-4 bg-background/30">
      {children}
    </div>
  </details>
);

const StyleInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-xs text-text-secondary mb-1.5 block font-medium">{label}</label>
    {children}
  </div>
);

const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center bg-background border border-border-color rounded-lg p-0.5">{children}</div>
);

const ButtonGroupButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => (
  <button onClick={onClick} className={`flex-1 p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary-purple text-white' : 'text-text-secondary hover:bg-border-color'}`}>
    {children}
  </button>
);

const StylePanel: React.FC = () => {
  const { selectedComponentId, components, updateComponentProps, updateComponentStyle, device } = useBuilderStore();
  
  if (!selectedComponentId) {
    return (
      <div className="p-4 text-center text-text-secondary text-sm">
        Select a component to inspect its styles.
      </div>
    );
  }

  const pathResult = findComponentPath(selectedComponentId, components);
  if (!pathResult) return null;
  const selectedComponent = pathResult.component;

  const handleStyleChange = (style: Partial<Component['props']['style']['desktop']>) => {
    updateComponentStyle(selectedComponent.id, style);
  };

  const handlePropChange = (props: Partial<Component['props']>) => {
    updateComponentProps(selectedComponent.id, props);
  };

  const currentDeviceStyle = selectedComponent.props.style[device] || {};

  const parseUnit = (value: string | undefined): { value: number, unit: string } => {
    if (!value) return { value: 0, unit: 'px' };
    const num = parseFloat(value);
    const unit = value.match(/px|%|em|rem|vw|vh/)?.[0] || 'px';
    return { value: isNaN(num) ? 0 : num, unit };
  };

  return (
    <div className="text-text-primary">
      <div className="p-3 border-b border-border-color">
        <h3 className="font-semibold">{selectedComponent.type}</h3>
        <p className="text-xs text-text-secondary truncate">ID: {selectedComponent.id}</p>
      </div>
      
      {selectedComponent.props.text !== undefined && (
        <StyleSection title="Content">
          <StyleInput label="Text">
            <input type="text" value={selectedComponent.props.text} onChange={(e) => handlePropChange({ text: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
          </StyleInput>
        </StyleSection>
      )}

      {selectedComponent.type === 'Video' && (
        <StyleSection title="Content">
          <StyleInput label="YouTube URL">
            <input type="text" value={selectedComponent.props.src} onChange={(e) => handlePropChange({ src: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
          </StyleInput>
        </StyleSection>
      )}

      {(selectedComponent.type === 'Container' || selectedComponent.type === 'Link') && (
        <StyleSection title="Layout">
          <StyleInput label="Direction">
            <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ flexDirection: 'row' })} isActive={currentDeviceStyle.flexDirection === 'row'}><RectangleHorizontal size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ flexDirection: 'column' })} isActive={currentDeviceStyle.flexDirection === 'column'}><RectangleVertical size={16}/></ButtonGroupButton>
            </ButtonGroup>
          </StyleInput>
          <StyleInput label="Justify Content">
             <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ justifyContent: 'flex-start' })} isActive={currentDeviceStyle.justifyContent === 'flex-start'}><AlignStartHorizontal size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ justifyContent: 'center' })} isActive={currentDeviceStyle.justifyContent === 'center'}><AlignCenter size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ justifyContent: 'flex-end' })} isActive={currentDeviceStyle.justifyContent === 'flex-end'}><AlignEndHorizontal size={16}/></ButtonGroupButton>
            </ButtonGroup>
          </StyleInput>
          <StyleInput label="Align Items">
             <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ alignItems: 'flex-start' })} isActive={currentDeviceStyle.alignItems === 'flex-start'}><AlignStartVertical size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ alignItems: 'center' })} isActive={currentDeviceStyle.alignItems === 'center'}><AlignCenterVertical size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ alignItems: 'flex-end' })} isActive={currentDeviceStyle.alignItems === 'flex-end'}><AlignEndVertical size={16}/></ButtonGroupButton>
            </ButtonGroup>
          </StyleInput>
          <StyleInput label="Gap">
            <input type="text" placeholder="e.g., 16px" value={currentDeviceStyle.gap || ''} onChange={(e) => handleStyleChange({ gap: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
          </StyleInput>
        </StyleSection>
      )}

      <StyleSection title="Sizing">
        <StyleInput label="Width">
          <input type="text" placeholder="e.g., 100%" value={currentDeviceStyle.width || ''} onChange={(e) => handleStyleChange({ width: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
        <StyleInput label="Height">
          <input type="text" placeholder="e.g., 300px" value={currentDeviceStyle.height || ''} onChange={(e) => handleStyleChange({ height: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
      </StyleSection>

      <StyleSection title="Appearance">
        <ColorInput label="Background Color" value={currentDeviceStyle.backgroundColor || ''} onChange={color => handleStyleChange({ backgroundColor: color })} />
        <SliderInput
          label="Opacity"
          value={Number(currentDeviceStyle.opacity || 1) * 100}
          onChange={v => handleStyleChange({ opacity: String(v / 100) })}
          min={0} max={100} unit="%"
        />
        <StyleInput label="Border">
          <input type="text" placeholder="e.g., 1px solid #ccc" value={currentDeviceStyle.border || ''} onChange={(e) => handleStyleChange({ border: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
        <SliderInput
          label="Border Radius"
          value={parseUnit(currentDeviceStyle.borderRadius).value}
          onChange={v => handleStyleChange({ borderRadius: `${v}px` })}
          min={0} max={50} unit="px"
        />
        <StyleInput label="Shadow">
          <input type="text" placeholder="e.g., 0px 4px 6px #0002" value={currentDeviceStyle.boxShadow || ''} onChange={(e) => handleStyleChange({ boxShadow: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
      </StyleSection>

      <StyleSection title="Spacing">
        <FourPointInput label="Margin"
          values={{ top: currentDeviceStyle.marginTop, right: currentDeviceStyle.marginRight, bottom: currentDeviceStyle.marginBottom, left: currentDeviceStyle.marginLeft }}
          onValueChange={(side, value) => handleStyleChange({ [`margin${side}`]: value })}
        />
        <FourPointInput label="Padding"
          values={{ top: currentDeviceStyle.paddingTop, right: currentDeviceStyle.paddingRight, bottom: currentDeviceStyle.paddingBottom, left: currentDeviceStyle.paddingLeft }}
          onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
        />
      </StyleSection>

      <StyleSection title="Typography">
        <StyleInput label="Font Family">
          <input type="text" placeholder="e.g., Inter, sans-serif" value={currentDeviceStyle.fontFamily || ''} onChange={(e) => handleStyleChange({ fontFamily: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
        <SliderInput
          label="Font Size"
          value={parseUnit(currentDeviceStyle.fontSize).value}
          onChange={v => handleStyleChange({ fontSize: `${v}px` })}
          min={8} max={100} unit="px"
        />
        <StyleInput label="Font Weight">
           <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ fontWeight: 'normal' })} isActive={currentDeviceStyle.fontWeight === 'normal'}>Normal</ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ fontWeight: 'bold' })} isActive={currentDeviceStyle.fontWeight === 'bold'}>Bold</ButtonGroupButton>
            </ButtonGroup>
        </StyleInput>
        <StyleInput label="Text Align">
           <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ textAlign: 'left' })} isActive={currentDeviceStyle.textAlign === 'left'}><AlignLeft size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ textAlign: 'center' })} isActive={currentDeviceStyle.textAlign === 'center'}><AlignCenter size={16}/></ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ textAlign: 'right' })} isActive={currentDeviceStyle.textAlign === 'right'}><AlignRight size={16}/></ButtonGroupButton>
            </ButtonGroup>
        </StyleInput>
        <ColorInput label="Color" value={currentDeviceStyle.color || ''} onChange={color => handleStyleChange({ color })} />
      </StyleSection>
    </div>
  );
};

export default StylePanel;
