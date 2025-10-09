import React, { useState, useRef } from 'react';
import { Plus, Square, Library } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { useBuilderStore } from '../../store/builderStore';
import { ItemTypes, DraggableComponentType, LayoutType, BlockType, WidgetType } from '../../types/builder';
import { useClickAway } from 'react-use';

interface AddSectionMenuProps {
  onAddBlank: () => void;
  onBrowseLibrary: () => void;
}

const AddSectionMenu: React.FC<AddSectionMenuProps> = ({ onAddBlank, onBrowseLibrary }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-20 mt-2 w-56 bg-secondary border border-border rounded-lg shadow-2xl p-2">
      <button
        onClick={onAddBlank}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors text-text-primary hover:bg-primary hover:text-white"
      >
        <Square size={16} />
        <span>Add Blank Section</span>
      </button>
      <button
        onClick={onBrowseLibrary}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors text-text-primary hover:bg-primary hover:text-white"
      >
        <Library size={16} />
        <span>Browse Library</span>
      </button>
    </div>
  );
};

interface InsertionPointProps {
  parentId: string | null;
  index: number;
}

const InsertionPoint: React.FC<InsertionPointProps> = ({ parentId, index }) => {
  const { addComponent, insertWidget, setActiveSidebarTab, isPreviewMode } = useBuilderStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickAway(menuRef, () => {
    setIsMenuOpen(false);
  });

  const [{ isOver, canDrop, isDragging }, drop] = useDrop(() => ({
    accept: [ItemTypes.COMPONENT, ItemTypes.LAYOUT, ItemTypes.BLOCK, ItemTypes.WIDGET, ItemTypes.CANVAS_COMPONENT],
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.CANVAS_COMPONENT) return;
        if (itemType === ItemTypes.COMPONENT) addComponent(item.type as DraggableComponentType, parentId, index);
        if (itemType === ItemTypes.WIDGET) insertWidget(item.type as WidgetType, parentId, index);
        // Note: Layout and Block types are currently not used from the sidebar but the drop target is ready.
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      isDragging: monitor.getItem() !== null,
    }),
  }), [parentId, index, addComponent, insertWidget]);

  if (isPreviewMode) return null;

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSidebarTab('add');
  };

  const showIndicator = !isDragging && (isHovered || (isOver && canDrop));

  return (
    <div
      ref={drop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-0"
      style={{ minHeight: showIndicator ? '20px' : '0px', transition: 'min-height 0.2s' }}
    >
      {showIndicator && (
        <div ref={menuRef} className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="h-0.5 w-full bg-primary" />
          <button
            onClick={handlePlusClick}
            className="absolute z-10 p-1 bg-primary text-white rounded-full transition-transform hover:scale-110 pointer-events-auto"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InsertionPoint;
