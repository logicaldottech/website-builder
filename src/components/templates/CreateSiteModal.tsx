import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { X, CheckCircle, Loader } from 'lucide-react';
import { Template } from '../../types/builder';

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
}

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ isOpen, onClose, template }) => {
  const [siteName, setSiteName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) return;

    setStatus('loading');
    // Simulate backend automation
    setTimeout(() => {
      setStatus('success');
    }, 2500);
  };

  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
      setSiteName('');
      setStatus('idle');
    }, 300);
  };

  if (!isOpen) return null;

  const siteSubdomain = siteName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'your-new-site';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div
        className="bg-secondary-gray rounded-xl w-full max-w-md flex flex-col shadow-2xl border border-border-color"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-color">
          <h2 className="text-lg font-semibold text-text-primary">Create New Site</h2>
          <button onClick={handleClose} className="p-1 rounded-md hover:bg-border-color">
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Site Created!</h3>
            <p className="text-text-secondary mb-6">
              Your new site <code className="text-primary-purple">{siteSubdomain}.builder.com</code> is ready.
            </p>
            <RouterLink
              to="/builder" // This would eventually go to the new site's editor instance
              className="w-full inline-block px-6 py-3 text-base font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Start Editing
            </RouterLink>
          </div>
        ) : (
          <form onSubmit={handleCreateSite} className="p-6">
            <p className="text-sm text-text-secondary mb-4">
              You've selected the <strong>{template.name}</strong> template. Name your new site to continue.
            </p>
            <div>
              <label htmlFor="site-name" className="block text-sm font-medium text-text-primary mb-2">
                Site Name
              </label>
              <input
                id="site-name"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Awesome Portfolio"
                required
                autoFocus
                className="w-full px-3 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all"
              />
              <p className="text-xs text-text-secondary mt-2">
                Your site will be available at: <code className="text-primary-purple">{siteSubdomain}.builder.com</code>
              </p>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={!siteName.trim() || status === 'loading'}
                className="w-full flex items-center justify-center px-6 py-3 text-base font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all disabled:bg-opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Creating Site...
                  </>
                ) : (
                  'Create Site'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateSiteModal;
