import React from 'react';
import { useBuilderStore, getComponentAncestry } from '../../store/builderStore';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const { selectedComponentId, components, selectComponent } = useBuilderStore();

  if (!selectedComponentId) {
    return (
      <div className="h-10 flex items-center px-4 flex-shrink-0">
        <span className="text-sm text-text-muted">No element selected</span>
      </div>
    );
  }

  const ancestry = getComponentAncestry(selectedComponentId, components);

  return (
    <div className="h-10 flex items-center px-4 overflow-x-auto flex-shrink-0">
      <nav className="flex items-center gap-1.5 text-sm">
        <button className="text-text-muted hover:text-text" onClick={() => selectComponent(null)}>
          Body
        </button>
        {ancestry.map((component) => (
          <React.Fragment key={component.id}>
            <ChevronRight size={14} className="text-text-muted" />
            <button
              onClick={() => selectComponent(component.id)}
              className={`whitespace-nowrap transition-colors ${component.id === selectedComponentId ? 'text-primary font-semibold' : 'text-text-muted hover:text-text'}`}
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
