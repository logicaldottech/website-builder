import React from 'react';
import { Component } from '../../../types/builder';
import { useBuilderStore, Device } from '../../../store/builderStore';
import StyleSection from './StyleSection';
import SelectInput from '../SelectInput';
import TextInput from '../TextInput';
import BoxShadowInput from '../BoxShadowInput';
import { EyeOff } from 'lucide-react';

interface AdvancedSectionSettingsProps {
  section: Component;
  container: Component;
}

const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center bg-surface-alt border border-border rounded-md p-0.5">{children}</div>
);

const ButtonGroupButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; title?: string }> = ({ onClick, isActive, children, title }) => (
  <button onClick={onClick} title={title} className={`flex-1 p-2 rounded-sm transition-colors text-xs capitalize ${isActive ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-border'}`}>
    {children}
  </button>
);

const AdvancedSectionSettings: React.FC<AdvancedSectionSettingsProps> = ({ section, container }) => {
  const { updateComponentProps, updateComponentStyle } = useBuilderStore();
  const sectionProps = section.props.sectionProps || {};
  const containerProps = container.props.containerProps || {};
  const sectionStyle = section.props.style.desktop || {};
  const visibility = section.props.visibility || {};

  const handleSectionPropsChange = (change: any) => {
    updateComponentProps(section.id, { sectionProps: change });
  };
  
  const handleContainerPropsChange = (change: any) => {
    updateComponentProps(container.id, { containerProps: change });
  };

  const handleSectionStyleChange = (change: any) => {
    updateComponentStyle(section.id, change, 'desktop');
  };

  const handleVisibilityChange = (device: Device) => {
    updateComponentProps(section.id, {
      visibility: { ...visibility, [device]: !(visibility[device] ?? true) }
    });
  };

  return (
    <div>
      <StyleSection title="Effects & Layer">
        <BoxShadowInput label="Shadow" value={sectionStyle.boxShadow} onChange={v => handleSectionStyleChange({ boxShadow: v })} />
        <TextInput label="Border" value={sectionStyle.border} onChange={v => handleSectionStyleChange({ border: v })} placeholder="e.g. 1px solid #e6e8f0" />
        <TextInput label="Z-Index" value={sectionStyle.zIndex} onChange={v => handleSectionStyleChange({ zIndex: v })} placeholder="auto" />
        <SelectInput
          label="Blend Mode"
          value={sectionStyle.mixBlendMode}
          onChange={v => handleSectionStyleChange({ mixBlendMode: v })}
          options={['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'].map(o => ({ value: o, label: o }))}
        />
      </StyleSection>

      <StyleSection title="Visibility">
        <p className="text-xs font-semibold text-text-muted mb-1.5 block">Hide on</p>
        <ButtonGroup>
          <ButtonGroupButton onClick={() => handleVisibilityChange('desktop')} isActive={!(visibility.desktop ?? true)} title="Desktop"><EyeOff size={16} /></ButtonGroupButton>
          <ButtonGroupButton onClick={() => handleVisibilityChange('tablet')} isActive={!(visibility.tablet ?? true)} title="Tablet"><EyeOff size={16} /></ButtonGroupButton>
          <ButtonGroupButton onClick={() => handleVisibilityChange('mobile')} isActive={!(visibility.mobile ?? true)} title="Mobile"><EyeOff size={16} /></ButtonGroupButton>
        </ButtonGroup>
      </StyleSection>

      <StyleSection title="Sticky Container">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={containerProps.isSticky || false}
            onChange={(e) => handleContainerPropsChange({ isSticky: e.target.checked })}
          />
          Enable Sticky
        </label>
        {containerProps.isSticky && (
          <TextInput
            label="Offset Top"
            value={containerProps.stickyOffset}
            onChange={v => handleContainerPropsChange({ stickyOffset: v })}
            placeholder="0px"
          />
        )}
      </StyleSection>

      <StyleSection title="Animation">
        <SelectInput
          label="Preset"
          value={sectionProps.animation?.preset}
          onChange={v => handleSectionPropsChange({ animation: { ...sectionProps.animation, preset: v } })}
          options={['fadeIn', 'fadeInUp', 'slideUp', 'pulse', 'scaleIn'].map(o => ({ value: o, label: o }))}
        />
        {/* Duration and delay inputs can be added here */}
      </StyleSection>

      <StyleSection title="Accessibility & Anchor">
        <SelectInput
          label="Role"
          value={sectionProps.htmlTag}
          onChange={v => handleSectionPropsChange({ htmlTag: v })}
          options={['section', 'header', 'footer', 'div'].map(o => ({ value: o, label: o }))}
        />
        <TextInput
          label="ARIA Label"
          value={sectionProps.ariaLabel}
          onChange={v => handleSectionPropsChange({ ariaLabel: v })}
        />
        <TextInput
          label="Anchor ID"
          value={section.props.customId}
          onChange={v => updateComponentProps(section.id, { customId: v })}
          placeholder="e.g., about-us"
        />
      </StyleSection>
    </div>
  );
};

export default AdvancedSectionSettings;
