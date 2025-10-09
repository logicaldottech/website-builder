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
    <div ref={drag} className="flex flex-col items-center justify-center text-center gap-2 p-3 bg-surface rounded-md border border-border cursor-grab hover:border-primary hover:bg-primary/10 transition-all aspect-square" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium text-text">{label}</span>
    </div>
  );
};

const layoutComponents: { type: DraggableComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'Section', icon: <Square size={22} />, label: 'Section' },
  { type: 'Container', icon: <Box size={22} />, label: 'Container' },
  { type: 'Row', icon: <RectangleHorizontal size={22} />, label: 'Row' },
  { type: 'Column', icon: <RectangleVertical size={22} />, label: 'Column' },
];

const elementComponents: { type: DraggableComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'Heading', icon: <Type size={22} />, label: 'Heading' },
  { type: 'Paragraph', icon: <Pilcrow size={22} />, label: 'Paragraph' },
  { type: 'Button', icon: <MousePointerClick size={22} />, label: 'Button' },
  { type: 'Image', icon: <Image size={22} />, label: 'Image' },
  { type: 'Video', icon: <Video size={22} />, label: 'Video' },
  { type: 'Link', icon: <Link size={22} />, label: 'Link' },
  { type: 'Icon', icon: <Smile size={22} />, label: 'Icon' },
  { type: 'Divider', icon: <Minus size={22} />, label: 'Divider' },
];

const ComponentsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="px-1 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Layout</h3>
        <div className="grid grid-cols-2 gap-2">
          {layoutComponents.map(({ type, icon, label }) => (
            <DraggableComponent key={type} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="px-1 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          {elementComponents.map(({ type, icon, label }) => (
            <DraggableComponent key={type} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsPanel;
