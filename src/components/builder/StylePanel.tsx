import React, { useState } from 'react';
import { Component, ComponentProps, StyleProperties, WidgetType } from '../../types/builder';
import { ChevronDown, EyeOff, AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal, AlignHorizontalSpaceBetween, AlignStartVertical, AlignCenterVertical, AlignEndVertical, StretchVertical } from 'lucide-react';
import { useBuilderStore, findComponentPath, Device, ActivePropertiesTab } from '../../store/builderStore';
import ColorInput from './ColorInput';
import FourPointInput from './FourPointInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import BoxShadowInput from './BoxShadowInput';
import TextShadowInput from './TextShadowInput';
import SegmentedControl from './advanced-controls/SegmentedControl';
import AlignmentControl from './advanced-controls/AlignmentControl';
import BasicSectionSettings from './style-panel/BasicSectionSettings';
import AdvancedSectionSettings from './style-panel/AdvancedSectionSettings';

const StyleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => (
  <details className="group border-b border-border" open={defaultOpen}>
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

const WIDGET_VARIANTS: Partial<Record<WidgetType, { label: string; value: string }[]>> = {
  FeatureCard: [{ value: 'neutral', label: 'Neutral' }, { value: 'primary', label: 'Primary' }],
  Testimonial: [{ value: 'emphasized', label: 'Emphasized' }, { value: 'plain', label: 'Plain' }],
  PricingCard: [{ value: 'neutral', label: 'Neutral' }, { value: 'primary', label: 'Primary' }],
  StatsCounter: [{ value: 'neutral', label: 'Neutral' }, { value: 'accent', label: 'Accent' }],
  Steps: [{ value: 'numbered', label: 'Numbered' }, { value: 'lined', label: 'Lined' }],
  Accordion: [{ value: 'bordered', label: 'Bordered' }, { value: 'shadow', label: 'Shadow' }],
  Tabs: [{ value: 'underline', label: 'Underline' }, { value: 'pill', label: 'Pill' }],
  Alert: [{ value: 'info', label: 'Info' }, { value: 'success', label: 'Success' }, { value: 'warning', label: 'Warning' }, { value: 'danger', label: 'Danger' }],
  Badge: [{ value: 'primary', label: 'Primary' }, { value: 'accent', label: 'Accent' }, { value: 'neutral', label: 'Neutral' }, { value: 'success', label: 'Success' }, { value: 'warning', label: 'Warning' }, { value: 'danger', label: 'Danger' }],
  Divider: [{ value: 'line', label: 'Line' }, { value: 'dashed', label: 'Dashed' }, { value: 'spaced', label: 'Spaced' }],
};

const StylePanel: React.FC = () => {
  const { 
    selectedComponentId, components, updateComponentProps, updateComponentStyle, device,
    activePropertiesTab, setActivePropertiesTab, updateWidgetVariant
  } = useBuilderStore();
  const [styleState, setStyleState] = useState<'default' | 'hover'>('default');

  if (!selectedComponentId) return null;

  const pathResult = findComponentPath(selectedComponentId, components);
  if (!pathResult) return null;
  const selectedComponent = pathResult.component;

  const effectiveStyleState = styleState === 'default' ? device : 'hover';

  const handleStyleChange = (style: Partial<StyleProperties>) => {
    updateComponentStyle(selectedComponent.id, style, effectiveStyleState);
  };

  const handlePropsChange = (newProps: Partial<ComponentProps>) => {
    updateComponentProps(selectedComponent.id, newProps);
  };

  const currentStyles = selectedComponent.props.style[effectiveStyleState] || {};
  const parseUnit = (value: string | undefined): number => {
    if (!value) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };
  
  if (selectedComponent.type === 'Section') {
    const container = selectedComponent.children?.[0];
    if (!container || container.type !== 'Container') return <div className="p-4 text-sm text-danger">Invalid Section: Missing Container</div>;
    
    return (
      <div className="text-text bg-surface h-full flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold text-base">{selectedComponent.type}</h3>
          <p className="text-xs text-text-muted">ID: {selectedComponent.id.substring(0, 8)}</p>
        </div>
        
        <div className="p-3 border-b border-border flex-shrink-0">
          <SegmentedControl
            tabs={['Basic', 'Advanced']}
            activeTab={activePropertiesTab === 'Style' ? 'Basic' : activePropertiesTab}
            onTabChange={(tab) => setActivePropertiesTab(tab as ActivePropertiesTab)}
          />
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {activePropertiesTab === 'Basic' && <BasicSectionSettings section={selectedComponent} container={container} />}
          {activePropertiesTab === 'Advanced' && <AdvancedSectionSettings section={selectedComponent} container={container} />}
        </div>
      </div>
    );
  }

  // Fallback for other components
  const renderGenericStyleTab = () => {
    const isFlexContainer = ['Container', 'Row', 'Column'].includes(selectedComponent.type) && (currentStyles.display === 'flex' || currentStyles.display === 'grid');
    const isText = ['Heading', 'Paragraph', 'Button', 'Link'].includes(selectedComponent.type);
    const hasBackground = ['Container', 'Row', 'Column', 'Button'].includes(selectedComponent.type);
    const widgetType = selectedComponent.props.widgetType;
    const variants = widgetType ? WIDGET_VARIANTS[widgetType] : undefined;

    return (
      <>
        {variants && (
          <StyleSection title="Variant">
            <SelectInput
              label="Style Variant"
              value={selectedComponent.props.variant}
              onChange={(v) => updateWidgetVariant(selectedComponent.id, v)}
              options={variants}
            />
          </StyleSection>
        )}
        <div className="p-4 border-b border-border">
          <SelectInput
            label="State"
            value={styleState}
            onChange={(v) => setStyleState(v as 'default' | 'hover')}
            options={[{ value: 'default', label: 'Default' }, { value: 'hover', label: 'Hover' }]}
          />
        </div>
        <StyleSection title="Layout">
          <SelectInput label="Display" value={currentStyles.display} onChange={v => handleStyleChange({ display: v as any })} options={[{value: 'flex', label: 'Flex'}, {value: 'grid', label: 'Grid'}, {value: 'block', label: 'Block'}, {value: 'inline-block', label: 'Inline Block'}]} />
          {isFlexContainer && (
            <>
              <SelectInput label="Direction" value={currentStyles.flexDirection} onChange={v => handleStyleChange({ flexDirection: v as any })} options={[{value: 'column', label: 'Vertical'}, {value: 'row', label: 'Horizontal'}]} />
              <AlignmentControl
                label="Justify"
                value={currentStyles.justifyContent}
                onChange={v => handleStyleChange({ justifyContent: v })}
                options={[
                  { value: 'flex-start', icon: <AlignStartHorizontal size={18} />, title: 'Start' },
                  { value: 'center', icon: <AlignCenterHorizontal size={18} />, title: 'Center' },
                  { value: 'flex-end', icon: <AlignEndHorizontal size={18} />, title: 'End' },
                  { value: 'space-between', icon: <AlignHorizontalSpaceBetween size={18} />, title: 'Space Between' },
                ]}
              />
              <AlignmentControl
                label="Align"
                value={currentStyles.alignItems}
                onChange={v => handleStyleChange({ alignItems: v })}
                options={[
                  { value: 'flex-start', icon: <AlignStartVertical size={18} />, title: 'Start' },
                  { value: 'center', icon: <AlignCenterVertical size={18} />, title: 'Center' },
                  { value: 'flex-end', icon: <AlignEndVertical size={18} />, title: 'End' },
                  { value: 'stretch', icon: <StretchVertical size={18} />, title: 'Stretch' },
                ]}
              />
              <TextInput label="Gap" value={currentStyles.gap} onChange={v => handleStyleChange({ gap: v })} placeholder="e.g. 16px" />
            </>
          )}
        </StyleSection>
        <StyleSection title="Sizing">
          <TextInput label="Width" value={currentStyles.width} placeholder="e.g., 100%" onChange={v => handleStyleChange({ width: v })}/>
          <TextInput label="Height" value={currentStyles.height} placeholder="e.g., auto" onChange={v => handleStyleChange({ height: v })}/>
          <TextInput label="Min Height" value={currentStyles.minHeight} placeholder="e.g., 240px" onChange={v => handleStyleChange({ minHeight: v })}/>
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
        {isText && (
          <StyleSection title="Typography">
            <ColorInput label="Color" value={currentStyles.color || ''} onChange={v => handleStyleChange({ color: v })} />
            <SelectInput label="Font" value={currentStyles.fontFamily} onChange={v => handleStyleChange({ fontFamily: v })} options={[{ value: 'Poppins, sans-serif', label: 'Poppins' }]} />
            <SliderInput label="Size" value={parseUnit(currentStyles.fontSize)} onChange={v => handleStyleChange({ fontSize: `${v}px` })} min={8} max={120} unit="px" />
            <SelectInput label="Weight" value={currentStyles.fontWeight} onChange={v => handleStyleChange({ fontWeight: v as any })} options={['300','400','500','600','700','900'].map(o => ({value: o, label: o}))} />
            <SelectInput label="Align" value={currentStyles.textAlign} onChange={v => handleStyleChange({ textAlign: v as any })} options={['left', 'center', 'right'].map(o => ({value: o, label: o}))} />
          </StyleSection>
        )}
        {hasBackground && (
          <StyleSection title="Background">
            <ColorInput label="Background Color" value={currentStyles.backgroundColor || ''} onChange={v => handleStyleChange({ backgroundColor: v })} />
          </StyleSection>
        )}
        <StyleSection title="Border">
          <SliderInput label="Radius" value={parseUnit(currentStyles.borderRadius)} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={100} unit="px" />
          <TextInput label="Width" value={currentStyles.borderWidth} onChange={v => handleStyleChange({ borderWidth: v })} placeholder="e.g. 1px" />
          <SelectInput label="Style" value={currentStyles.borderStyle} onChange={v => handleStyleChange({ borderStyle: v as any })} options={['solid', 'dashed', 'dotted'].map(o => ({value: o, label: o}))} />
          <ColorInput label="Color" value={currentStyles.borderColor || ''} onChange={v => handleStyleChange({ borderColor: v })} />
        </StyleSection>
        <StyleSection title="Shadow">
          <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
          {isText && <TextShadowInput label="Text Shadow" value={currentStyles.textShadow} onChange={v => handleStyleChange({ textShadow: v })} />}
        </StyleSection>
        <StyleSection title="Effects">
          <SliderInput label="Opacity" value={currentStyles.opacity ? parseUnit(currentStyles.opacity) * 100 : 100} onChange={v => handleStyleChange({ opacity: `${v / 100}` })} min={0} max={100} unit="%" />
        </StyleSection>
      </>
    );
  };

  const renderSettingsTab = () => {
    const visibility = selectedComponent.props.visibility || {};
    const handleVisibilityChange = (device: Device) => {
      handlePropsChange({
        visibility: { ...visibility, [device]: !(visibility[device] ?? true) }
      });
    };
    return (
      <>
        <StyleSection title="HTML Tag">
          <SelectInput label="Tag" value={selectedComponent.props.htmlTag} onChange={v => handlePropsChange({ htmlTag: v as any })} options={['div', 'section', 'h1', 'h2', 'p', 'details', 'summary'].map(o => ({value: o, label: o}))} />
        </StyleSection>
        <StyleSection title="Attributes">
          <TextInput label="Custom ID" value={selectedComponent.props.customId} onChange={v => handlePropsChange({ customId: v })} />
          <TextInput label="Custom Class" value={selectedComponent.props.customClassName} onChange={v => handlePropsChange({ customClassName: v })} />
        </StyleSection>
        <StyleSection title="Visibility">
          <p className="text-xs font-semibold text-text-muted mb-1.5 block">Hide on</p>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handleVisibilityChange('desktop')} isActive={!(visibility.desktop ?? true)} title="Desktop"><EyeOff size={16} /></ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleVisibilityChange('tablet')} isActive={!(visibility.tablet ?? true)} title="Tablet"><EyeOff size={16} /></ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleVisibilityChange('mobile')} isActive={!(visibility.mobile ?? true)} title="Mobile"><EyeOff size={16} /></ButtonGroupButton>
          </ButtonGroup>
        </StyleSection>
      </>
    );
  };

  const renderInteractionsTab = () => (
    <div className="p-8 text-center text-text-muted text-sm">
      Interaction controls are coming soon.
    </div>
  );

  return (
    <div className="text-text bg-surface h-full flex flex-col">
      <div className="p-4 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-base">{selectedComponent.props.widgetType || selectedComponent.type}</h3>
      </div>
      
      <div className="p-3 border-b border-border flex-shrink-0">
        <SegmentedControl
          tabs={['Style', 'Settings', 'Interactions']}
          activeTab={activePropertiesTab}
          onTabChange={(tab) => setActivePropertiesTab(tab as ActivePropertiesTab)}
        />
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {activePropertiesTab === 'Style' && renderGenericStyleTab()}
        {activePropertiesTab === 'Settings' && renderSettingsTab()}
        {activePropertiesTab === 'Interactions' && renderInteractionsTab()}
      </div>
    </div>
  );
};

export default StylePanel;
