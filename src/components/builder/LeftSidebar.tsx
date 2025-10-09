import React from 'react';
import { Layers, Plus, Settings } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import ComponentsPanel from './ComponentsPanel';
import LayersPanel from './LayersPanel';
import StylePanel from './StylePanel';
import AILayoutPanel from './AILayoutPanel';

const LeftSidebar: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab, selectedComponentId } = useBuilderStore();

  const TabButton: React.FC<{ tabName: 'layers' | 'add' | 'properties'; icon: React.ReactNode; children: React.ReactNode }> = ({ tabName, icon, children }) => (
    <button
      onClick={() => setActiveSidebarTab(tabName)}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors rounded-md ${activeSidebarTab === tabName ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text'}`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <aside className="w-full h-full bg-surface flex flex-col">
      {/* Top Part: Tab Buttons */}
      <div className="flex-shrink-0 p-2 border-b border-border">
        <div className="flex items-center bg-surface-alt rounded-lg p-1 gap-1">
          <TabButton tabName="layers" icon={<Layers size={18} />}>Layers</TabButton>
          <TabButton tabName="add" icon={<Plus size={18} />}>Add</TabButton>
          <TabButton tabName="properties" icon={<Settings size={18} />}>Properties</TabButton>
        </div>
      </div>

      {/* Bottom Part: Scrollable Content Panel */}
      <div className="flex-grow flex flex-col min-h-0 overflow-y-auto">
        {activeSidebarTab === 'layers' && <LayersPanel />}
        {activeSidebarTab === 'add' && (
          <div>
            <AILayoutPanel />
            <ComponentsPanel />
          </div>
        )}
        {activeSidebarTab === 'properties' && (
          selectedComponentId ? (
            <StylePanel key={selectedComponentId} />
          ) : (
            <div className="p-8 text-center text-text-muted text-sm flex-grow flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Settings size={32} className="opacity-50" />
                <span>Select an element to see its properties.</span>
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
