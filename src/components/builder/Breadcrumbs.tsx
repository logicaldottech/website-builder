import React from 'react';
import { useBuilderStore, getComponentAncestry } from '../../store/builderStore';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const { selectedComponentId, components, selectComponent } = useBuilderStore();

  if (!selectedComponentId) {
    return (
      <div className="h-10 bg-secondary-gray border-t border-border-color flex items-center px-4 flex-shrink-0">
        <span className="text-sm text-text-secondary">No element selected.</span>
      </div>
    );
  }

  const ancestry = getComponentAncestry(selectedComponentId, components);

  return (
    <div className="h-10 bg-secondary-gray border-t border-border-color flex items-center px-4 overflow-x-auto flex-shrink-0">
      <nav className="flex items-center gap-1.5 text-sm">
        <button className="text-text-secondary hover:text-text-primary" onClick={() => selectComponent(null)}>
          Body
        </button>
        {ancestry.map((component) => (
          <React.Fragment key={component.id}>
            <ChevronRight size={14} className="text-text-secondary" />
            <button
              onClick={() => selectComponent(component.id)}
              className={`whitespace-nowrap transition-colors ${component.id === selectedComponentId ? 'text-primary-purple font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {component.type}
            </button>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
