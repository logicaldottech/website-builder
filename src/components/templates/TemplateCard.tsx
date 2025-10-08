import React from 'react';
import { motion } from 'framer-motion';
import { Template } from '../../types/builder';
import { Eye, ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <motion.div
      className="group bg-secondary-gray rounded-xl border border-border-color overflow-hidden flex flex-col"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(110, 66, 232, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={template.previewImage}
          alt={`Preview of ${template.name}`}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30">
            <Eye size={16} /> Preview
          </button>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-text-primary">{template.name}</h3>
        <p className="text-text-secondary text-sm mt-2 flex-grow">{template.description}</p>
        <button
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-2.5 text-sm font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all"
        >
          Select Template <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
