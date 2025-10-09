import React from 'react';
import { Search, LayoutGrid, FileText } from 'lucide-react';

const sectionCategories = ['All', 'Hero', 'Features', 'CTA', 'Testimonials', 'Gallery', 'Pricing', 'FAQ', 'Contact', 'Footer'];
const templateCategories = ['All', 'Landing', 'Blog', 'Services', 'Portfolio'];

interface BlocksSidebarProps {
  filters: { search: string; type: string; category: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; type: string; category: string; }>>;
}

const BlocksSidebar: React.FC<BlocksSidebarProps> = ({ filters, setFilters }) => {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset category when type changes
      ...(key === 'type' && { category: 'All' }),
    }));
  };

  const categories = filters.type === 'Sections' ? sectionCategories : templateCategories;

  return (
    <aside className="w-80 bg-surface border-r border-border p-6 flex-shrink-0 flex flex-col gap-8">
      <div>
        <label htmlFor="search-blocks" className="sr-only">Search blocks</label>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="search-blocks"
            type="text"
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            placeholder="Search blocks..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Type</h3>
        <div className="flex items-center bg-surface-alt p-1 rounded-md">
          <button onClick={() => handleFilterChange('type', 'Sections')} className={`w-1/2 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold rounded ${filters.type === 'Sections' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}>
            <LayoutGrid size={16} /> Sections
          </button>
          <button onClick={() => handleFilterChange('type', 'Templates')} className={`w-1/2 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold rounded ${filters.type === 'Templates' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}>
            <FileText size={16} /> Templates
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filters.category === cat ? 'bg-primary text-white' : 'bg-surface-alt text-text-muted hover:bg-border'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlocksSidebar;
