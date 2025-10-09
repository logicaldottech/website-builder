import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes, DraggableComponentType, LayoutType, BlockType } from '../../types/builder';
import RenderedComponent from './RenderedComponent';
import InsertionPoint from './InsertionPoint';
import { useBuilderStore } from '../../store/builderStore';
import { PlusCircle } from 'lucide-react';

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const Canvas: React.FC = () => {
  const { components, addComponent, addLayout, addBlock, selectComponent, device, isPreviewMode } = useBuilderStore();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.COMPONENT, ItemTypes.LAYOUT, ItemTypes.BLOCK],
    drop: (item: { type: DraggableComponentType | LayoutType | BlockType }, monitor) => {
      if (!monitor.didDrop() && monitor.isOver({ shallow: true })) {
        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.COMPONENT) {
          addComponent(item.type as DraggableComponentType, null);
        } else if (itemType === ItemTypes.LAYOUT) {
          addLayout(item.type as LayoutType, null);
        } else if (itemType === ItemTypes.BLOCK) {
          addBlock(item.type as BlockType, null);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  const canvasWrapperClass = isPreviewMode 
    ? "flex-grow bg-white text-black"
    : "flex-grow bg-surface-alt flex items-start justify-center overflow-auto p-8";

  const canvasClass = isPreviewMode
    ? "bg-white text-black"
    : "bg-white text-black shadow-lg transition-all duration-300 transform origin-top relative";

  return (
    <div className={canvasWrapperClass}>
      <div
        ref={drop}
        onClick={handleCanvasClick}
        className={canvasClass}
        style={{ width: deviceWidths[device], minHeight: isPreviewMode ? '100vh' : 'calc(100vh - 128px)' }}
      >
        {components.length === 0 && !isPreviewMode ? (
          <div className={`flex items-center justify-center h-full pointer-events-none py-48 transition-colors border-2 border-dashed rounded-lg ${isOver && canDrop ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <div className="text-center text-text-muted">
              <PlusCircle size={40} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text">Empty Canvas</h3>
              <p className="mt-2 text-sm">Drag components from the 'Add' panel to start building.</p>
            </div>
          </div>
        ) : (
          <div className={isPreviewMode ? '' : 'p-0'}>
            <InsertionPoint parentId={null} index={0} />
            {components.map((component, index) => (
              <React.Fragment key={component.id}>
                <RenderedComponent 
                  component={component} 
                  index={index}
                  path={[index]}
                />
                <InsertionPoint parentId={null} index={index + 1} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
