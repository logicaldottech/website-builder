import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-secondary rounded-xl w-full max-w-md flex flex-col shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Confirm Action</h3>
              <p className="mt-2 text-sm text-text-secondary">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-background/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold bg-border text-text-primary rounded-lg hover:bg-opacity-80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold bg-destructive text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
