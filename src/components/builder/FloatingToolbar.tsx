import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { GripVertical, Copy, Trash2, Settings } from 'lucide-react';
import { ConnectDragSource } from 'react-dnd';

interface FloatingToolbarProps {
  componentId: string;
  dragHandleRef: ConnectDragSource;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ componentId, dragHandleRef }) => {
  const { deleteComponent, duplicateComponent, setActiveSidebarTab, setActivePropertiesTab, selectComponent, openConfirmModal } = useBuilderStore();

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(componentId);
    setActiveSidebarTab('properties');
    setActivePropertiesTab('Style');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal('Are you sure you want to delete this component?', () => deleteComponent(componentId));
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateComponent(componentId);
  };

  return (
    <div className="absolute -top-8 right-0 z-30 flex items-center gap-0.5 bg-surface border border-border rounded-md shadow-md p-0.5" onClick={e => e.stopPropagation()}>
      {dragHandleRef(
        <div className="p-1.5 cursor-move text-text-muted hover:bg-surface-alt rounded-l-sm">
          <GripVertical size={16} />
        </div>
      )}
      <button onClick={handleSettingsClick} className="p-1.5 text-text-muted hover:bg-surface-alt" title="Settings">
        <Settings size={16} />
      </button>
      <button onClick={handleDuplicateClick} className="p-1.5 text-text-muted hover:bg-surface-alt" title="Duplicate">
        <Copy size={16} />
      </button>
      <button onClick={handleDeleteClick} className="p-1.5 text-danger/80 hover:bg-danger/10 hover:text-danger rounded-r-sm" title="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default FloatingToolbar;
