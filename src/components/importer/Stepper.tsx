import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary-purple" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-primary-purple rounded-full"
                >
                  <Check className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border-color" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-secondary-gray border-2 border-primary-purple rounded-full"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 bg-primary-purple rounded-full" aria-hidden="true" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border-color" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-secondary-gray border-2 border-border-color rounded-full"
                >
                </div>
              </>
            )}
             <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-text-secondary whitespace-nowrap mt-1">{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
