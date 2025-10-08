import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, LayoutType } from '../../types/builder';
import { Columns } from 'lucide-react';

interface DraggableLayoutProps {
  type: LayoutType;
  icon: React.ReactNode;
  label: string;
}

const DraggableLayout: React.FC<DraggableLayoutProps> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LAYOUT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border-color cursor-grab hover:border-primary-purple hover:bg-primary-purple/10 transition-all"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {icon}
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </div>
  );
};

const layoutList: { type: LayoutType; icon: React.ReactNode; label: string }[] = [
  { type: 'TwoColumn', icon: <Columns size={20} className="text-text-secondary" />, label: 'Two Columns' },
];

const LayoutsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-3 border-t border-border-color">
      <h3 className="px-1 text-sm font-semibold text-text-primary">Layouts</h3>
      {layoutList.map(({ type, icon, label }) => (
        <DraggableLayout key={type} type={type} icon={icon} label={label} />
      ))}
    </div>
  );
};

export default LayoutsPanel;
