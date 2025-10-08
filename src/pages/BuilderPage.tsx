import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditorHeader from '../components/builder/EditorHeader';
import LeftSidebar from '../components/builder/LeftSidebar';
import Canvas from '../components/builder/Canvas';
import { useBuilderStore } from '../store/builderStore';
import ComponentContextMenu from '../components/builder/ComponentContextMenu';
import ExportModal from '../components/builder/ExportModal';
import { generatePageTsx, generatePackageJson, generateTailwindConfig, generateGlobalCss } from '../utils/generateNextJsCode';

const BuilderPage: React.FC = () => {
  const { 
    components, 
    isExportModalOpen, 
    openExportModal, 
    closeExportModal 
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
          </main>
        </div>
        <ComponentContextMenu />
        {generatedCode && (
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={closeExportModal}
            generatedCode={generatedCode}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default BuilderPage;
