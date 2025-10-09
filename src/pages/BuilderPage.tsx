import React, { useCallback, useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { X, Settings } from 'lucide-react';
import EditorHeader from '../components/builder/EditorHeader';
import LeftSidebar from '../components/builder/LeftSidebar';
import Canvas from '../components/builder/Canvas';
import { useBuilderStore } from '../store/builderStore';
import ContextMenu from '../components/builder/ContextMenu';
import ExportModal from '../components/builder/ExportModal';
import ConfirmModal from '../components/builder/ConfirmModal';
import ImageManagerModal from '../components/builder/advanced-controls/ImageManagerModal';
import IconPickerModal from '../components/builder/advanced-controls/IconPickerModal';
import { generatePageTsx, generatePackageJson, generateTailwindConfig, generateGlobalCss } from '../utils/generateNextJsCode';

const BuilderPage: React.FC = () => {
  const { 
    components, 
    isExportModalOpen, 
    openExportModal, 
    closeExportModal,
    isPreviewMode,
    togglePreviewMode,
    confirmModal,
    closeConfirmModal,
  } = useBuilderStore();
  
  const [generatedCode, setGeneratedCode] = React.useState<Record<string, string> | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      requestAnimationFrame(() => {
        let newWidth = e.clientX;
        if (newWidth < 280) newWidth = 280;
        if (newWidth > 420) newWidth = 420;
        setSidebarWidth(newWidth);
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleExport = useCallback(() => {
    const pageCode = generatePageTsx(components);
    const packageJson = generatePackageJson();
    const tailwindConfig = generateTailwindConfig();
    const globalCss = generateGlobalCss(components);
    setGeneratedCode({
      'pages/index.tsx': pageCode,
      'styles/globals.css': globalCss,
      'package.json': packageJson,
      'tailwind.config.js': tailwindConfig,
    });
    openExportModal();
  }, [components, openExportModal]);

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    closeConfirmModal();
  };

  if (isPreviewMode) {
    return (
      <div className="relative h-screen w-full bg-bg text-text">
        <Canvas />
        <button 
          onClick={togglePreviewMode}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-surface text-text rounded-lg shadow-md border border-border hover:bg-surface-alt"
        >
          <X size={16} />
          Exit Preview
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen w-full bg-bg text-text">
        <EditorHeader onExport={handleExport} />
        <div className="flex flex-grow overflow-hidden">
          <div style={{ width: `${sidebarWidth}px` }} className="flex-shrink-0 bg-surface border-r border-border">
            <LeftSidebar />
          </div>
          <div 
            onMouseDown={handleMouseDown}
            className="w-1.5 cursor-col-resize hover:bg-primary transition-colors flex-shrink-0 group"
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary mx-auto"></div>
          </div>
          <main className="flex-1 flex flex-col overflow-hidden bg-surface-alt">
            <Canvas />
          </main>
        </div>
        <ContextMenu />
        {generatedCode && (
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={closeExportModal}
            generatedCode={generatedCode}
          />
        )}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          message={confirmModal.message}
          onConfirm={handleConfirm}
          onCancel={closeConfirmModal}
        />
        <ImageManagerModal />
        <IconPickerModal />
      </div>
    </DndProvider>
  );
};

export default BuilderPage;
