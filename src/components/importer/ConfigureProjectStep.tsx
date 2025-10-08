import React, { useState } from 'react';
import { Link } from 'lucide-react';

interface ConfigureProjectStepProps {
  onConfigure: (apiEndpoint: string) => void;
}

const ConfigureProjectStep: React.FC<ConfigureProjectStepProps> = ({ onConfigure }) => {
  const [apiEndpoint, setApiEndpoint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiEndpoint) {
      onConfigure(apiEndpoint);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Define Content Source</h2>
      <p className="text-text-secondary mb-8 text-center">
        The builder acts as a headless CMS. Provide the API endpoint where your page content is stored as JSON.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="api-endpoint" className="block text-sm font-medium text-text-primary mb-2">
            Content API Endpoint URL
          </label>
          <div className="relative">
            <Link size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              id="api-endpoint"
              type="url"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://your-api.com/content/page-slug"
              required
              className="w-full pl-11 pr-4 py-3 bg-secondary-gray border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all"
            />
          </div>
           <p className="text-xs text-text-secondary mt-2">
            Our builder will make GET requests to read content and PATCH requests to save updated content to this URL.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!apiEndpoint}
            className="px-6 py-2.5 text-sm font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigureProjectStep;
