import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, DraggableComponentType } from '../../types/builder';
import { Type, Pilcrow, MousePointerClick, Box, RectangleHorizontal, RectangleVertical, Image, Link, Smile, Minus } from 'lucide-react';

interface DraggableComponentProps {
  type: DraggableComponentType;
  icon: React.ReactNode;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border-color cursor-grab hover:border-primary-purple hover:bg-primary-purple/10 transition-all" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {icon}
      <span className="text-sm font-medium text-text-primary">{type}</span>
    </div>
  );
};

const componentList: { type: DraggableComponentType; icon: React.ReactNode }[] = [
  { type: 'Container', icon: <Box size={20} className="text-text-secondary" /> },
  { type: 'Row', icon: <RectangleHorizontal size={20} className="text-text-secondary" /> },
  { type: 'Column', icon: <RectangleVertical size={20} className="text-text-secondary" /> },
  { type: 'Heading', icon: <Type size={20} className="text-text-secondary" /> },
  { type: 'Paragraph', icon: <Pilcrow size={20} className="text-text-secondary" /> },
  { type: 'Button', icon: <MousePointerClick size={20} className="text-text-secondary" /> },
  { type: 'Image', icon: <Image size={20} className="text-text-secondary" /> },
  { type: 'Link', icon: <Link size={20} className="text-text-secondary" /> },
  { type: 'Icon', icon: <Smile size={20} className="text-text-secondary" /> },
  { type: 'Spacer', icon: <Minus size={20} className="text-text-secondary" /> },
];

const ComponentsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-3">
       <h3 className="px-1 text-sm font-semibold text-text-primary">Elements</h3>
      {componentList.map(({ type, icon }) => (
        <DraggableComponent key={type} type={type} icon={icon} />
      ))}
    </div>
  );
};

export default ComponentsPanel;
