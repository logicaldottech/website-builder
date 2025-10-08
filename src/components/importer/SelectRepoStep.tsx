import React, { useState } from 'react';
import { Search, GitBranch } from 'lucide-react';

// Mock data
const mockRepos = [
  { name: 'my-nextjs-blog', description: 'Personal blog built with Next.js and Tailwind CSS.' },
  { name: 'e-commerce-storefront', description: 'Headless e-commerce site.' },
  { name: 'company-landing-page', description: 'Marketing site for our new product.' },
  { name: 'portfolio-v3', description: 'My personal portfolio website.' },
  { name: 'internal-dashboard', description: 'React-based dashboard for internal tools.' },
];

interface SelectRepoStepProps {
  onSelect: (repoName: string) => void;
}

const SelectRepoStep: React.FC<SelectRepoStepProps> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const filteredRepos = mockRepos.filter(repo => repo.name.includes(search.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Select a Repository</h2>
      <p className="text-text-secondary mb-8 text-center">
        Choose the Next.js project you want to connect to the builder.
      </p>
      
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full pl-11 pr-4 py-3 bg-secondary-gray border border-border-color rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        {filteredRepos.map(repo => (
          <div key={repo.name} className="flex items-center justify-between p-4 bg-secondary-gray border border-border-color rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch size={16} className="text-text-secondary" />
                <p className="font-semibold text-text-primary">{repo.name}</p>
              </div>
              <p className="text-sm text-text-secondary mt-1">{repo.description}</p>
            </div>
            <button
              onClick={() => onSelect(repo.name)}
              className="px-4 py-1.5 text-sm font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all whitespace-nowrap"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectRepoStep;
