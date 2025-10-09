import React, { useState } from 'react';
import { X, Plus, Monitor, Tablet, Smartphone } from 'lucide-react';
import { BlockLibraryItem } from '../../types/builder';

interface BlockPreviewModalProps {
  block: BlockLibraryItem;
  onClose: () => void;
  onInsert: () => void;
}

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const BlockPreviewModal: React.FC<BlockPreviewModalProps> = ({ block, onClose, onInsert }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl w-full h-[90vh] flex flex-col shadow-lg border border-border" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-text">{block.title}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-surface-alt rounded-lg">
              <button onClick={() => setDevice('desktop')} className={`p-2 rounded-md ${device === 'desktop' ? 'bg-primary text-white' : 'text-text-muted'}`}><Monitor size={18} /></button>
              <button onClick={() => setDevice('tablet')} className={`p-2 rounded-md ${device === 'tablet' ? 'bg-primary text-white' : 'text-text-muted'}`}><Tablet size={18} /></button>
              <button onClick={() => setDevice('mobile')} className={`p-2 rounded-md ${device === 'mobile' ? 'bg-primary text-white' : 'text-text-muted'}`}><Smartphone size={18} /></button>
            </div>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button onClick={onInsert} className="flex items-center gap-2 text-sm font-semibold px-4 h-10 bg-primary text-white rounded-md hover:bg-primary-600 transition-all">
              <Plus size={16} /> <span>Insert</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-alt ml-2"><X size={20} /></button>
          </div>
        </header>

        <main className="flex-grow overflow-hidden bg-surface-alt flex justify-center p-4">
          <div className="w-full h-full overflow-y-auto">
            <div
              className="bg-white mx-auto shadow-lg transition-all duration-300"
              style={{ width: deviceWidths[device] }}
            >
              <img src={block.thumbnail} alt={`Preview of ${block.title}`} className="w-full h-auto" />
              {/* In a real scenario, this would render the actual blueprint */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlockPreviewModal;
