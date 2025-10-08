import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, ArrowLeft } from 'lucide-react';
import Stepper from '../components/importer/Stepper';
import ConnectGitStep from '../components/importer/ConnectGitStep';
import SelectRepoStep from '../components/importer/SelectRepoStep';
import ConfigureProjectStep from '../components/importer/ConfigureProjectStep';
import SummaryStep from '../components/importer/SummaryStep';

const steps = ['Connect Git', 'Select Repo', 'Configure', 'Summary'];

const ImporterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionInfo, setConnectionInfo] = useState({
    provider: '',
    repoName: '',
    apiEndpoint: '',
  });

  const handleConnect = (provider: string) => {
    setConnectionInfo(prev => ({ ...prev, provider }));
    setCurrentStep(1);
  };

  const handleSelectRepo = (repoName: string) => {
    setConnectionInfo(prev => ({ ...prev, repoName }));
    setCurrentStep(2);
  };

  const handleConfigure = (apiEndpoint: string) => {
    setConnectionInfo(prev => ({ ...prev, apiEndpoint }));
    setCurrentStep(3);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ConnectGitStep onConnect={handleConnect} />;
      case 1:
        return <SelectRepoStep onSelect={handleSelectRepo} />;
      case 2:
        return <ConfigureProjectStep onConfigure={handleConfigure} />;
      case 3:
        return <SummaryStep repoName={connectionInfo.repoName} apiEndpoint={connectionInfo.apiEndpoint} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-text-primary">
      <header className="flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-text-primary">
              <Code className="w-7 h-7 text-primary-purple" />
              Builder
            </Link>
            <Link to="/builder" className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary">
              <ArrowLeft size={16} />
              Back to Editor
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-start pt-16 pb-24 px-4">
        <div className="w-full max-w-4xl mb-16">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="w-full">
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default ImporterPage;
