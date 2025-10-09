import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedCode: Record<string, string>;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, generatedCode }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(generatedCode)[0]);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [tabName]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [tabName]: false });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-text">Export to Next.js</h2>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-alt">
            <X size={20} />
          </button>
        </div>

        <div className="flex-shrink-0 border-b border-border px-2">
          <div className="flex items-center -mb-px">
            {Object.keys(generatedCode).map(filename => (
              <button
                key={filename}
                onClick={() => setActiveTab(filename)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 ${
                  activeTab === filename
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {filename}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow relative overflow-hidden bg-surface-alt">
          <pre className="h-full w-full overflow-auto p-4 text-sm">
            <code>{generatedCode[activeTab]}</code>
          </pre>
          <button
            onClick={() => handleCopy(generatedCode[activeTab], activeTab)}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-border text-text-muted text-xs font-semibold rounded-md hover:bg-primary hover:text-white transition-all"
          >
            {copiedStates[activeTab] ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
