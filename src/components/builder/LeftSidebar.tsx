import React from 'react';
import { Layers, Plus, Settings, Library } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import ComponentsPanel from './ComponentsPanel';
import LayersPanel from './LayersPanel';
import StylePanel from './StylePanel';
import { Link } from 'react-router-dom';

const LeftSidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedComponentId } = useBuilderStore();

  const TabButton: React.FC<{ tabName: 'layers' | 'components'; icon: React.ReactNode; children: React.ReactNode }> = ({ tabName, icon, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === tabName ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text'}`}
    >
      {icon}
      {children}
    </button>
  );

  const NavLink: React.FC<{ to: string, icon: React.ReactNode, children: React.ReactNode }> = ({ to, icon, children }) => (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-md text-text-muted hover:bg-surface-alt hover:text-text transition-colors text-sm font-medium">
      {icon}
      {children}
    </Link>
  );

  return (
    <aside className="w-full h-full bg-surface flex flex-col">
      {/* Top Part: Navigation & Add Panels */}
      <div className="flex-shrink-0">
        <div className="p-2 border-b border-border">
          <div className="flex items-center bg-surface-alt rounded-lg p-1">
            <TabButton tabName="layers" icon={<Layers size={18} />}>Layers</TabButton>
            <TabButton tabName="components" icon={<Plus size={18} />}>Add</TabButton>
          </div>
        </div>
        <div className="p-2">
          {activeTab === 'layers' && <LayersPanel />}
          {activeTab === 'components' && <ComponentsPanel />}
        </div>
        <div className="px-3 pb-2 border-b border-border space-y-1">
           <NavLink to="/blocks" icon={<Library size={20} />}>Blocks</NavLink>
        </div>
      </div>

      {/* Bottom Part: Properties Panel */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {selectedComponentId ? (
          <StylePanel key={selectedComponentId} />
        ) : (
          <div className="p-8 text-center text-text-muted text-sm flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Settings size={32} className="opacity-50" />
              <span>Select an element on the canvas to inspect its properties.</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
