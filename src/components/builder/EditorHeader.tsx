import React from 'react';
import { Monitor, Tablet, Smartphone, Eye, Download, Undo, Redo, Trash2, Library, GitBranch, LayoutTemplate, Code } from 'lucide-react';
import { useStore } from 'zustand';
import { useBuilderStore } from '../../store/builderStore';
import type { Device } from '../../store/builderStore';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';

interface EditorHeaderProps {
  onExport: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onExport }) => {
  const { device, setDevice, clearCanvas, togglePreviewMode, openConfirmModal, openSectionLibrary } = useBuilderStore();
  
  const { undo, redo } = useBuilderStore.temporal;
  const pastStatesLength = useStore(useBuilderStore.temporal, (state) => state.pastStates.length);
  const futureStatesLength = useStore(useBuilderStore.temporal, (state) => state.futureStates.length);

  const HeaderButton: React.FC<{ onClick?: () => void; children: React.ReactNode; to?: string; title: string, disabled?: boolean, isDestructive?: boolean, isActive?: boolean }> = 
  ({ onClick, children, to, title, disabled, isDestructive, isActive }) => {
    const baseClasses = `flex items-center justify-center h-10 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`;
    const activeClasses = isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text';
    const destructiveClasses = isDestructive ? 'hover:bg-danger/10 hover:text-danger' : '';
    const finalClassName = `${baseClasses} ${activeClasses} ${destructiveClasses}`;
    
    if (to) {
      return <Link to={to} className={finalClassName} title={title}>{children}</Link>;
    }
    return <button onClick={onClick} className={finalClassName} title={title} disabled={disabled}>{children}</button>;
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
          : 'text-text-muted hover:bg-surface-alt hover:text-text'
      }`}
    >
      {children}
    </button>
  );

  const handleClearCanvas = () => {
    openConfirmModal('Are you sure you want to clear the entire canvas? This action cannot be undone.', clearCanvas);
  };

  return (
    <div className="h-16 w-full bg-surface border-b border-border flex items-center justify-between px-4 z-10 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text mr-4">
          <Code className="w-6 h-6 text-primary" />
          Builder
        </Link>
        <div className="w-px h-6 bg-border mx-2"></div>
        <HeaderButton onClick={undo} disabled={pastStatesLength === 0} title="Undo"><Undo size={18} /></HeaderButton>
        <HeaderButton onClick={redo} disabled={futureStatesLength === 0} title="Redo"><Redo size={18} /></HeaderButton>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-surface-alt rounded-lg">
          <DeviceButton currentDevice={device} targetDevice="desktop"><Monitor size={18} /></DeviceButton>
          <DeviceButton currentDevice={device} targetDevice="tablet"><Tablet size={18} /></DeviceButton>
          <DeviceButton currentDevice={device} targetDevice="mobile"><Smartphone size={18} /></DeviceButton>
        </div>
        <div className="w-px h-6 bg-border mx-1"></div>
        <HeaderButton onClick={togglePreviewMode} title="Preview"><Eye size={18} /></HeaderButton>
        <ThemeToggle />
        <button onClick={onExport} className="flex items-center gap-2 text-sm font-semibold px-4 h-10 bg-primary text-white rounded-md hover:bg-primary-600 transition-all">
          <Download size={16} /> <span>Publish</span>
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;
