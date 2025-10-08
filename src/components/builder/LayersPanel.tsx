import React from 'react';
import { Component } from '../../types/builder';
import { Type, Pilcrow, MousePointerClick, Box, ChevronRight, ChevronDown, Image, Link, Smile, Minus, Video, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

interface LayerItemProps {
  component: Component;
  level: number;
}

const LayerItem: React.FC<LayerItemProps> = ({ component, level }) => {
  const { selectedComponentId, selectComponent } = useBuilderStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = selectedComponentId === component.id;

  const getIcon = (type: Component['type']) => {
    switch (type) {
      case 'Section': return <Square size={14} />;
      case 'Container': return <Box size={14} />;
      case 'Row': return <RectangleHorizontal size={14} />;
      case 'Column': return <RectangleVertical size={14} />;
      case 'Heading': return <Type size={14} />;
      case 'Paragraph': return <Pilcrow size={14} />;
      case 'Button': return <MousePointerClick size={14} />;
      case 'Image': return <Image size={14} />;
      case 'Video': return <Video size={14} />;
      case 'Link': return <Link size={14} />;
      case 'Icon': return <Smile size={14} />;
      case 'Divider': return <Minus size={14} />;
      default: return <Box size={14}/>;
    }
  };

  return (
    <div>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
        className={`flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer transition-colors ${isSelected ? 'bg-primary-purple/20 text-text-primary' : 'text-text-secondary hover:bg-border-color/50'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 -ml-1">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[18px]"></span>
        )}
        <span className="text-primary-purple">{getIcon(component.type)}</span>
        <span>{component.type}</span>
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
    <div className="p-2 space-y-1">
      {components.length > 0 ? (
        components.map((comp) => (
          <LayerItem key={comp.id} component={comp} level={0} />
        ))
      ) : (
        <div className="text-text-secondary text-sm text-center mt-4 p-4">
          The layer tree is empty.
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
