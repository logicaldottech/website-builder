import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Plus, Heart } from 'lucide-react';
import { BlockLibraryItem } from '../../types/builder';

interface BlockCardProps {
  block: BlockLibraryItem;
  onInsert: () => void;
  onPreview: () => void;
}

const BlockCard: React.FC<BlockCardProps> = ({ block, onInsert, onPreview }) => {
  return (
    <motion.div
      className="group bg-surface rounded-lg border border-border overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md hover:border-border/80"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <img
          src={block.thumbnail}
          alt={`Preview of ${block.title}`}
          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-2">
          <button onClick={onPreview} className="flex items-center justify-center w-8 h-8 text-sm bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Eye size={16} />
          </button>
          <button onClick={onInsert} className="flex items-center justify-center w-8 h-8 text-sm bg-primary text-white rounded-full hover:bg-primary-600 transition-colors">
            <Plus size={18} />
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-text">{block.title}</h3>
        <p className="text-text-muted text-sm mt-1 flex-grow">{block.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1.5">
            {block.categories.slice(0, 2).map(cat => (
              <span key={cat} className="text-xs bg-surface-alt text-text-muted px-2 py-0.5 rounded-full">{cat}</span>
            ))}
          </div>
          <button className="text-text-muted hover:text-danger">
            <Heart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockCard;
