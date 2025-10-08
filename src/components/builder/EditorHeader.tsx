import React from 'react';
import { Monitor, Tablet, Smartphone, Eye, Download, Undo, Redo, Trash2 } from 'lucide-react';
import { useBuilderStore, useTemporalStore, Device } from '../../store/builderStore';

interface EditorHeaderProps {
  onExport: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onExport }) => {
  const { device, setDevice, clearCanvas } = useBuilderStore();
  const { undo, redo, futureStates, pastStates } = useTemporalStore();

  const DeviceButton: React.FC<{
    currentDevice: Device;
    targetDevice: Device;
    children: React.ReactNode;
  }> = ({ currentDevice, targetDevice, children }) => (
    <button
      onClick={() => setDevice(targetDevice)}
      className={`p-2 rounded-md transition-colors ${
        currentDevice === targetDevice
          ? 'bg-primary-purple text-white'
          : 'text-text-secondary hover:bg-border-color hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-16 w-full bg-secondary-gray border-b border-border-color flex items-center justify-between px-4 z-10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={() => undo()} disabled={pastStates.length === 0} className="p-2 rounded-md text-text-secondary hover:bg-border-color hover:text-text-primary disabled:text-border-color disabled:hover:bg-transparent disabled:cursor-not-allowed">
          <Undo size={18} />
        </button>
        <button onClick={() => redo()} disabled={futureStates.length === 0} className="p-2 rounded-md text-text-secondary hover:bg-border-color hover:text-text-primary disabled:text-border-color disabled:hover:bg-transparent disabled:cursor-not-allowed">
          <Redo size={18} />
        </button>
         <button onClick={() => { if(window.confirm('Are you sure you want to clear the canvas?')) clearCanvas() }} className="p-2 rounded-md text-text-secondary hover:bg-red-500/20 hover:text-red-400">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-background rounded-lg">
        <DeviceButton currentDevice={device} targetDevice="desktop"><Monitor size={18} /></DeviceButton>
        <DeviceButton currentDevice={device} targetDevice="tablet"><Tablet size={18} /></DeviceButton>
        <DeviceButton currentDevice={device} targetDevice="mobile"><Smartphone size={18} /></DeviceButton>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <Eye size={16} /> <span>Preview</span>
        </button>
        <button onClick={onExport} className="flex items-center gap-2 text-sm px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all">
          <Download size={14} className="mr-1" /> <span>Export Code</span>
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;
