import React, { useState } from 'react';
import { X, Layout, Star } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { modernHeroSectionBlueprint, threeColumnFeatureSectionBlueprint } from '../../data/sectionBlueprints';
import RenderedComponent from './RenderedComponent'; // Import for preview

interface SectionLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'All', icon: Layout },
  { name: 'Hero', icon: Star },
  { name: 'Features', icon: Star },
  // Add more categories here: About, Testimonials, Contact, CTA
];

const libraryItems = [
  {
    name: 'Modern Hero',
    category: 'Hero',
    preview: 'https://i.ibb.co/LgLwzBq/hero-block-preview.png',
    blueprint: modernHeroSectionBlueprint,
  },
  {
    name: '3-Column Features',
    category: 'Features',
    preview: 'https://i.ibb.co/Vv0F5fP/features-block-preview.png',
    blueprint: threeColumnFeatureSectionBlueprint,
  },
];

const SectionLibraryModal: React.FC<SectionLibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addSectionFromBlueprint } = useBuilderStore();

  if (!isOpen) return null;

  const handleSelectBlueprint = (blueprint: () => any) => {
    addSectionFromBlueprint(blueprint());
    onClose();
  };

  const filteredItems = activeCategory === 'All'
    ? libraryItems
    : libraryItems.filter(item => item.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary-gray rounded-xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl border border-border-color" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">Section Library</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-border-color">
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar for categories */}
          <aside className="w-64 bg-background/50 border-r border-border-color p-4 flex-shrink-0">
            <h3 className="text-sm font-semibold text-text-primary mb-4 px-2">Categories</h3>
            <nav className="flex flex-col gap-1">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeCategory === cat.name
                      ? 'bg-primary-purple text-white font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-border-color'
                  }`}
                >
                  <cat.icon size={16} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content area for previews */}
          <main className="flex-1 p-6 overflow-y-auto bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.name}
                  className="group cursor-pointer border-2 border-border-color rounded-lg overflow-hidden hover:border-primary-purple transition-all"
                  onClick={() => handleSelectBlueprint(item.blueprint)}
                >
                  <div className="aspect-[16/9] bg-secondary-gray overflow-hidden">
                    <img src={item.preview} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-3 bg-secondary-gray border-t border-border-color">
                    <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary-purple transition-colors">{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
             {filteredItems.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-full text-text-secondary">
                    No blocks found in this category.
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SectionLibraryModal;
