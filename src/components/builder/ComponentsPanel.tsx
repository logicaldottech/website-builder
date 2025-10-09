import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, DraggableComponentType, WidgetType } from '../../types/builder';
import { Type, Pilcrow, MousePointerClick, Box, RectangleHorizontal, RectangleVertical, Image, Link, Smile, Minus, Video, Square, Star, CreditCard, MessageSquare, BarChart3, ListOrdered, ChevronsUpDown, PanelTop, AlertTriangle, Badge as BadgeIcon } from 'lucide-react';

interface DraggableItemProps {
  itemType: typeof ItemTypes.COMPONENT | typeof ItemTypes.WIDGET;
  type: DraggableComponentType | WidgetType;
  icon: React.ReactNode;
  label: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ itemType, type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemType,
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

const basicElementComponents: { type: DraggableComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'Heading', icon: <Type size={22} />, label: 'Heading' },
  { type: 'Paragraph', icon: <Pilcrow size={22} />, label: 'Paragraph' },
  { type: 'Button', icon: <MousePointerClick size={22} />, label: 'Button' },
  { type: 'Image', icon: <Image size={22} />, label: 'Image' },
];

const advancedElementComponents: { type: WidgetType; icon: React.ReactNode; label: string }[] = [
  { type: 'FeatureCard', icon: <Star size={22} />, label: 'Feature Card' },
  { type: 'Testimonial', icon: <MessageSquare size={22} />, label: 'Testimonial' },
  { type: 'PricingCard', icon: <CreditCard size={22} />, label: 'Pricing Card' },
  { type: 'StatsCounter', icon: <BarChart3 size={22} />, label: 'Stats' },
  { type: 'Steps', icon: <ListOrdered size={22} />, label: 'Steps' },
  { type: 'Accordion', icon: <ChevronsUpDown size={22} />, label: 'Accordion' },
  { type: 'Tabs', icon: <PanelTop size={22} />, label: 'Tabs' },
  { type: 'Alert', icon: <AlertTriangle size={22} />, label: 'Alert' },
  { type: 'Badge', icon: <BadgeIcon size={22} />, label: 'Badge' },
  { type: 'Divider', icon: <Minus size={22} />, label: 'Divider' },
];

const ComponentsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="px-1 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Layout</h3>
        <div className="grid grid-cols-2 gap-2">
          {layoutComponents.map(({ type, icon, label }) => (
            <DraggableItem key={type} itemType={ItemTypes.COMPONENT} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="px-1 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Basic Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          {basicElementComponents.map(({ type, icon, label }) => (
            <DraggableItem key={type} itemType={ItemTypes.COMPONENT} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
       <div>
        <h3 className="px-1 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Advanced Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          {advancedElementComponents.map(({ type, icon, label }) => (
            <DraggableItem key={type} itemType={ItemTypes.WIDGET} type={type} icon={icon} label={label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsPanel;
