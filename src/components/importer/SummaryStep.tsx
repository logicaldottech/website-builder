import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle, FileCode } from 'lucide-react';

interface SummaryStepProps {
  repoName: string;
  apiEndpoint: string;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ repoName, apiEndpoint }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-text-primary mb-2">Project Connected!</h2>
        <p className="text-text-secondary">
          Your project is now linked. Here is the final step to make your components editable.
        </p>
      </div>

      <div className="bg-secondary-gray border border-border-color rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Configuration Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Repository:</span>
            <span className="font-mono text-text-primary">{repoName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Content API:</span>
            <span className="font-mono text-text-primary">{apiEndpoint}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary-gray border border-border-color rounded-lg p-6">
        <div className="flex gap-4">
          <FileCode size={24} className="text-primary-purple mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Final Step: Instrument Your Code</h3>
            <p className="text-text-secondary mb-4">
              To make elements editable, add the <code>data-editable-field</code> attribute to your JSX. The attribute's value must match the corresponding key in your content JSON.
            </p>
            <pre className="text-sm bg-background p-3 rounded-md overflow-x-auto"><code>
{`<h1 data-editable-field="hero.title">
  {props.pageData.hero.title}
</h1>

<p data-editable-field="hero.subtitle">
  {props.pageData.hero.subtitle}
</p>

<img
  src={props.pageData.hero.imageUrl}
  data-editable-field="hero.imageUrl"
/>`}
            </code></pre>
            <p className="text-text-secondary mt-4">
              Once your code is instrumented and pushed to your repository, we will automatically build and deploy a preview. You can then navigate to your preview URL with <code>?edit=true</code> to start editing.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <RouterLink
          to="/builder"
          className="px-8 py-3 text-base font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all"
        >
          Back to Builder
        </RouterLink>
      </div>
    </div>
  );
};

export default SummaryStep;
