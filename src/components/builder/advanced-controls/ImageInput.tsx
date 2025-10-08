import React from 'react';
import { Image } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

interface ImageInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange }) => {
  const { openImageManager } = useBuilderStore();

  const handleOpenManager = () => {
    openImageManager(onChange);
  };

  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 block font-medium">Background Image</label>
      <div className="w-full h-24 bg-background border border-border-color rounded-lg flex items-center justify-center p-2">
        {value ? (
          <img src={value} alt="Background preview" className="max-w-full max-h-full rounded-md object-contain" />
        ) : (
          <div className="text-center text-text-secondary">
            <Image size={24} className="mx-auto mb-1" />
            <span className="text-xs">No Image Selected</span>
          </div>
        )}
      </div>
      <button
        onClick={handleOpenManager}
        className="w-full mt-2 px-4 py-2 text-sm font-semibold bg-border-color text-text-primary rounded-lg hover:bg-opacity-80 transition-all"
      >
        Choose Image
      </button>
    </div>
  );
};

export default ImageInput;
