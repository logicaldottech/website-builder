import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Eye, Download, Undo, Redo, Code, LayoutDashboard, Brush, Image, Send } from 'lucide-react';
import { useStore } from 'zustand';
import { useBuilderStore } from '../../store/builderStore';
import type { Device } from '../../store/builderStore';
import ThemeToggle from './ThemeToggle';

interface NewEditorHeaderProps {
  onExport: () => void;
}

const NewEditorHeader: React.FC<NewEditorHeaderProps> = ({ onExport }) => {
  const { device, setDevice, togglePreviewMode, toggleBlocksGallery, isBlocksGalleryOpen } = useBuilderStore();
  const [activeTopTab, setActiveTopTab] = useState('Blocks');
  
  const { undo, redo } = useBuilderStore.temporal;
  const pastStatesLength = useStore(useBuilderStore.temporal, (state) => state.pastStates.length);
  const futureStatesLength = useStore(useBuilderStore.temporal, (state) => state.futureStates.length);

  const HeaderButton: React.FC<{ onClick?: () => void; children: React.ReactNode; title: string, disabled?: boolean, isActive?: boolean }> = 
  ({ onClick, children, title, disabled, isActive }) => {
    const baseClasses = `flex items-center justify-center h-10 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`;
    const activeClasses = isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text';
    const finalClassName = `${baseClasses} ${activeClasses}`;
    return <button onClick={onClick} className={finalClassName} title={title} disabled={disabled}>{children}</button>;
  };

  const TopTabButton: React.FC<{ id: string; icon: React.ReactNode; label: string; }> = ({ id, icon, label }) => {
    const isActive = activeTopTab === id;
    const handleClick = () => {
      setActiveTopTab(id);
      if (id === 'Blocks') {
        toggleBlocksGallery();
      } else if (isBlocksGalleryOpen) {
        toggleBlocksGallery();
      }
    };
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
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

  return (
    <div className="h-16 w-full bg-surface border-b border-border flex items-center justify-between px-4 z-20 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <a href="#" className="flex items-center gap-2 text-xl font-bold text-text mr-2">
          <Code className="w-6 h-6 text-primary" />
        </a>
        <div className="w-px h-6 bg-border mx-2"></div>
        <HeaderButton onClick={undo} disabled={pastStatesLength === 0} title="Undo"><Undo size={18} /></HeaderButton>
        <HeaderButton onClick={redo} disabled={futureStatesLength === 0} title="Redo"><Redo size={18} /></HeaderButton>
      </div>

      <div className="flex items-center gap-2 p-1 bg-surface-alt rounded-lg">
        <TopTabButton id="Blocks" icon={<LayoutDashboard size={16} />} label="Blocks" />
        <TopTabButton id="Styles" icon={<Brush size={16} />} label="Styles" />
        <TopTabButton id="Assets" icon={<Image size={16} />} label="Assets" />
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
          <Send size={16} /> <span>Publish</span>
        </button>
      </div>
    </div>
  );
};

export default NewEditorHeader;
