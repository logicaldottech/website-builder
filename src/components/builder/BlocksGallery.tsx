import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '../../store/builderStore';
import { Search, X, LayoutGrid, List, Columns, Rows, ChevronsUpDown } from 'lucide-react';
import { useDebounce } from 'react-use';
import * as LucideIcons from 'lucide-react';

const DraggableBlock: React.FC<{ block: any }> = ({ block }) => {
  // Simplified for now, drag and drop from here can be added later
  const { insertSection } = useBuilderStore();
  
  const handleInsert = () => {
    // This is a placeholder for inserting. In a real DnD scenario, this would be different.
    // We'd need to create a component from the block's schema.
    // For now, let's just log it.
    console.log('Inserting block:', block.label);
  };

  const Icon = (LucideIcons as any)[block.sample.items?.[0]?.icon || 'Layers'] || LucideIcons.Layers;

  return (
    <div className="group bg-surface rounded-lg border border-border overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md hover:border-border/80 cursor-pointer" onClick={handleInsert}>
      <div className="relative aspect-video bg-surface-alt overflow-hidden">
        <img src={block.thumbnail} alt={block.label} className="w-full h-full object-cover object-center transition-transform group-hover:scale-105" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-text text-sm truncate">{block.label}</h3>
      </div>
    </div>
  );
};


const BlocksGallery: React.FC = () => {
  const { isBlocksGalleryOpen, designSpec, toggleBlocksGallery } = useBuilderStore();
  
  const [category, setCategory] = useState('All');
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useDebounce(() => setDebouncedSearch(searchTerm), 200, [searchTerm]);

  const blocks = designSpec.blocks;
  const categories = designSpec.ui.blocksTab.categories.options;
  const allTags = designSpec.ui.blocksTab.tags.options;

  const filteredBlocks = useMemo(() => {
    return blocks.filter((block: any) => {
      const categoryMatch = category === 'All' || block.type.toLowerCase().includes(category.toLowerCase().replace(/s$/, ''));
      const tagsMatch = tags.length === 0 || tags.every(tag => block.sample.theme?.background?.type === tag.toLowerCase() || block.html_hint.includes(tag.toLowerCase()));
      const searchMatch = debouncedSearch === '' || block.label.toLowerCase().includes(debouncedSearch.toLowerCase());
      return categoryMatch && tagsMatch && searchMatch;
    });
  }, [blocks, category, tags, debouncedSearch]);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <AnimatePresence>
      {isBlocksGalleryOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute top-16 left-0 right-0 bg-surface border-b border-border shadow-lg z-10"
          style={{ height: 'calc(80vh - 64px)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
            {/* Header / Filters */}
            <div className="flex-shrink-0 py-4 flex items-center gap-4 border-b border-border">
              {/* Category Select */}
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-surface-alt border border-border rounded-md h-10 px-3 text-sm font-medium">
                {categories.map((cat: string) => <option key={cat}>{cat}</option>)}
              </select>
              {/* Tag Chips */}
              <div className="flex items-center gap-2">
                {allTags.map((tag: string) => (
                  <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 h-8 text-sm font-medium rounded-full transition-colors ${tags.includes(tag) ? 'bg-primary text-white' : 'bg-surface-alt text-text-muted hover:bg-border'}`}>
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex-grow"></div>
              {/* Search */}
              <div className="relative w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search blocks..."
                  className="w-full pl-10 pr-4 h-10 bg-surface-alt border border-border rounded-md text-sm"
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-grow py-6 overflow-y-auto">
              {filteredBlocks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredBlocks.map((block: any) => (
                    <DraggableBlock key={block.type} block={block} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <p>No blocks found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlocksGallery;
