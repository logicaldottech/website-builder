import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { Component } from '../../../types/builder';

interface SectionPresetsProps {
  section: Component;
  container: Component;
}

type Preset = 'blank' | 'alt-band' | 'emphasis' | 'hero' | 'narrow';

const SectionPresets: React.FC<SectionPresetsProps> = ({ section, container }) => {
  const { updateComponentProps } = useBuilderStore();

  const applyPreset = (preset: Preset) => {
    switch (preset) {
      case 'blank':
        updateComponentProps(section.id, {
          sectionProps: {
            background: { type: 'none' },
            paddingY: { lg: '64px', md: '40px', sm: '24px' },
            fullBleed: false,
          },
        });
        updateComponentProps(container.id, {
          containerProps: { maxWidth: 'lg', align: 'center' },
        });
        break;
      case 'alt-band':
        updateComponentProps(section.id, {
          sectionProps: {
            background: { type: 'color', color: 'var(--surface-alt)' },
            paddingY: { lg: '64px', md: '44px', sm: '28px' },
          },
        });
        break;
      case 'emphasis':
        updateComponentProps(section.id, {
          sectionProps: {
            background: { type: 'gradient', gradient: 'linear-gradient(135deg, var(--primary), var(--accent))' },
            paddingY: { lg: '72px', md: '48px', sm: '32px' },
            fullBleed: true,
          },
        });
        break;
      // Add other presets here
    }
  };

  const PresetButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="px-3 py-1.5 text-xs bg-surface-alt border border-border rounded-md hover:bg-border transition-colors">
      {children}
    </button>
  );

  return (
    <div className="p-4 border-b border-border">
      <h4 className="text-xs font-semibold text-text-muted mb-2">Presets</h4>
      <div className="flex flex-wrap gap-2">
        <PresetButton onClick={() => applyPreset('blank')}>Blank</PresetButton>
        <PresetButton onClick={() => applyPreset('alt-band')}>Alt Band</PresetButton>
        <PresetButton onClick={() => applyPreset('emphasis')}>Emphasis</PresetButton>
      </div>
    </div>
  );
};

export default SectionPresets;
