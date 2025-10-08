import React, { useState } from 'react';
import { produce } from 'immer';
import { Component, ImageFilters } from '../../types/builder';
import { ChevronDown, AlignCenter, AlignEndHorizontal, AlignStartHorizontal, AlignStartVertical, AlignCenterVertical, AlignEndVertical, WrapText, ArrowLeftRight, Columns, Rows, Rows3, AlignHorizontalSpaceAround, Smile } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useBuilderStore, findComponentPath } from '../../store/builderStore';
import ColorInput from './ColorInput';
import FourPointInput from './FourPointInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import BorderInput from './BorderInput';
import BoxShadowInput from './BoxShadowInput';
import TextShadowInput from './TextShadowInput';
import GradientPicker from './advanced-controls/GradientPicker';
import ImageInput from './advanced-controls/ImageInput';

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

const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center bg-background border border-border-color rounded-lg p-0.5">{children}</div>
);

const ButtonGroupButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; title?: string }> = ({ onClick, isActive, children, title }) => (
  <button onClick={onClick} title={title} className={`flex-1 p-1.5 rounded-md transition-colors text-xs capitalize ${isActive ? 'bg-primary-purple text-white' : 'text-text-secondary hover:bg-border-color'}`}>
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
            <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Text Transform</label>
            <ButtonGroup>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'none' })} isActive={!styles.textTransform || styles.textTransform === 'none'}>Default</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'uppercase' })} isActive={styles.textTransform === 'uppercase'}>Uppercase</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'lowercase' })} isActive={styles.textTransform === 'lowercase'}>Lowercase</ButtonGroupButton>
                <ButtonGroupButton onClick={() => onStyleChange({ textTransform: 'capitalize' })} isActive={styles.textTransform === 'capitalize'}>Capitalize</ButtonGroupButton>
            </ButtonGroup>
            <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Style & Decoration</label>
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
  const { selectedComponentId, components, updateComponentProps, updateComponentStyle, device, openIconPicker } = useBuilderStore();
  const [styleState, setStyleState] = useState<'normal' | 'hover'>('normal');
  
  if (!selectedComponentId) {
    return <div className="p-4 text-center text-text-secondary text-sm">Select a component to inspect its styles.</div>;
  }

  const pathResult = findComponentPath(selectedComponentId, components);
  if (!pathResult) return null;
  const selectedComponent = pathResult.component;

  const handleStyleChange = (style: Partial<Component['props']['style']['desktop']>) => {
    const stateToUpdate = styleState === 'hover' ? 'hover' : device;
    updateComponentStyle(selectedComponent.id, style, stateToUpdate);
  };

  const handlePropChange = (props: Partial<Component['props']>) => {
    updateComponentProps(selectedComponent.id, props);
  };

  const currentStyles = styleState === 'normal' 
    ? selectedComponent.props.style[device] || {}
    : selectedComponent.props.style.hover || {};
  
  const currentProps = selectedComponent.props;
  const parseUnit = (value: string | undefined): { value: number, unit: string } => {
    if (!value) return { value: 0, unit: 'px' };
    const num = parseFloat(value);
    const unit = value.match(/px|%|em|rem|vw|vh/)?.[0] || 'px';
    return { value: isNaN(num) ? 0 : num, unit };
  };

  const renderDefaultStyles = () => (
    <>
      {currentProps.text !== undefined && (
        <StyleSection title="Content">
          <TextInput label="Text" value={currentProps.text} onChange={(val) => handlePropChange({ text: val })} />
        </StyleSection>
      )}
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
      <StyleSection title="Typography">
        <SliderInput label="Font Size" value={parseUnit(currentStyles.fontSize).value} onChange={v => handleStyleChange({ fontSize: `${v}px` })} min={8} max={100} unit="px" />
        <ColorInput label="Color" value={currentStyles.color || ''} onChange={color => handleStyleChange({ color })} />
      </StyleSection>
    </>
  );

  const renderHeadingStyles = () => {
    const isGradient = currentStyles.backgroundClip === 'text';

    return (
      <>
        <StyleSection title="Content">
          <TextInput label="Text" value={currentProps.text} onChange={(val) => handlePropChange({ text: val })} />
          <SelectInput 
            label="HTML Tag" 
            value={currentProps.htmlTag} 
            onChange={v => handlePropChange({ htmlTag: v as any })} 
            options={[
              { value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' },
              { value: 'h4', label: 'H4' }, { value: 'h5', label: 'H5' }, { value: 'h6', label: 'H6' },
              { value: 'p', label: 'p' }, { value: 'div', label: 'div' }
            ]}
          />
        </StyleSection>
        <StyleSection title="Typography">
          <TypographyControls styles={currentStyles} onStyleChange={handleStyleChange} />
        </StyleSection>
        <StyleSection title="Color & Style">
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Text Color Type</label>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'none', backgroundClip: 'border-box', WebkitBackgroundClip: 'border-box' })} isActive={!isGradient}>Solid</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'linear-gradient(to right, #6E42E8, #A0A0A0)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' })} isActive={isGradient}>Gradient</ButtonGroupButton>
          </ButtonGroup>
          <div className="mt-4">
            {isGradient ? (
              <GradientPicker value={currentStyles.backgroundImage} onChange={v => handleStyleChange({ backgroundImage: v })} />
            ) : (
              <ColorInput label="Color" value={currentStyles.color || ''} onChange={color => handleStyleChange({ color })} />
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border-color">
            <TextShadowInput label="Text Shadow" value={currentStyles.textShadow} onChange={v => handleStyleChange({ textShadow: v })} />
          </div>
        </StyleSection>
      </>
    );
  };
  
  const renderParagraphStyles = () => {
    return (
      <>
        <StyleSection title="Content">
          <TextInput label="Text" value={currentProps.text} onChange={(val) => handlePropChange({ text: val })} />
        </StyleSection>
        <StyleSection title="Typography">
          <TypographyControls styles={currentStyles} onStyleChange={handleStyleChange} />
        </StyleSection>
        <StyleSection title="Color">
          <ColorInput label="Text Color" value={currentStyles.color || ''} onChange={color => handleStyleChange({ color })} />
        </StyleSection>
        <StyleSection title="Spacing & Columns">
          <TextInput label="Line Spacing (Line Height)" value={currentStyles.lineHeight} placeholder="e.g., 1.5" onChange={v => handleStyleChange({ lineHeight: v })} />
          <SliderInput label="Column Count" value={Number(currentStyles.columnCount) || 1} onChange={v => handleStyleChange({ columnCount: String(v) })} min={1} max={6} step={1} />
          <TextInput label="Column Gap" value={currentStyles.columnGap} placeholder="e.g., 24px" onChange={v => handleStyleChange({ columnGap: v })} />
        </StyleSection>
      </>
    );
  };

  const renderSectionStyles = () => {
    const sectionProps = selectedComponent.props.sectionSpecificProps || {};
    const background = sectionProps.background || { type: 'color' };

    const handleSectionPropChange = (path: string, value: any) => {
      const newSectionProps = produce(sectionProps, draft => {
        const keys = path.split('.');
        let current: any = draft;
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] === undefined) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      });
      handlePropChange({ sectionSpecificProps: newSectionProps });
    };

    const bgType = background.type || 'color';

    return (
      <>
        <StyleSection title="Background">
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Background Type</label>
          <ButtonGroup>
            {['color', 'gradient', 'image', 'video'].map(type => (
              <ButtonGroupButton key={type} onClick={() => handleSectionPropChange('background.type', type)} isActive={bgType === type}>
                {type}
              </ButtonGroupButton>
            ))}
          </ButtonGroup>

          <div className="mt-4">
            {bgType === 'color' && (
              <ColorInput label="Background Color" value={background.color || ''} onChange={v => handleSectionPropChange('background.color', v)} />
            )}

            {bgType === 'gradient' && (
              <GradientPicker value={background.gradient} onChange={v => handleSectionPropChange('background.gradient', v)} />
            )}
            
            {bgType === 'image' && (
              <div className="space-y-4">
                <ImageInput value={background.image?.src} onChange={v => handleSectionPropChange('background.image.src', v)} />
                <SelectInput label="Position" value={background.image?.position} onChange={v => handleSectionPropChange('background.image.position', v)} options={[ 'center', 'top', 'bottom', 'left', 'right' ].map(o => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1)}))} />
                <SelectInput label="Attachment" value={background.image?.attachment} onChange={v => handleSectionPropChange('background.image.attachment', v)} options={[{value: 'scroll', label: 'Scroll'}, {value: 'fixed', label: 'Fixed (Parallax)'}]} />
                <SelectInput label="Repeat" value={background.image?.repeat} onChange={v => handleSectionPropChange('background.image.repeat', v)} options={['no-repeat', 'repeat', 'repeat-x', 'repeat-y'].map(o => ({ value: o, label: o}))} />
                <SelectInput label="Size" value={background.image?.size} onChange={v => handleSectionPropChange('background.image.size', v)} options={[{value: 'cover', label: 'Cover'}, {value: 'contain', label: 'Contain'}, {value: 'auto', label: 'Auto'}]} />
              </div>
            )}

            {bgType === 'video' && (
               <div className="space-y-4">
                <TextInput label="Video Source (URL)" value={background.video?.src} placeholder="https://youtube.com/..." onChange={v => handleSectionPropChange('background.video.src', v)} />
                 <div className="text-sm text-text-secondary p-2 bg-background rounded-md">Video playback options (loop, mute) coming soon!</div>
               </div>
            )}
          </div>

          {(bgType === 'image' || bgType === 'video') && (
            <div className="space-y-4 mt-4 pt-4 border-t border-border-color">
              <h4 className="text-sm font-semibold text-text-primary">Background Overlay</h4>
              <ColorInput label="Overlay Color" value={background.overlay?.color || ''} onChange={v => handleSectionPropChange('background.overlay.color', v)} />
              <SliderInput label="Opacity" value={background.overlay?.opacity !== undefined ? background.overlay.opacity * 100 : 50} onChange={v => handleSectionPropChange('background.overlay.opacity', v / 100)} min={0} max={100} unit="%" />
            </div>
          )}
        </StyleSection>

        <StyleSection title="Layout & Spacing">
          <TextInput label="Min Height" value={currentStyles.minHeight} placeholder="e.g., 500px or 100vh" onChange={v => handleStyleChange({ minHeight: v })} />
          <FourPointInput label="Padding"
            values={{ top: currentStyles.paddingTop, right: currentStyles.paddingRight, bottom: currentStyles.paddingBottom, left: currentStyles.paddingLeft }}
            onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
          />
        </StyleSection>

        <StyleSection title="Shape & Decoration">
           <div className="space-y-4">
             <BorderInput label="Top Border" value={sectionProps.borderTop} onChange={v => handleSectionPropChange('borderTop', v)} />
             <BorderInput label="Bottom Border" value={sectionProps.borderBottom} onChange={v => handleSectionPropChange('borderBottom', v)} />
           </div>
           <div className="text-sm text-text-secondary p-2 mt-4 bg-background rounded-md">Shape Dividers coming soon!</div>
        </StyleSection>
        
        <StyleSection title="Typography Defaults">
          <ColorInput label="Base Text Color" value={currentStyles.color || ''} onChange={color => handleStyleChange({ color })} />
        </StyleSection>
        
        <StyleSection title="Extra">
            <SelectInput label="HTML Tag" value={currentProps.htmlTag} onChange={v => handlePropChange({ htmlTag: v as any })} options={[ {value: 'div', label: 'div'}, {value: 'section', label: 'section'}, {value: 'header', label: 'header'}, {value: 'footer', label: 'footer'} ]}/>
            <TextInput label="Z-Index" value={currentStyles.zIndex} placeholder="e.g., 10" onChange={v => handleStyleChange({ zIndex: v })} />
            <TextInput label="Custom CSS ID" value={currentProps.customId} onChange={v => handlePropChange({ customId: v })} />
            <TextInput label="Custom CSS Classes" value={currentProps.customClassName} onChange={v => handlePropChange({ customClassName: v })} />
        </StyleSection>
      </>
    );
  };

  const renderContainerStyles = () => {
    const isFullWidth = currentStyles.maxWidth === '100%';

    const handleWidthModeChange = (mode: 'boxed' | 'full') => {
      handleStyleChange({ maxWidth: mode === 'full' ? '100%' : '1140px' });
    };

    return (
      <>
        <StyleSection title="Layout & Sizing">
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Content Width</label>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handleWidthModeChange('boxed')} isActive={!isFullWidth}>Boxed</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleWidthModeChange('full')} isActive={isFullWidth}>Full Width</ButtonGroupButton>
          </ButtonGroup>
          
          {!isFullWidth && (
            <TextInput label="Max Width" value={currentStyles.maxWidth} placeholder="e.g., 1140px" onChange={v => handleStyleChange({ maxWidth: v })} />
          )}
          
          <TextInput label="Min Height" value={currentStyles.minHeight} placeholder="e.g., 400px" onChange={v => handleStyleChange({ minHeight: v })} />
          
          <SelectInput 
            label="HTML Tag" 
            value={currentProps.htmlTag} 
            onChange={v => handlePropChange({ htmlTag: v as any })} 
            options={[ 
              {value: 'div', label: 'div'}, 
              {value: 'main', label: 'main'}, 
              {value: 'article', label: 'article'}, 
              {value: 'aside', label: 'aside'} 
            ]}
          />
        </StyleSection>
  
        <StyleSection title="Appearance">
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Background Type</label>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handlePropChange({ backgroundType: 'color' })} isActive={!currentProps.backgroundType || currentProps.backgroundType === 'color'}>Color</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handlePropChange({ backgroundType: 'gradient' })} isActive={currentProps.backgroundType === 'gradient'}>Gradient</ButtonGroupButton>
          </ButtonGroup>

          <div className="mt-4">
            {(!currentProps.backgroundType || currentProps.backgroundType === 'color') && (
              <ColorInput label="Background Color" value={currentStyles.backgroundColor || ''} onChange={color => handleStyleChange({ backgroundColor: color, backgroundImage: 'none' })} />
            )}
            {currentProps.backgroundType === 'gradient' && (
              <GradientPicker value={currentStyles.backgroundImage} onChange={v => handleStyleChange({ backgroundImage: v, backgroundColor: 'transparent' })} />
            )}
          </div>

          <div className="space-y-4 mt-4 pt-4 border-t border-border-color">
            <TextInput label="Border" value={currentStyles.border} placeholder="e.g., 1px solid #ccc" onChange={v => handleStyleChange({ border: v })} />
            <SliderInput label="Border Radius" value={parseUnit(currentStyles.borderRadius).value} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={100} unit="px" />
            <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
          </div>
        </StyleSection>
  
        <StyleSection title="Spacing">
          <FourPointInput label="Padding"
            values={{ top: currentStyles.paddingTop, right: currentStyles.paddingRight, bottom: currentStyles.paddingBottom, left: currentStyles.paddingLeft }}
            onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
          />
          <FourPointInput label="Margin"
            values={{ top: currentStyles.marginTop, right: currentStyles.marginRight, bottom: currentStyles.marginBottom, left: currentStyles.marginLeft }}
            onValueChange={(side, value) => handleStyleChange({ [`margin${side}`]: value })}
          />
        </StyleSection>
  
        <StyleSection title="Content Alignment">
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Direction</label>
          <ButtonGroup>
            <ButtonGroupButton title="Vertical" onClick={() => handleStyleChange({ flexDirection: 'column' })} isActive={currentStyles.flexDirection === 'column'}><Rows size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Horizontal" onClick={() => handleStyleChange({ flexDirection: 'row' })} isActive={currentStyles.flexDirection === 'row'}><Columns size={16}/></ButtonGroupButton>
          </ButtonGroup>
          
          <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Align Items</label>
          <ButtonGroup>
            <ButtonGroupButton title="Align Start" onClick={() => handleStyleChange({ alignItems: 'flex-start' })} isActive={currentStyles.alignItems === 'flex-start'}><AlignStartVertical size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Align Center" onClick={() => handleStyleChange({ alignItems: 'center' })} isActive={currentStyles.alignItems === 'center'}><AlignCenterVertical size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Align End" onClick={() => handleStyleChange({ alignItems: 'flex-end' })} isActive={currentStyles.alignItems === 'flex-end'}><AlignEndVertical size={16}/></ButtonGroupButton>
          </ButtonGroup>
  
          <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Justify Content</label>
          <ButtonGroup>
            <ButtonGroupButton title="Justify Start" onClick={() => handleStyleChange({ justifyContent: 'flex-start' })} isActive={currentStyles.justifyContent === 'flex-start'}><AlignStartHorizontal size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Justify Center" onClick={() => handleStyleChange({ justifyContent: 'center' })} isActive={currentStyles.justifyContent === 'center'}><AlignCenter size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Justify End" onClick={() => handleStyleChange({ justifyContent: 'flex-end' })} isActive={currentStyles.justifyContent === 'flex-end'}><AlignEndHorizontal size={16}/></ButtonGroupButton>
            <ButtonGroupButton title="Space Between" onClick={() => handleStyleChange({ justifyContent: 'space-between' })} isActive={currentStyles.justifyContent === 'space-between'}><ArrowLeftRight size={16}/></ButtonGroupButton>
          </ButtonGroup>
  
          <TextInput label="Gap" value={currentStyles.gap} placeholder="e.g., 16px" onChange={v => handleStyleChange({ gap: v })} />
        </StyleSection>
      </>
    );
  };

  const renderRowStyles = () => (
    <>
      <StyleSection title="Layout & Alignment">
        <label className="text-xs text-text-secondary mb-1.5 block font-medium">Direction</label>
        <ButtonGroup>
          <ButtonGroupButton title="Left-to-Right" onClick={() => handleStyleChange({ flexDirection: 'row' })} isActive={!currentStyles.flexDirection || currentStyles.flexDirection === 'row'}>Row</ButtonGroupButton>
          <ButtonGroupButton title="Right-to-Left" onClick={() => handleStyleChange({ flexDirection: 'row-reverse' })} isActive={currentStyles.flexDirection === 'row-reverse'}>Row-Reverse</ButtonGroupButton>
        </ButtonGroup>

        <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Align Items (Vertical)</label>
        <ButtonGroup>
          <ButtonGroupButton title="Start" onClick={() => handleStyleChange({ alignItems: 'flex-start' })} isActive={currentStyles.alignItems === 'flex-start'}><AlignStartVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Center" onClick={() => handleStyleChange({ alignItems: 'center' })} isActive={currentStyles.alignItems === 'center'}><AlignCenterVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="End" onClick={() => handleStyleChange({ alignItems: 'flex-end' })} isActive={currentStyles.alignItems === 'flex-end'}><AlignEndVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Stretch" onClick={() => handleStyleChange({ alignItems: 'stretch' })} isActive={currentStyles.alignItems === 'stretch'}><Rows3 size={16}/></ButtonGroupButton>
        </ButtonGroup>
        
        <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Justify Content (Horizontal)</label>
        <ButtonGroup>
          <ButtonGroupButton title="Start" onClick={() => handleStyleChange({ justifyContent: 'flex-start' })} isActive={!currentStyles.justifyContent || currentStyles.justifyContent === 'flex-start'}><AlignStartHorizontal size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Center" onClick={() => handleStyleChange({ justifyContent: 'center' })} isActive={currentStyles.justifyContent === 'center'}><AlignCenter size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="End" onClick={() => handleStyleChange({ justifyContent: 'flex-end' })} isActive={currentStyles.justifyContent === 'flex-end'}><AlignEndHorizontal size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Space Between" onClick={() => handleStyleChange({ justifyContent: 'space-between' })} isActive={currentStyles.justifyContent === 'space-between'}><ArrowLeftRight size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Space Around" onClick={() => handleStyleChange({ justifyContent: 'space-around' })} isActive={currentStyles.justifyContent === 'space-around'}><AlignHorizontalSpaceAround size={16}/></ButtonGroupButton>
        </ButtonGroup>

        <div className="grid grid-cols-2 gap-4 mt-4">
            <TextInput label="Column Gap" value={currentStyles.columnGap} placeholder="e.g., 16px" onChange={v => handleStyleChange({ columnGap: v, gap: '' })} />
            <TextInput label="Row Gap" value={currentStyles.rowGap} placeholder="e.g., 16px" onChange={v => handleStyleChange({ rowGap: v, gap: '' })} />
        </div>

        <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Wrapping</label>
        <ButtonGroup>
          <ButtonGroupButton onClick={() => handleStyleChange({ flexWrap: 'nowrap' })} isActive={!currentStyles.flexWrap || currentStyles.flexWrap === 'nowrap'}>No Wrap</ButtonGroupButton>
          <ButtonGroupButton onClick={() => handleStyleChange({ flexWrap: 'wrap' })} isActive={currentStyles.flexWrap === 'wrap'}><WrapText size={16}/></ButtonGroupButton>
        </ButtonGroup>
      </StyleSection>
    </>
  );

  const renderColumnStyles = () => (
    <>
      <StyleSection title="Layout & Sizing">
        <TextInput label="Width" value={currentStyles.width} placeholder="e.g., 50%, 33.33%" onChange={v => handleStyleChange({ width: v })} />
        
        <label className="text-xs text-text-secondary mb-1.5 mt-4 block font-medium">Vertical Alignment (Align Self)</label>
        <ButtonGroup>
          <ButtonGroupButton title="Auto" onClick={() => handleStyleChange({ alignSelf: 'auto' })} isActive={!currentStyles.alignSelf || currentStyles.alignSelf === 'auto'}>Auto</ButtonGroupButton>
          <ButtonGroupButton title="Start" onClick={() => handleStyleChange({ alignSelf: 'flex-start' })} isActive={currentStyles.alignSelf === 'flex-start'}><AlignStartVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Center" onClick={() => handleStyleChange({ alignSelf: 'center' })} isActive={currentStyles.alignSelf === 'center'}><AlignCenterVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="End" onClick={() => handleStyleChange({ alignSelf: 'flex-end' })} isActive={currentStyles.alignSelf === 'flex-end'}><AlignEndVertical size={16}/></ButtonGroupButton>
          <ButtonGroupButton title="Stretch" onClick={() => handleStyleChange({ alignSelf: 'stretch' })} isActive={currentStyles.alignSelf === 'stretch'}><Rows3 size={16}/></ButtonGroupButton>
        </ButtonGroup>
        
        <div className="mt-4">
          <TextInput label="Order" value={currentStyles.order} placeholder="e.g., -1 or 1" onChange={v => handleStyleChange({ order: v })} />
        </div>
      </StyleSection>

      <StyleSection title="Spacing">
        <FourPointInput label="Padding"
          values={{ top: currentStyles.paddingTop, right: currentStyles.paddingRight, bottom: currentStyles.paddingBottom, left: currentStyles.paddingLeft }}
          onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
        />
      </StyleSection>

      <StyleSection title="Appearance">
        <label className="text-xs text-text-secondary mb-1.5 block font-medium">Background Type</label>
        <ButtonGroup>
            <ButtonGroupButton onClick={() => handlePropChange({ backgroundType: 'color' })} isActive={!currentProps.backgroundType || currentProps.backgroundType === 'color'}>Color</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handlePropChange({ backgroundType: 'gradient' })} isActive={currentProps.backgroundType === 'gradient'}>Gradient</ButtonGroupButton>
        </ButtonGroup>
        <div className="mt-4">
            {(!currentProps.backgroundType || currentProps.backgroundType === 'color') && (
              <ColorInput label="Background Color" value={currentStyles.backgroundColor || ''} onChange={color => handleStyleChange({ backgroundColor: color, backgroundImage: 'none' })} />
            )}
            {currentProps.backgroundType === 'gradient' && (
              <GradientPicker value={currentStyles.backgroundImage} onChange={v => handleStyleChange({ backgroundImage: v, backgroundColor: 'transparent' })} />
            )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border-color space-y-4">
            <TextInput label="Border" value={currentStyles.border} placeholder="e.g., 1px solid #ccc" onChange={v => handleStyleChange({ border: v })} />
            <SliderInput label="Border Radius" value={parseUnit(currentStyles.borderRadius).value} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={100} unit="px" />
            <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
        </div>
      </StyleSection>
    </>
  );

  const renderButtonStyles = () => {
    const isGradient = currentStyles.backgroundImage && currentStyles.backgroundImage.includes('gradient');
    return (
      <>
        <StyleSection title="Content">
          <TextInput label="Text" value={currentProps.text} onChange={v => handlePropChange({ text: v })} />
          <TextInput label="Link URL" value={currentProps.href} placeholder="https://example.com" onChange={v => handlePropChange({ href: v })} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="linkTarget" checked={currentProps.linkTarget === '_blank'} onChange={e => handlePropChange({ linkTarget: e.target.checked ? '_blank' : '_self' })} />
            <label htmlFor="linkTarget" className="text-sm text-text-secondary">Open in new tab</label>
          </div>
          <div className="mt-4">
            <label className="text-xs text-text-secondary mb-1.5 block font-medium">Icon</label>
            <button onClick={() => openIconPicker((icon) => handlePropChange({ icon }))} className="w-full p-2 bg-background border border-border-color rounded-lg flex items-center gap-2 text-sm">
              {currentProps.icon ? (
                <>
                  {React.createElement((LucideIcons as any)[currentProps.icon])}
                  <span className="ml-2">{currentProps.icon}</span>
                </>
              ) : (
                <>
                  <Smile size={16} />
                  <span className="ml-2">Select Icon</span>
                </>
              )}
            </button>
            {currentProps.icon && (
              <>
                <ButtonGroup>
                  <ButtonGroupButton onClick={() => handlePropChange({ iconPosition: 'before' })} isActive={currentProps.iconPosition === 'before'}>Before</ButtonGroupButton>
                  <ButtonGroupButton onClick={() => handlePropChange({ iconPosition: 'after' })} isActive={currentProps.iconPosition === 'after'}>After</ButtonGroupButton>
                </ButtonGroup>
                <SliderInput label="Icon Spacing" value={parseUnit(currentStyles.gap).value} onChange={v => handleStyleChange({ gap: `${v}px`})} max={32} unit="px" />
              </>
            )}
          </div>
        </StyleSection>
        <StyleSection title="Styling">
          <ButtonGroup>
            <ButtonGroupButton onClick={() => setStyleState('normal')} isActive={styleState === 'normal'}>Normal</ButtonGroupButton>
            <ButtonGroupButton onClick={() => setStyleState('hover')} isActive={styleState === 'hover'}>Hover</ButtonGroupButton>
          </ButtonGroup>
          <div className="mt-4 space-y-4">
            <TypographyControls styles={currentStyles} onStyleChange={handleStyleChange} />
            <ColorInput label="Text Color" value={currentStyles.color} onChange={v => handleStyleChange({ color: v })} />
            
            <label className="text-xs text-text-secondary mb-1.5 block font-medium">Background Type</label>
            <ButtonGroup>
              <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'none' })} isActive={!isGradient}>Solid</ButtonGroupButton>
              <ButtonGroupButton onClick={() => handleStyleChange({ backgroundImage: 'linear-gradient(to right, #6E42E8, #8868F9)' })} isActive={isGradient}>Gradient</ButtonGroupButton>
            </ButtonGroup>
            {isGradient ? (
              <GradientPicker value={currentStyles.backgroundImage} onChange={v => handleStyleChange({ backgroundImage: v })} />
            ) : (
              <ColorInput label="Background Color" value={currentStyles.backgroundColor} onChange={v => handleStyleChange({ backgroundColor: v })} />
            )}

            <TextInput label="Border" value={currentStyles.border} placeholder="e.g., 1px solid #ccc" onChange={v => handleStyleChange({ border: v })} />
            <SliderInput label="Border Radius" value={parseUnit(currentStyles.borderRadius).value} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={50} unit="px" />
            <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
          </div>
        </StyleSection>
        <StyleSection title="Layout & Spacing">
           <FourPointInput label="Padding"
            values={{ top: currentStyles.paddingTop, right: currentStyles.paddingRight, bottom: currentStyles.paddingBottom, left: currentStyles.paddingLeft }}
            onValueChange={(side, value) => handleStyleChange({ [`padding${side}`]: value })}
          />
        </StyleSection>
      </>
    );
  };

  const renderImageStyles = () => {
    const filters = currentProps.filters || {};
    const handleFilterChange = (filter: keyof ImageFilters, value: number) => {
      handlePropChange({ filters: { ...filters, [filter]: value } });
    };

    return (
      <>
        <StyleSection title="Content">
          <ImageInput value={currentProps.src} onChange={v => handlePropChange({ src: v })} />
          <TextInput label="Alt Text" value={currentProps.altText} onChange={v => handlePropChange({ altText: v })} />
          <TextInput label="Link URL" value={currentProps.href} placeholder="https://example.com" onChange={v => handlePropChange({ href: v })} />
        </StyleSection>
        <StyleSection title="Sizing & Layout">
          <TextInput label="Width" value={currentStyles.width} onChange={v => handleStyleChange({ width: v })} />
          <TextInput label="Max Width" value={currentStyles.maxWidth} onChange={v => handleStyleChange({ maxWidth: v })} />
          <TextInput label="Height" value={currentStyles.height} onChange={v => handleStyleChange({ height: v })} />
          <label className="text-xs text-text-secondary mb-1.5 block font-medium">Object Fit</label>
          <ButtonGroup>
            <ButtonGroupButton onClick={() => handleStyleChange({ objectFit: 'fill' })} isActive={currentStyles.objectFit === 'fill'}>Fill</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleStyleChange({ objectFit: 'cover' })} isActive={currentStyles.objectFit === 'cover'}>Cover</ButtonGroupButton>
            <ButtonGroupButton onClick={() => handleStyleChange({ objectFit: 'contain' })} isActive={currentStyles.objectFit === 'contain'}>Contain</ButtonGroupButton>
          </ButtonGroup>
        </StyleSection>
        <StyleSection title="Appearance">
          <SliderInput label="Opacity" value={currentStyles.opacity ? parseFloat(currentStyles.opacity) * 100 : 100} onChange={v => handleStyleChange({ opacity: String(v / 100) })} unit="%" />
          <TextInput label="Border" value={currentStyles.border} placeholder="e.g., 1px solid #ccc" onChange={v => handleStyleChange({ border: v })} />
          <SliderInput label="Border Radius" value={parseUnit(currentStyles.borderRadius).value} onChange={v => handleStyleChange({ borderRadius: `${v}px` })} min={0} max={200} unit="px" />
          <BoxShadowInput label="Box Shadow" value={currentStyles.boxShadow} onChange={v => handleStyleChange({ boxShadow: v })} />
        </StyleSection>
        <StyleSection title="CSS Filters">
          <SliderInput label="Brightness" value={filters.brightness ?? 100} onChange={v => handleFilterChange('brightness', v)} min={0} max={200} unit="%" />
          <SliderInput label="Contrast" value={filters.contrast ?? 100} onChange={v => handleFilterChange('contrast', v)} min={0} max={200} unit="%" />
          <SliderInput label="Saturation" value={filters.saturate ?? 100} onChange={v => handleFilterChange('saturate', v)} min={0} max={200} unit="%" />
          <SliderInput label="Blur" value={filters.blur ?? 0} onChange={v => handleFilterChange('blur', v)} min={0} max={20} unit="px" />
        </StyleSection>
      </>
    );
  };

  const renderIconStyles = () => (
    <>
      <StyleSection title="Content">
        <label className="text-xs text-text-secondary mb-1.5 block font-medium">Icon</label>
        <button onClick={() => openIconPicker((icon) => handlePropChange({ icon }))} className="w-full p-2 bg-background border border-border-color rounded-lg flex items-center gap-2 text-sm">
          {currentProps.icon ? (
            <>
              {React.createElement((LucideIcons as any)[currentProps.icon])}
              <span className="ml-2">{currentProps.icon}</span>
            </>
          ) : (
            <>
              <Smile size={16} />
              <span className="ml-2">Select Icon</span>
            </>
          )}
        </button>
      </StyleSection>
      <StyleSection title="Styling">
        <ColorInput label="Color" value={currentStyles.color} onChange={v => handleStyleChange({ color: v })} />
        <SliderInput label="Size" value={parseUnit(currentStyles.fontSize).value} onChange={v => handleStyleChange({ fontSize: `${v}px` })} min={8} max={200} unit="px" />
        <SliderInput label="Rotation" value={currentProps.rotation ?? 0} onChange={v => handlePropChange({ rotation: v })} min={0} max={360} unit="deg" />
      </StyleSection>
    </>
  );

  const renderDividerStyles = () => (
     <StyleSection title="Divider Style">
        <SelectInput label="Style" value={currentStyles.borderStyle} onChange={v => handleStyleChange({ borderStyle: v as any })} options={[
          { value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }, { value: 'double', label: 'Double' }
        ]} />
        <SliderInput label="Weight" value={parseUnit(currentStyles.borderWidth).value} onChange={v => handleStyleChange({ borderWidth: `${v}px` })} min={1} max={20} unit="px" />
        <ColorInput label="Color" value={currentStyles.borderColor} onChange={v => handleStyleChange({ borderColor: v })} />
        <SliderInput label="Width" value={parseUnit(currentStyles.width).value} onChange={v => handleStyleChange({ width: `${v}%` })} unit="%" />
     </StyleSection>
  );

  const renderSpecificStyles = () => {
    switch (selectedComponent.type) {
      case 'Section': return renderSectionStyles();
      case 'Container': return renderContainerStyles();
      case 'Row': return renderRowStyles();
      case 'Column': return renderColumnStyles();
      case 'Heading': return renderHeadingStyles();
      case 'Paragraph': return renderParagraphStyles();
      case 'Button': return renderButtonStyles();
      case 'Image': return renderImageStyles();
      case 'Icon': return renderIconStyles();
      case 'Divider': return renderDividerStyles();
      default: return renderDefaultStyles();
    }
  };

  return (
    <div className="text-text-primary">
      <div className="p-3 border-b border-border-color">
        <h3 className="font-semibold">{selectedComponent.type}</h3>
        <p className="text-xs text-text-secondary truncate">ID: {selectedComponent.id}</p>
      </div>
      {renderSpecificStyles()}
    </div>
  );
};

export default StylePanel;
