import React from 'react';
import { Layers, Puzzle, Settings } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import ComponentsPanel from './ComponentsPanel';
import LayersPanel from './LayersPanel';
import StylePanel from './StylePanel';
import LayoutsPanel from './LayoutsPanel';

const LeftSidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useBuilderStore();

  const TabButton: React.FC<{ tabName: typeof activeTab; icon: React.ReactNode; children: React.ReactNode }> = ({ tabName, icon, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === tabName ? 'border-primary-purple text-text-primary' : 'border-transparent text-text-secondary hover:bg-border-color/50'}`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <aside className="w-full h-full bg-secondary-gray border-r border-border-color flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex items-center border-b border-border-color">
          <TabButton tabName="layers" icon={<Layers size={18} />}>Layers</TabButton>
          <TabButton tabName="components" icon={<Puzzle size={18} />}>Add</TabButton>
          <TabButton tabName="styles" icon={<Settings size={18} />}>Inspect</TabButton>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'layers' && <LayersPanel />}
        {activeTab === 'components' && (
          <>
            <ComponentsPanel />
            <LayoutsPanel />
          </>
        )}
        {activeTab === 'styles' && <StylePanel />}
      </div>
    </aside>
  );
};

export default LeftSidebar;
