import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, BlockType } from '../../types/builder';
import { CreditCard } from 'lucide-react';

interface DraggableBlockProps {
  type: BlockType;
  icon: React.ReactNode;
  label: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BLOCK,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border-color cursor-grab hover:border-primary-slate hover:bg-primary-slate/10 transition-all"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {icon}
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </div>
  );
};

const blockList: { type: BlockType; icon: React.ReactNode; label: string }[] = [
  { type: 'Card', icon: <CreditCard size={20} className="text-text-secondary" />, label: 'Card' },
];

const BlocksPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-3 border-t border-border-color">
      <h3 className="px-1 text-sm font-semibold text-text-primary">Blocks</h3>
      {blockList.map(({ type, icon, label }) => (
        <DraggableBlock key={type} type={type} icon={icon} label={label} />
      ))}
    </div>
  );
};

export default BlocksPanel;
