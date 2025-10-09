import React from 'react';

interface SegmentedControlProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full bg-surface-alt p-1 rounded-md flex items-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 text-center text-sm font-semibold py-1.5 rounded-sm transition-colors duration-200
            ${activeTab === tab ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
