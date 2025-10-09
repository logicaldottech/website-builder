import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Component, DraggableComponentType, ItemTypes, LayoutType, BlockType, StyleProperties, ImageFilters } from '../../types/builder';
import { useBuilderStore } from '../../store/builderStore';
import * as LucideIcons from 'lucide-react';
import FloatingToolbar from './FloatingToolbar';
import InsertionPoint from './InsertionPoint';
import { Plus } from 'lucide-react';

const getYoutubeEmbedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      const params = new URLSearchParams(urlObj.search);
      videoId = params.get('v');
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
  } catch (error) {
    return undefined;
  }
};

const constructFilterString = (filters: ImageFilters | undefined): string => {
  if (!filters) return 'none';
  return [
    filters.brightness !== undefined && `brightness(${filters.brightness}%)`,
    filters.contrast !== undefined && `contrast(${filters.contrast}%)`,
    filters.saturate !== undefined && `saturate(${filters.saturate}%)`,
    filters.blur !== undefined && `blur(${filters.blur}px)`,
  ].filter(Boolean).join(' ');
};

interface RenderedComponentProps {
  component: Component;
  index: number;
  path: number[];
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({ component, index, path }) => {
  const { id, type, props, children, parent } = component;
  const { 
    selectedComponentId, selectComponent, addComponent, device, isPreviewMode,
    editingComponentId, setEditingComponentId, updateComponentProps, openContextMenu,
    hoveredComponentId, setHoveredComponentId, setActiveSidebarTab
  } = useBuilderStore();
  
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;
  const isCurrentlyHovered = hoveredComponentId === id;
  const isEditing = editingComponentId === id;

  const [dropIndicator, setDropIndicator] = useState<'top' | 'bottom' | 'inside' | null>(null);

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
      const canDropInside = ['Section', 'Container', 'Row', 'Column', 'Link'].includes(type);
      
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
      // Drop logic is now handled in the store
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });
  
  useEffect(() => {
    if (!isOver) {
      setDropIndicator(null);
    }
  }, [isOver]);

  drop(ref);

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
    openContextMenu(id, e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    setHoveredComponentId(id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    if (ref.current) {
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !(relatedTarget instanceof Node) || !ref.current.contains(relatedTarget)) {
        setHoveredComponentId(null);
      }
    }
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
  
  const baseStyle = getResponsiveStyles();
  const hoverStyle = props.style.hover || {};
  const finalStyle = isCurrentlyHovered && !isPreviewMode ? { ...baseStyle, ...hoverStyle } : baseStyle;
  
  if (props.filters) {
    finalStyle.filter = constructFilterString(props.filters);
  }
  if (props.rotation) {
    finalStyle.transform = `rotate(${props.rotation}deg)`;
  }

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
    let combinedProps: any = { style: finalStyle, className: props.customClassName || '' };

    if (finalStyle.backgroundClip === 'text' || finalStyle.WebkitBackgroundClip === 'text') {
      combinedProps.style = {
        ...combinedProps.style,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      };
    }
    
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
    
    const renderChildren = () => (
      <>
        <InsertionPoint parentId={id} index={0} />
        {children?.map((child, i) => (
          <React.Fragment key={child.id}>
            <RenderedComponent component={child} index={i} path={[...path, i]} />
            <InsertionPoint parentId={id} index={i + 1} />
          </React.Fragment>
        ))}
      </>
    );

    const emptyPlaceholder = () => !isPreviewMode && (
      <div className={`flex items-center justify-center p-4 min-h-[80px] border-2 border-dashed rounded-md transition-colors ${dropIndicator === 'inside' ? 'border-primary bg-primary/10' : 'border-border'}`}>
        <button onClick={() => setActiveSidebarTab('add')} className="flex items-center gap-2 text-text-muted hover:text-primary">
          <Plus size={16} />
          Add Element
        </button>
      </div>
    );

    const renderIcon = (iconName: string | undefined) => {
      if (!iconName) return null;
      const IconComponent = (LucideIcons as any)[iconName];
      return IconComponent ? <IconComponent /> : null;
    };

    switch (type) {
      case 'Heading': {
        const Tag = (props.htmlTag && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].includes(props.htmlTag)) ? props.htmlTag : 'h1';
        return <Tag {...combinedProps}>{props.text}</Tag>;
      }
      case 'Paragraph': {
        const Tag = (props.htmlTag && ['p', 'div'].includes(props.htmlTag)) ? props.htmlTag : 'p';
        return <Tag {...combinedProps}>{props.text}</Tag>;
      }
      case 'Button': {
        const icon = renderIcon(props.icon);
        const content = (
          <>
            {props.iconPosition === 'before' && icon}
            <span>{props.text}</span>
            {props.iconPosition === 'after' && icon}
          </>
        );
        if (props.href) {
          return <a href={props.href} target={props.linkTarget} {...combinedProps}>{content}</a>;
        }
        return <button {...combinedProps}>{content}</button>;
      }
      case 'Image': return <img src={props.src || undefined} alt={props.altText || 'Image'} {...combinedProps} />;
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
        ) : <div {...combinedProps} className="flex items-center justify-center bg-surface-alt text-text-muted">Invalid YouTube URL</div>;
      }
      case 'Divider': {
        const { borderStyle, borderWidth, borderColor, ...restStyle } = finalStyle;
        const dividerStyle = {
            ...restStyle,
            borderBottomStyle: borderStyle || 'solid',
            borderBottomWidth: borderWidth || '1px',
            borderBottomColor: borderColor || 'var(--border)',
        };
        return <div style={dividerStyle} />;
      }
      case 'Icon': {
        const IconComponent = (LucideIcons as any)[props.icon || 'Smile'];
        return IconComponent ? <IconComponent {...combinedProps} /> : null;
      }
      case 'Link': return (
        <a href={props.href} target={props.linkTarget} {...combinedProps} onDoubleClick={handleDoubleClick}>
          {isEditing ? props.text : (children?.length ? renderChildren() : props.text)}
        </a>
      );
      case 'Section': {
        const sectionProps = props.sectionProps || {};
        const { paddingY, background, fullBleed } = sectionProps;

        const sectionStyle: React.CSSProperties = {
            position: 'relative',
            width: '100%',
            paddingTop: paddingY?.[device] || paddingY?.lg,
            paddingBottom: paddingY?.[device] || paddingY?.lg,
            ...finalStyle,
        };
        
        const bgStyle: React.CSSProperties = {
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
        };

        if (fullBleed) {
          bgStyle.width = '100vw';
          bgStyle.left = '50%';
          bgStyle.transform = 'translateX(-50%)';
        }

        if (background?.type === 'color') bgStyle.backgroundColor = background.color;
        if (background?.type === 'gradient') bgStyle.backgroundImage = background.gradient;
        if (background?.type === 'image' && background.image?.src) {
            bgStyle.backgroundImage = `url(${background.image.src})`;
            bgStyle.backgroundPosition = background.image.position || 'center';
            bgStyle.backgroundRepeat = background.image.repeat || 'no-repeat';
            bgStyle.backgroundSize = background.image.size || 'cover';
        }

        const overlayStyle: React.CSSProperties = {
            ...bgStyle,
            backgroundColor: background?.overlay?.color || 'transparent',
            opacity: background?.overlay?.opacity || 0,
            backgroundImage: 'none',
            zIndex: -1,
        };

        const Tag = sectionProps.htmlTag || 'section';

        return (
            <Tag style={sectionStyle} aria-label={sectionProps.ariaLabel}>
                <div style={bgStyle} />
                <div style={overlayStyle} />
                {children && children.length > 0 ? renderChildren() : emptyPlaceholder()}
            </Tag>
        );
      }
      case 'Container': {
        const containerProps = props.containerProps || {};
        const { maxWidth, align, paddingX, rowGap, columnGap, isSticky, stickyOffset } = containerProps;

        const containerWidths: Record<string, string> = { sm: '720px', md: '960px', lg: '1200px', xl: '1320px' };

        const containerStyle: React.CSSProperties = {
            width: '100%',
            maxWidth: maxWidth ? containerWidths[maxWidth] : '1200px',
            paddingLeft: paddingX?.[device] || paddingX?.lg,
            paddingRight: paddingX?.[device] || paddingX?.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: rowGap, // This will apply to rows
            ...finalStyle,
        };

        if (align === 'center') {
            containerStyle.marginLeft = 'auto';
            containerStyle.marginRight = 'auto';
        }

        if (isSticky) {
            containerStyle.position = 'sticky';
            containerStyle.top = stickyOffset || '0px';
        }
        
        return (
          <div style={containerStyle}>
            {children && children.length > 0 ? renderChildren() : emptyPlaceholder()}
          </div>
        );
      }
      case 'Row': {
        const parentContainer = (parent && useBuilderStore.getState().components.find(c => c.id === parent)?.children?.find(c => c.id === id)?.parent) 
          ? findComponentPath(parent, useBuilderStore.getState().components)?.component
          : null;
        const columnGap = parentContainer?.props.containerProps?.columnGap || '16px';
        
        const rowStyle: React.CSSProperties = {
          ...finalStyle,
          gap: columnGap,
        };

        return (
          <div style={rowStyle}>
            {children && children.length > 0 ? renderChildren() : emptyPlaceholder()}
          </div>
        );
      }
      case 'Column':
        return (
          <div {...combinedProps}>
            {children && children.length > 0 ? renderChildren() : emptyPlaceholder()}
          </div>
        );
      default: return null;
    }
  };

  let outlineStyle = '';
  if (!isPreviewMode) {
    if (isSelected) {
      outlineStyle = `outline outline-2 outline-offset-2 outline-primary`;
    } else if (isCurrentlyHovered) {
      outlineStyle = `outline outline-1 outline-primary/50`;
    }
  }
  
  const dropIndicatorStyle = dropIndicator === 'inside' && ['Section', 'Container', 'Row', 'Column', 'Link'].includes(type)
    ? 'outline outline-2 outline-primary outline-dashed'
    : dropIndicator === 'top' ? 'border-t-2 border-primary'
    : dropIndicator === 'bottom' ? 'border-b-2 border-primary'
    : '';

  const isLayoutElement = ['Section', 'Container', 'Row', 'Column'].includes(type);
  const MotionTag = (motion as any)[isLayoutElement ? (props.htmlTag || 'div') : 'div'];

  return (
    <MotionTag
      ref={ref}
      id={props.customId}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all ${!isEditing && !isPreviewMode ? 'cursor-pointer' : ''} ${outlineStyle} ${isDragging ? 'opacity-50' : 'opacity-100'} ${dropIndicatorStyle}`}
      {...animationProps}
    >
      {isSelected && !isPreviewMode && (
        <FloatingToolbar componentId={id} dragHandleRef={drag} />
      )}
      {isCurrentlyHovered && !isSelected && !isPreviewMode && (
        <div className={`absolute -top-5 left-0 text-xs text-white px-1.5 py-0.5 rounded-sm z-20 bg-primary`}>
          {type}
        </div>
      )}
      {renderContent()}
    </MotionTag>
  );
};

export default RenderedComponent;
