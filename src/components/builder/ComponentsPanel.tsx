import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, DraggableComponentType } from '../../types/builder';
import { Type, Pilcrow, MousePointerClick, Box, RectangleHorizontal, RectangleVertical, Image, Link, Smile, Minus, Video, Square } from 'lucide-react';

interface DraggableComponentProps {
  type: DraggableComponentType;
  icon: React.ReactNode;
  label: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border-color cursor-grab hover:border-primary-purple hover:bg-primary-purple/10 transition-all" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {icon}
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </div>
  );
};

const layoutComponents: { type: DraggableComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'Section', icon: <Square size={20} className="text-text-secondary" />, label: 'Section' },
  { type: 'Container', icon: <Box size={20} className="text-text-secondary" />, label: 'Container' },
  { type: 'Row', icon: <RectangleHorizontal size={20} className="text-text-secondary" />, label: 'Row' },
  { type: 'Column', icon: <RectangleVertical size={20} className="text-text-secondary" />, label: 'Column' },
];

const elementComponents: { type: DraggableComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'Heading', icon: <Type size={20} className="text-text-secondary" />, label: 'Heading' },
  { type: 'Paragraph', icon: <Pilcrow size={20} className="text-text-secondary" />, label: 'Paragraph' },
  { type: 'Button', icon: <MousePointerClick size={20} className="text-text-secondary" />, label: 'Button' },
  { type: 'Image', icon: <Image size={20} className="text-text-secondary" />, label: 'Image' },
  { type: 'Video', icon: <Video size={20} className="text-text-secondary" />, label: 'Video' },
  { type: 'Link', icon: <Link size={20} className="text-text-secondary" />, label: 'Link' },
  { type: 'Icon', icon: <Smile size={20} className="text-text-secondary" />, label: 'Icon' },
  { type: 'Divider', icon: <Minus size={20} className="text-text-secondary" />, label: 'Divider' },
];

const ComponentsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="px-1 mb-3 text-sm font-semibold text-text-primary">Layout</h3>
        <div className="space-y-3">
          {layoutComponents.map(({ type, icon, label }) => (
            <DraggableComponent key={type} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="px-1 mb-3 text-sm font-semibold text-text-primary">Elements</h3>
        <div className="space-y-3">
          {elementComponents.map(({ type, icon, label }) => (
            <DraggableComponent key={type} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsPanel;
