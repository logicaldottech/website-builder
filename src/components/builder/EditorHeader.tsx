import React from 'react';
import { Monitor, Tablet, Smartphone, Eye, Download, Undo, Redo, Trash2, Library, GitBranch, LayoutTemplate } from 'lucide-react';
import { useStore } from 'zustand';
import { useBuilderStore } from '../../store/builderStore';
import type { Device } from '../../store/builderStore';
import { Link } from 'react-router-dom';

interface EditorHeaderProps {
  onExport: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onExport }) => {
  const device = useBuilderStore((state) => state.device);
  const setDevice = useBuilderStore((state) => state.setDevice);
  const clearCanvas = useBuilderStore((state) => state.clearCanvas);
  const togglePreviewMode = useBuilderStore((state) => state.togglePreviewMode);
  const openConfirmModal = useBuilderStore((state) => state.openConfirmModal);
  const openSectionLibrary = useBuilderStore((state) => state.openSectionLibrary);
  
  const { undo, redo } = useBuilderStore.temporal;
  const pastStatesLength = useStore(useBuilderStore.temporal, (state) => state.pastStates.length);
  const futureStatesLength = useStore(useBuilderStore.temporal, (state) => state.futureStates.length);

  const HeaderButton: React.FC<{ onClick?: () => void; children: React.ReactNode; to?: string; title?: string, disabled?: boolean, isDestructive?: boolean }> = ({ onClick, children, to, title, disabled, isDestructive }) => {
    const className = `flex items-center gap-2 text-sm px-3 py-1.5 bg-secondary border border-border text-text-secondary rounded-md hover:text-text-primary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-text-secondary ${isDestructive ? 'hover:border-destructive hover:text-destructive' : ''}`;
    
    if (to) {
      return <Link to={to} className={className} title={title}>{children}</Link>;
    }
    return <button onClick={onClick} className={className} title={title} disabled={disabled}>{children}</button>;
  };

  const DeviceButton: React.FC<{
    currentDevice: Device;
    targetDevice: Device;
    children: React.ReactNode;
  }> = ({ currentDevice, targetDevice, children }) => (
    <button
      onClick={() => setDevice(targetDevice)}
      className={`p-2 rounded-md transition-colors ${
        currentDevice === targetDevice
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-border hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );

  const handleClearCanvas = () => {
    openConfirmModal('Are you sure you want to clear the entire canvas? This action cannot be undone.', clearCanvas);
  };

  return (
    <div className="h-16 w-full bg-secondary border-b border-border flex items-center justify-between px-4 z-10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <HeaderButton to="/templates" title="Templates"><LayoutTemplate size={14} /></HeaderButton>
        <HeaderButton onClick={() => openSectionLibrary()} title="Blocks"><Library size={14} /></HeaderButton>
        <HeaderButton to="/importer" title="Import Project"><GitBranch size={14} /></HeaderButton>
        
        <div className="w-px h-6 bg-border mx-2"></div>

        <HeaderButton onClick={undo} disabled={pastStatesLength === 0} title="Undo"><Undo size={18} /></HeaderButton>
        <HeaderButton onClick={redo} disabled={futureStatesLength === 0} title="Redo"><Redo size={18} /></HeaderButton>
        <HeaderButton onClick={handleClearCanvas} title="Clear Canvas" isDestructive><Trash2 size={18} /></HeaderButton>
      </div>

      <div className="flex items-center gap-1 p-1 bg-background rounded-lg">
        <DeviceButton currentDevice={device} targetDevice="desktop"><Monitor size={18} /></DeviceButton>
        <DeviceButton currentDevice={device} targetDevice="tablet"><Tablet size={18} /></DeviceButton>
        <DeviceButton currentDevice={device} targetDevice="mobile"><Smartphone size={18} /></DeviceButton>
      </div>

      <div className="flex items-center gap-3">
        <HeaderButton onClick={togglePreviewMode}><Eye size={16} /> <span>Preview</span></HeaderButton>
        <button onClick={onExport} className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all">
          <Download size={14} className="mr-1" /> <span>Export Code</span>
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;
