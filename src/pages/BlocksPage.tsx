import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, ArrowLeft } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { blockLibrary } from '../data/blockLibrary';
import { BlockLibraryItem } from '../types/builder';
import BlocksSidebar from '../components/blocks/BlocksSidebar';
import BlockCard from '../components/blocks/BlockCard';
import BlockPreviewModal from '../components/blocks/BlockPreviewModal';

const BlocksPage: React.FC = () => {
  const { insertSection, replaceCanvas, appendToCanvas, openConfirmModal } = useBuilderStore();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'Sections',
    category: 'All',
  });
  const [previewingBlock, setPreviewingBlock] = useState<BlockLibraryItem | null>(null);

  const filteredBlocks = useMemo(() => {
    return blockLibrary.filter(block => {
      const typeMatch = filters.type === 'Sections' ? block.type === 'section' : block.type === 'template';
      const categoryMatch = filters.category === 'All' || block.categories.includes(filters.category);
      const searchMatch = block.title.toLowerCase().includes(filters.search.toLowerCase()) || block.description.toLowerCase().includes(filters.search.toLowerCase());
      return typeMatch && categoryMatch && searchMatch;
    });
  }, [filters]);

  const handleInsert = (block: BlockLibraryItem) => {
    if (block.type === 'section') {
      insertSection(block.blueprint as any);
      navigate('/builder');
    } else {
      openConfirmModal(
        'Do you want to replace the current page content or append this template to the end?',
        () => { // onConfirm (Replace)
          replaceCanvas(block.blueprint as any[]);
          navigate('/builder');
        },
        () => { // onCancel (Append)
          appendToCanvas(block.blueprint as any[]);
          navigate('/builder');
        },
        { confirmText: 'Replace', cancelText: 'Append' }
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-bg text-text">
      <header className="flex-shrink-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-border">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-text">
              <Code className="w-7 h-7 text-primary" />
              Builder
            </Link>
            <Link to="/builder" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text">
              <ArrowLeft size={16} />
              Back to Editor
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-grow flex">
        <BlocksSidebar filters={filters} setFilters={setFilters} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2">Explore {filters.type}</h1>
          <p className="text-text-muted mb-8">Choose from a library of professionally designed, responsive blocks to build your page faster.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlocks.map(block => (
              <BlockCard
                key={block.id}
                block={block}
                onInsert={() => handleInsert(block)}
                onPreview={() => setPreviewingBlock(block)}
              />
            ))}
          </div>
          {filteredBlocks.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No blocks found</h3>
              <p className="text-text-muted mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>

      {previewingBlock && (
        <BlockPreviewModal
          block={previewingBlock}
          onClose={() => setPreviewingBlock(null)}
          onInsert={() => {
            handleInsert(previewingBlock);
            setPreviewingBlock(null);
          }}
        />
      )}
    </div>
  );
};

export default BlocksPage;
