import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Search, Image as ImageIcon } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import axios from 'axios';

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const ImageManagerModal: React.FC = () => {
  const { isImageManagerOpen, closeImageManager, imageManagerCallback, userImages, addUserImage } = useBuilderStore();
  const [activeTab, setActiveTab] = useState('My Library');
  const [stockImages, setStockImages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('office');

  const fetchStockImages = useCallback(async (query: string) => {
    if (!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'YOUR_API_KEY') {
      console.warn("Unsplash API key is not configured.");
      setStockImages([]);
      return;
    }
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 20 },
        headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` }
      });
      setStockImages(response.data.results);
    } catch (error) {
      console.error("Error fetching from Unsplash:", error);
    }
  }, []);

  useEffect(() => {
    if (isImageManagerOpen && activeTab === 'Stock Photos') {
      fetchStockImages(searchQuery);
    }
  }, [isImageManagerOpen, activeTab, searchQuery, fetchStockImages]);

  if (!isImageManagerOpen) return null;

  const handleImageSelect = (url: string) => {
    if (imageManagerCallback) {
      imageManagerCallback(url);
    }
    closeImageManager();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        addUserImage(dataUrl);
        handleImageSelect(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const MyLibraryTab = () => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {userImages.map((url, i) => (
        <div key={i} className="aspect-square bg-background rounded-md overflow-hidden cursor-pointer group" onClick={() => handleImageSelect(url)}>
          <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        </div>
      ))}
      {userImages.length === 0 && <p className="col-span-full text-center text-text-secondary">Your library is empty. Upload some images!</p>}
    </div>
  );

  const UploadTab = () => (
    <div className="p-8 flex items-center justify-center">
      <label className="w-full h-64 border-2 border-dashed border-border-color rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-purple hover:bg-primary-purple/10">
        <Upload size={48} className="text-text-secondary mb-4" />
        <span className="text-text-primary font-semibold">Drag & drop or click to upload</span>
        <span className="text-text-secondary text-sm mt-1">PNG, JPG, GIF up to 10MB</span>
        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
      </label>
    </div>
  );

  const StockPhotosTab = () => (
    <div className="p-4">
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for photos..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg"
        />
      </div>
       {!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'YOUR_API_KEY' ? (
        <div className="text-center p-8 bg-background rounded-md text-text-secondary">
          <p>Please add your Unsplash API key to the <code>.env</code> file to browse stock photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stockImages.map(img => (
            <div key={img.id} className="aspect-square bg-background rounded-md overflow-hidden cursor-pointer group" onClick={() => handleImageSelect(img.urls.regular)}>
              <img src={img.urls.thumb} alt={img.alt_description} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeImageManager}>
      <div className="bg-secondary-gray rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-border-color" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">Image Manager</h2>
          <button onClick={closeImageManager} className="p-1 rounded-md hover:bg-border-color"><X size={20} className="text-text-secondary" /></button>
        </div>
        <div className="flex-shrink-0 border-b border-border-color px-2">
          <div className="flex items-center -mb-px">
            {['My Library', 'Upload New', 'Stock Photos'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-primary-purple text-primary-purple' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'My Library' && <MyLibraryTab />}
          {activeTab === 'Upload New' && <UploadTab />}
          {activeTab === 'Stock Photos' && <StockPhotosTab />}
        </div>
      </div>
    </div>
  );
};

export default ImageManagerModal;
