import React from 'react';
import { ChevronDown } from 'lucide-react';

interface StyleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const StyleSection: React.FC<StyleSectionProps> = ({ title, children, defaultOpen = true }) => (
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

export default StyleSection;
