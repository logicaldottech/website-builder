import React from 'react';
import { Component, StyleProperties } from '../../types/builder';
import { ChevronDown, AlignCenter, AlignEndHorizontal, AlignStartHorizontal, AlignStartVertical, AlignCenterVertical, AlignEndVertical, RectangleHorizontal, RectangleVertical, Bold, Italic, Underline, AlignLeft, AlignRight } from 'lucide-react';
import { useBuilderStore, findComponentPath } from '../../store/builderStore';

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
  if (!pathResult) return null; // Should not happen if id is valid
  const selectedComponent = pathResult.component;

  const handleStyleChange = (style: Partial<StyleProperties>) => {
    updateComponentStyle(selectedComponent.id, style);
  };

  const handlePropChange = (props: Partial<Component['props']>) => {
    updateComponentProps(selectedComponent.id, props);
  };

  const responsiveStyles = {
    ...selectedComponent.props.style.desktop,
    ...selectedComponent.props.style.tablet,
    ...selectedComponent.props.style.mobile,
  }
  const currentDeviceStyle = selectedComponent.props.style[device] || {};

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

      <StyleSection title="Appearance">
        <StyleInput label="Background Color">
          <div className="flex items-center gap-2">
             <input type="color" value={currentDeviceStyle.backgroundColor || '#00000000'} onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-background"/>
            <input type="text" placeholder="#RRGGBB" value={currentDeviceStyle.backgroundColor || ''} onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
          </div>
        </StyleInput>
        <StyleInput label="Border">
          <input type="text" placeholder="e.g., 1px solid #ccc" value={currentDeviceStyle.border || ''} onChange={(e) => handleStyleChange({ border: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
        <StyleInput label="Border Radius">
          <input type="text" placeholder="e.g., 8px" value={currentDeviceStyle.borderRadius || ''} onChange={(e) => handleStyleChange({ borderRadius: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
      </StyleSection>

      <StyleSection title="Spacing">
        <StyleInput label="Margin">
          <input type="text" placeholder="e.g., 10px or 0 10px" value={currentDeviceStyle.margin || ''} onChange={(e) => handleStyleChange({ margin: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
        <StyleInput label="Padding">
          <input type="text" placeholder="e.g., 10px or 0 10px" value={currentDeviceStyle.padding || ''} onChange={(e) => handleStyleChange({ padding: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
      </StyleSection>

      <StyleSection title="Typography">
        <StyleInput label="Font Size">
          <input type="text" placeholder="e.g., 16px" value={currentDeviceStyle.fontSize || ''} onChange={(e) => handleStyleChange({ fontSize: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
        </StyleInput>
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
        <StyleInput label="Color">
          <div className="flex items-center gap-2">
             <input type="color" value={currentDeviceStyle.color || '#000000'} onChange={(e) => handleStyleChange({ color: e.target.value })} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-background"/>
            <input type="text" placeholder="#RRGGBB" value={currentDeviceStyle.color || ''} onChange={(e) => handleStyleChange({ color: e.target.value })} className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all text-sm"/>
          </div>
        </StyleInput>
      </StyleSection>
    </div>
  );
};

export default StylePanel;
