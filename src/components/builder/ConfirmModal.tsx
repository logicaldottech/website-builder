import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  options?: {
    confirmText?: string;
    cancelText?: string;
  }
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel, options }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-surface rounded-lg w-full max-w-md flex flex-col shadow-lg border border-border" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Confirm Action</h3>
              <p className="mt-2 text-sm text-text-muted">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-alt px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 h-10 text-sm font-semibold bg-surface border border-border text-text rounded-md hover:bg-surface-alt transition-all"
          >
            {options?.cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 h-10 text-sm font-semibold bg-danger text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            {options?.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
