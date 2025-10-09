import React, { useEffect, useRef, useState } from 'react';
import { useBuilderStore, findComponentPath } from '../../store/builderStore';
import { Trash2, Copy, ClipboardPaste, Paintbrush, Plus, ArrowUp, ArrowDown, CopyPlus } from 'lucide-react';

const MenuItem: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; isDestructive?: boolean }> = ({ onClick, children, disabled, isDestructive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors 
      ${isDestructive ? 'text-destructive' : 'text-text-primary'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'}
    `}
  >
    {children}
  </button>
);

const ContextMenu: React.FC = () => {
  const { 
    contextMenu, closeContextMenu, components, clipboard,
    deleteComponent, duplicateComponent, copyComponent, pasteComponent, copyStyles, pasteStyles, addNewColumnToRow, moveSection, openConfirmModal
  } = useBuilderStore();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    };

    if (contextMenu.isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        let newX = contextMenu.x;
        let newY = contextMenu.y;
        if (contextMenu.x + menuRect.width > innerWidth) {
          newX = innerWidth - menuRect.width - 8;
        }
        if (contextMenu.y + menuRect.height > innerHeight) {
          newY = innerHeight - menuRect.height - 8;
        }
        setPosition({ x: newX, y: newY });
      } else {
        setPosition({ x: contextMenu.x, y: contextMenu.y });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isVisible, contextMenu.x, contextMenu.y, closeContextMenu]);

  if (!contextMenu.isVisible || !contextMenu.targetId) return null;

  const pathResult = findComponentPath(contextMenu.targetId, components);
  if (!pathResult) return null;
  const targetComponent = pathResult.component;

  const isRootLevel = pathResult.path.length === 1;

  const handleAction = (action: () => void) => {
    action();
    closeContextMenu();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-56 bg-secondary border border-border rounded-lg shadow-2xl p-2"
      style={{ top: position.y, left: position.x, visibility: contextMenu.isVisible ? 'visible' : 'hidden' }}
    >
      {targetComponent.type === 'Row' && (
        <MenuItem onClick={() => handleAction(addNewColumnToRow)}>
          <Plus size={16} /> Add New Column
        </MenuItem>
      )}
      {targetComponent.type === 'Section' && isRootLevel && (
        <>
          <MenuItem onClick={() => handleAction(() => moveSection('up'))} disabled={pathResult.path[0] === 0}>
            <ArrowUp size={16} /> Move Up
          </MenuItem>
          <MenuItem onClick={() => handleAction(() => moveSection('down'))} disabled={pathResult.path[0] === components.length - 1}>
            <ArrowDown size={16} /> Move Down
          </MenuItem>
        </>
      )}
      {(targetComponent.type === 'Row' || (targetComponent.type === 'Section' && isRootLevel)) && <div className="h-px my-1 bg-border" />}

      <MenuItem onClick={() => handleAction(() => duplicateComponent(targetComponent.id))}>
        <Copy size={16} /> Duplicate
      </MenuItem>
      <MenuItem onClick={() => handleAction(copyComponent)}>
        <CopyPlus size={16} /> Copy
      </MenuItem>
      <MenuItem onClick={() => handleAction(pasteComponent)} disabled={clipboard.type !== 'component'}>
        <ClipboardPaste size={16} /> Paste
      </MenuItem>
      
      <div className="h-px my-1 bg-border" />

      <MenuItem onClick={() => handleAction(copyStyles)}>
        <Paintbrush size={16} /> Copy Styles
      </MenuItem>
      <MenuItem onClick={() => handleAction(pasteStyles)} disabled={clipboard.type !== 'styles'}>
        <Paintbrush size={16} /> Paste Styles
      </MenuItem>

      <div className="h-px my-1 bg-border" />
      
      <MenuItem onClick={() => handleAction(() => openConfirmModal('Are you sure you want to delete this component?', () => deleteComponent(targetComponent.id)))} isDestructive>
        <Trash2 size={16} /> Delete
      </MenuItem>
    </div>
  );
};

export default ContextMenu;
