import React from 'react';
import { Component } from '../../types/builder';
import { Type, Pilcrow, MousePointerClick, Box, ChevronRight, ChevronDown, Image, Link, Smile, Minus, Video, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

interface LayerItemProps {
  component: Component;
  level: number;
}

const LayerItem: React.FC<LayerItemProps> = ({ component, level }) => {
  const { selectedComponentId, selectComponent, hoveredComponentId, setHoveredComponentId } = useBuilderStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = selectedComponentId === component.id;

  const getIcon = (type: Component['type']) => {
    const iconProps = { size: 16, className: 'text-text-muted group-hover:text-primary' };
    switch (type) {
      case 'Section': return <Square {...iconProps} />;
      case 'Container': return <Box {...iconProps} />;
      case 'Row': return <RectangleHorizontal {...iconProps} />;
      case 'Column': return <RectangleVertical {...iconProps} />;
      case 'Heading': return <Type {...iconProps} />;
      case 'Paragraph': return <Pilcrow {...iconProps} />;
      case 'Button': return <MousePointerClick {...iconProps} />;
      case 'Image': return <Image {...iconProps} />;
      case 'Video': return <Video {...iconProps} />;
      case 'Link': return <Link {...iconProps} />;
      case 'Icon': return <Smile {...iconProps} />;
      case 'Divider': return <Minus {...iconProps} />;
      default: return <Box {...iconProps}/>;
    }
  };

  return (
    <div>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
        onMouseEnter={() => setHoveredComponentId(component.id)}
        onMouseLeave={() => setHoveredComponentId(null)}
        className={`group flex items-center gap-2 h-10 px-2 rounded-md text-sm cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 -ml-1 text-text-muted rounded-sm hover:bg-surface-alt">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[18px]"></span>
        )}
        {getIcon(component.type)}
        <span className="flex-1 truncate">{component.type}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="flex flex-col">
          {component.children?.map(child => (
            <LayerItem key={child.id} component={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const LayersPanel: React.FC = () => {
  const { components } = useBuilderStore();
  return (
    <div className="p-2 space-y-0.5">
      {components.length > 0 ? (
        components.map((comp) => (
          <LayerItem key={comp.id} component={comp} level={0} />
        ))
      ) : (
        <div className="text-text-muted text-sm text-center mt-4 p-4">
          The layer tree is empty.
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
