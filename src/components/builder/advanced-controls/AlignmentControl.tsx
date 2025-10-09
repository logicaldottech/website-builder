import React from 'react';

interface AlignmentControlProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { value: string; icon: React.ReactNode; title: string }[];
}

const AlignmentControl: React.FC<AlignmentControlProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="text-xs font-semibold text-text-muted mb-1.5 block">{label}</label>
      <div className="flex items-center bg-surface-alt border border-border rounded-md p-0.5">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            title={option.title}
            className={`flex-1 flex items-center justify-center p-2 rounded-sm transition-colors ${value === option.value ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-border'}`}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlignmentControl;
