import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useContextMenu } from 'react-contexify';
import { motion } from 'framer-motion';
import { Component, DraggableComponentType, ItemTypes, LayoutType, StyleProperties, BlockType } from '../../types/builder';
import { useBuilderStore } from '../../store/builderStore';
import * as LucideIcons from 'lucide-react';

const CONTEXT_MENU_ID = 'component-context-menu';

interface RenderedComponentProps {
  component: Component;
  index: number;
  path: number[];
}

const getYoutubeEmbedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
  } catch (error) {
    return undefined;
  }
};

const RenderedComponent: React.FC<RenderedComponentProps> = ({ component, index, path }) => {
  const { id, type, props, children, parent } = component;
  const { 
    selectedComponentId, selectComponent, addComponent, addLayout, addBlock, moveComponent, device, isPreviewMode,
    editingComponentId, setEditingComponentId, updateComponentProps
  } = useBuilderStore();
  
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;
  const isEditing = editingComponentId === id;

  const [dropIndicator, setDropIndicator] = useState<'top' | 'bottom' | 'inside' | null>(null);

  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANVAS_COMPONENT,
    item: { id, index, parent, path },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    canDrag: !isPreviewMode && !isEditing,
  });

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.COMPONENT, ItemTypes.LAYOUT, ItemTypes.BLOCK, ItemTypes.CANVAS_COMPONENT],
    hover(item: any, monitor) {
      if (!ref.current || isPreviewMode) return;
      const dragId = item.id;
      if (dragId === id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverMiddleY = hoverBoundingRect.height / 2;
      
      let newIndicator: 'top' | 'bottom' | 'inside' | null = null;
      const canDropInside = (type === 'Container' || type === 'Link');
      
      if (canDropInside && monitor.isOver({ shallow: true })) {
        newIndicator = 'inside';
      } else if (hoverClientY < hoverMiddleY) {
        newIndicator = 'top';
      } else {
        newIndicator = 'bottom';
      }

      if (newIndicator !== dropIndicator) {
        setDropIndicator(newIndicator);
      }
    },
    drop(item: any, monitor) {
      if (!monitor.didDrop()) {
        const dropPosition = dropIndicator;
        setDropIndicator(null);
        if (!dropPosition) return;

        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.CANVAS_COMPONENT) {
          moveComponent(item.id, id, dropPosition);
        } else {
          const newType = item.type;
          if (dropPosition === 'inside') {
            if (itemType === ItemTypes.COMPONENT) addComponent(newType as DraggableComponentType, id);
            else if (itemType === ItemTypes.LAYOUT) addLayout(newType as LayoutType, id);
            else if (itemType === ItemTypes.BLOCK) addBlock(newType as BlockType, id);
          } else {
            const targetParentId = parent;
            const targetIndex = dropPosition === 'top' ? index : index + 1;
            if (itemType === ItemTypes.COMPONENT) addComponent(newType as DraggableComponentType, targetParentId, targetIndex);
            else if (itemType === ItemTypes.LAYOUT) addLayout(newType as LayoutType, targetParentId, targetIndex);
            else if (itemType === ItemTypes.BLOCK) addBlock(newType as BlockType, targetParentId, targetIndex);
          }
        }
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });
  
  useEffect(() => {
    if (!isOver) {
      setDropIndicator(null);
    }
  }, [isOver]);

  drag(drop(ref));

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectComponent(id);
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    if (type === 'Heading' || type === 'Paragraph' || type === 'Button' || type === 'Link') {
      e.stopPropagation();
      setEditingComponentId(id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();
    show({ event: e, props: { id } });
  };
  
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
  const isVisible = props.visibility ? props.visibility[device] ?? true : true;
  if (!isVisible) return null;

  const animationProps = props.animation?.type === 'fadeIn' ? {
    initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 }
  } : {};

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateComponentProps(id, { text: e.target.value });
  };

  const handleTextBlur = () => {
    setEditingComponentId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingComponentId(null);
    }
    if (e.key === 'Escape') {
      setEditingComponentId(null);
    }
  };

  const renderContent = () => {
    const combinedProps = { style: finalStyle, className: props.customClassName || '' };
    
    if (isEditing && props.text !== undefined) {
      return (
        <textarea
          value={props.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-full bg-transparent border-none outline-none resize-none"
          style={{ ...finalStyle, padding: 0, margin: 0, minHeight: '1.2em' }}
        />
      );
    }

    switch (type) {
      case 'Heading': return <h1 {...combinedProps}>{props.text}</h1>;
      case 'Paragraph': return <p {...combinedProps}>{props.text}</p>;
      case 'Button': return <button {...combinedProps}>{props.text}</button>;
      case 'Image': return <img src={props.src} alt={props.text || 'Image'} {...combinedProps} />;
      case 'Video': {
        const embedUrl = getYoutubeEmbedUrl(props.src);
        return embedUrl ? (
          <iframe
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
            {...combinedProps}
          />
        ) : <div {...combinedProps} className="flex items-center justify-center bg-gray-200 text-gray-500">Invalid YouTube URL</div>;
      }
      case 'Divider': return <div {...combinedProps} />;
      case 'Icon': {
        const IconComponent = (LucideIcons as any)[props.icon || 'Smile'];
        return IconComponent ? <IconComponent {...combinedProps} /> : null;
      }
      case 'Link': return (
        <a href={props.href} {...combinedProps} onDoubleClick={handleDoubleClick}>
          {isEditing ? props.text : (children?.length ? children.map((child, i) => <RenderedComponent key={child.id} component={child} index={i} path={[...path, i]} />) : props.text)}
        </a>
      );
      case 'Container': return (
        <div {...combinedProps}>
          {children && children.length > 0 ? (
            children.map((child, i) => <RenderedComponent key={child.id} component={child} index={i} path={[...path, i]} />)
          ) : (
            !isPreviewMode && <div className={`text-center text-gray-400 text-sm pointer-events-none p-4 border-2 border-dashed rounded-md ${dropIndicator === 'inside' ? 'border-primary-purple bg-primary-purple/10' : 'border-gray-300'}`}>Drop components here</div>
          )}
        </div>
      );
      default: return null;
    }
  };

  let selectionStyle = '';
  if (!isPreviewMode) {
    selectionStyle = isSelected ? 'outline outline-2 outline-offset-2 outline-primary-purple' : 'hover:outline hover:outline-1 hover:outline-primary-purple/50';
  }
  
  const dropIndicatorStyle = dropIndicator === 'inside' && (type === 'Container' || type === 'Link')
    ? 'outline outline-2 outline-primary-purple outline-dashed'
    : dropIndicator === 'top' ? 'border-t-2 border-primary-purple'
    : dropIndicator === 'bottom' ? 'border-b-2 border-primary-purple'
    : '';

  return (
    <motion.div
      ref={ref}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      className={`relative transition-all ${!isEditing ? 'cursor-pointer' : ''} ${selectionStyle} ${isDragging ? 'opacity-50' : 'opacity-100'} ${dropIndicatorStyle}`}
      {...animationProps}
    >
      {isSelected && !isPreviewMode && <div className="absolute -top-5 left-0 text-xs bg-primary-purple text-white px-1.5 py-0.5 rounded z-20">{type}</div>}
      {renderContent()}
    </motion.div>
  );
};

export default RenderedComponent;
