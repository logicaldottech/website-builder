import React from 'react';
import { Component } from '../../../types/builder';
import { useBuilderStore, Device } from '../../../store/builderStore';
import StyleSection from './StyleSection';
import SelectInput from '../SelectInput';
import ColorInput from '../ColorInput';
import GradientPicker from '../advanced-controls/GradientPicker';
import ImageInput from '../advanced-controls/ImageInput';
import SliderInput from '../SliderInput';
import TextInput from '../TextInput';

interface BasicSectionSettingsProps {
  section: Component;
  container: Component;
}

const BasicSectionSettings: React.FC<BasicSectionSettingsProps> = ({ section, container }) => {
  const { updateComponentProps, device } = useBuilderStore();
  const sectionProps = section.props.sectionProps || {};
  const containerProps = container.props.containerProps || {};
  const background = sectionProps.background || { type: 'none' };

  const handleSectionChange = (change: any) => {
    updateComponentProps(section.id, { sectionProps: change });
  };

  const handleContainerChange = (change: any) => {
    updateComponentProps(container.id, { containerProps: change });
  };

  const handleBackgroundChange = (change: any) => {
    handleSectionChange({ background: { ...background, ...change } });
  };

  return (
    <div>
      <StyleSection title="Layout">
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Padding Top"
            value={sectionProps.paddingY?.[device] || sectionProps.paddingY?.lg}
            onChange={(v) => handleSectionChange({ paddingY: { ...sectionProps.paddingY, [device]: v } })}
          />
          <TextInput
            label="Padding Bottom"
            value={sectionProps.paddingY?.[device] || sectionProps.paddingY?.lg}
            onChange={(v) => handleSectionChange({ paddingY: { ...sectionProps.paddingY, [device]: v } })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sectionProps.fullBleed || false}
            onChange={(e) => handleSectionChange({ fullBleed: e.target.checked })}
          />
          Full-bleed Background
        </label>
      </StyleSection>

      <StyleSection title="Background">
        <SelectInput
          label="Type"
          value={background.type || 'none'}
          onChange={(v) => handleBackgroundChange({ type: v })}
          options={['none', 'color', 'gradient', 'image', 'video'].map(o => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
        />
        {background.type === 'color' && <ColorInput label="Color" value={background.color || ''} onChange={v => handleBackgroundChange({ color: v })} />}
        {background.type === 'gradient' && <GradientPicker value={background.gradient} onChange={v => handleBackgroundChange({ gradient: v })} />}
        {background.type === 'image' && (
          <>
            <ImageInput value={background.image?.src} onChange={v => handleBackgroundChange({ image: { ...background.image, src: v } })} />
            <ColorInput label="Overlay Color" value={background.overlay?.color || ''} onChange={v => handleBackgroundChange({ overlay: { ...background.overlay, color: v } })} />
            <SliderInput label="Overlay Opacity" value={(background.overlay?.opacity || 0) * 100} onChange={v => handleBackgroundChange({ overlay: { ...background.overlay, opacity: v / 100 } })} unit="%" />
          </>
        )}
      </StyleSection>

      <StyleSection title="Container">
        <SelectInput
          label="Max Width"
          value={containerProps.maxWidth || 'lg'}
          onChange={(v) => handleContainerChange({ maxWidth: v })}
          options={['sm', 'md', 'lg', 'xl'].map(o => ({ value: o, label: o.toUpperCase() }))}
        />
        <SelectInput
          label="Align"
          value={containerProps.align || 'center'}
          onChange={(v) => handleContainerChange({ align: v })}
          options={[{ value: 'center', label: 'Center' }, { value: 'left', label: 'Left' }]}
        />
        <TextInput
          label="Padding X"
          value={containerProps.paddingX?.[device] || containerProps.paddingX?.lg}
          onChange={(v) => handleContainerChange({ paddingX: { ...containerProps.paddingX, [device]: v } })}
        />
      </StyleSection>

      <StyleSection title="Gutters">
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Row Gap"
            value={containerProps.rowGap}
            onChange={(v) => handleContainerChange({ rowGap: v })}
          />
          <TextInput
            label="Column Gap"
            value={containerProps.columnGap}
            onChange={(v) => handleContainerChange({ columnGap: v })}
          />
        </div>
      </StyleSection>
    </div>
  );
};

export default BasicSectionSettings;
