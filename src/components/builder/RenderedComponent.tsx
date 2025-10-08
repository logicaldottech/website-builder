import React, { useRef } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { useContextMenu } from 'react-contexify';
import { motion } from 'framer-motion';
import { Component, DraggableComponentType, ItemTypes, LayoutType, StyleProperties } from '../../types/builder';
import { useBuilderStore } from '../../store/builderStore';
import * as LucideIcons from 'lucide-react';

const CONTEXT_MENU_ID = 'component-context-menu';

interface RenderedComponentProps {
  component: Component;
  index: number;
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({ component, index }) => {
  const { id, type, props, children, parent } = component;
  const { 
    selectedComponentId, 
    selectComponent, 
    addComponent, 
    addLayout, 
    moveComponent, 
    device 
  } = useBuilderStore();
  
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;

  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANVAS_COMPONENT,
    item: { id, index, parent },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.COMPONENT, ItemTypes.LAYOUT, ItemTypes.CANVAS_COMPONENT],
    hover(item: { type: DraggableComponentType | LayoutType | string; id?: string; index?: number }, monitor) {
      if (!ref.current) return;
      
      // Handle reordering
      if (item.id && item.id !== id) {
        const dragId = item.id;
        const hoverId = id;
        moveComponent(dragId, hoverId);
        // Note: This is a simplified move. A more robust implementation
        // would check hover position (top/bottom half) to be more precise.
      }
    },
    drop: (item: { type: DraggableComponentType | LayoutType }, monitor) => {
      if (monitor.didDrop()) return;
      if (type === 'Container' || type === 'Link') {
        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.COMPONENT) {
          addComponent(item.type as DraggableComponentType, id);
        } else if (itemType === ItemTypes.LAYOUT) {
          addLayout(item.type as LayoutType, id);
        }
      }
    },
  });

  drag(drop(ref));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    show({ event: e, props: { id } });
  };
  
  // Merge styles for responsive preview
  const getResponsiveStyles = (): StyleProperties => {
    const desktop = props.style.desktop || {};
    const tablet = props.style.tablet || {};
    const mobile = props.style.mobile || {};

    switch (device) {
      case 'mobile': return { ...desktop, ...tablet, ...mobile };
      case 'tablet': return { ...desktop, ...tablet };
      default: return desktop;
    }
  };
  
  const finalStyle = getResponsiveStyles();
  
  // Check visibility for current device
  const isVisible = props.visibility ? props.visibility[device] ?? true : true;
  if (!isVisible) return null;

  const animationProps = props.animation?.type === 'fadeIn' ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  } : {};

  const renderContent = () => {
    const combinedProps = { style: finalStyle, className: props.customClassName || '' };
    switch (type) {
      case 'Heading': return <h1 {...combinedProps}>{props.text}</h1>;
      case 'Paragraph': return <p {...combinedProps}>{props.text}</p>;
      case 'Button': return <button {...combinedProps}>{props.text}</button>;
      case 'Image': return <img src={props.src} alt={props.text || 'Image'} {...combinedProps} />;
      case 'Spacer': return <div {...combinedProps} />;
      case 'Icon': {
        // @ts-ignore
        const IconComponent = LucideIcons[props.icon || 'Smile'];
        return IconComponent ? <IconComponent {...combinedProps} /> : null;
      }
      case 'Link': return (
        <a href={props.href} {...combinedProps}>
          {children?.map((child, i) => <RenderedComponent key={child.id} component={child} index={i} />)}
        </a>
      );
      case 'Container': return (
        <div {...combinedProps}>
          {children && children.length > 0 ? (
            children.map((child, i) => <RenderedComponent key={child.id} component={child} index={i} />)
          ) : (
            <div className="text-center text-gray-400 text-sm pointer-events-none p-4 border-2 border-dashed border-gray-300 rounded-md">
              Drop components here
            </div>
          )}
        </div>
      );
      default: return null;
    }
  };

  const selectionStyle = isSelected ? 'outline outline-2 outline-offset-2 outline-primary-purple' : 'hover:outline hover:outline-1 hover:outline-primary-purple/50';
  
  return (
    <motion.div
      ref={ref}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`relative cursor-pointer transition-all ${selectionStyle} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      {...animationProps}
    >
      {isSelected && <div className="absolute -top-5 left-0 text-xs bg-primary-purple text-white px-1.5 py-0.5 rounded z-20">{type}</div>}
      {renderContent()}
    </motion.div>
  );
};

export default RenderedComponent;
