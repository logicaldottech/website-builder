import React from 'react';
import { Github, Gitlab } from 'lucide-react';

interface ConnectGitStepProps {
  onConnect: (provider: 'github' | 'gitlab' | 'bitbucket') => void;
}

const ProviderButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-secondary-gray border border-border-color rounded-lg hover:border-primary-purple hover:bg-primary-purple/10 transition-all"
  >
    {icon}
    <span className="text-lg font-semibold text-text-primary">Connect with {label}</span>
  </button>
);

const ConnectGitStep: React.FC<ConnectGitStepProps> = ({ onConnect }) => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Connect your Git Provider</h2>
      <p className="text-text-secondary mb-8">
        Allow Builder to access your repositories. We only request read access to clone your project for preview deployments.
      </p>
      <div className="space-y-4">
        <ProviderButton icon={<Github />} label="GitHub" onClick={() => onConnect('github')} />
        <ProviderButton icon={<Gitlab />} label="GitLab" onClick={() => onConnect('gitlab')} />
        <ProviderButton icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M15.5 10.5h-7L12 17l3.5-6.5z"></path></svg>} label="Bitbucket" onClick={() => onConnect('bitbucket')} />
      </div>
    </div>
  );
};

export default ConnectGitStep;
