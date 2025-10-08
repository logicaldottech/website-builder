import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { X } from 'lucide-react';
import EditorHeader from '../components/builder/EditorHeader';
import LeftSidebar from '../components/builder/LeftSidebar';
import Canvas from '../components/builder/Canvas';
import Breadcrumbs from '../components/builder/Breadcrumbs';
import { useBuilderStore } from '../store/builderStore';
import ContextMenu from '../components/builder/ContextMenu';
import ExportModal from '../components/builder/ExportModal';
import ConfirmModal from '../components/builder/ConfirmModal';
import SectionLibraryModal from '../components/builder/SectionLibraryModal';
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
    isSectionLibraryOpen,
    closeSectionLibrary,
  } = useBuilderStore();
  
  const [generatedCode, setGeneratedCode] = React.useState<Record<string, string> | null>(null);

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
      <div className="relative h-screen w-full bg-background text-text-primary">
        <Canvas />
        <button 
          onClick={togglePreviewMode}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-secondary-gray text-text-primary rounded-lg shadow-lg border border-border-color hover:bg-border-color"
        >
          <X size={16} />
          Exit Preview
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen w-full bg-background text-text-primary">
        <EditorHeader onExport={handleExport} />
        <div className="flex flex-grow overflow-hidden">
          <div className="w-[340px] flex-shrink-0">
            <LeftSidebar />
          </div>
          <main className="flex-1 flex flex-col overflow-hidden">
            <Canvas />
            <Breadcrumbs />
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
        <SectionLibraryModal 
          isOpen={isSectionLibraryOpen}
          onClose={closeSectionLibrary}
        />
        <ImageManagerModal />
        <IconPickerModal />
      </div>
    </DndProvider>
  );
};

export default BuilderPage;
