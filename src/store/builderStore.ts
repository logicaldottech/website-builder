import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import { Component, ComponentProps, DraggableComponentType, LayoutType, BlockType, ComponentType, ComponentStyle } from '../types/builder';
import { nanoid } from 'nanoid';
import { defaultComponents } from '../data/defaultTemplate';

export type Device = 'desktop' | 'tablet' | 'mobile';
export type ActiveTab = 'layers' | 'components' | 'styles';

// Helper to find a component and its parent/index in a nested structure
export const findComponentPath = (id: string, components: Component[]): { path: number[], component: Component } | null => {
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    if (component.id === id) {
      return { path: [i], component };
    }
    if (component.children) {
      const found = findComponentPath(id, component.children);
      if (found) {
        return { path: [i, ...found.path], component: found.component };
      }
    }
  }
  return null;
};

// Helper to access a component at a given path
const getComponentAtPath = (path: number[], components: Component[]): Component => {
  let component: any = { children: components };
  for (const index of path) {
    component = component.children[index];
  }
  return component;
};

export interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
  editingComponentId: string | null;
  device: Device;
  activeTab: ActiveTab;
  isExportModalOpen: boolean;
  isPreviewMode: boolean;

  // Actions
  selectComponent: (id: string | null) => void;
  setEditingComponentId: (id: string | null) => void;
  setDevice: (device: Device) => void;
  setActiveTab: (tab: ActiveTab) => void;
  
  addComponent: (type: DraggableComponentType, parentId: string | null, index?: number) => void;
  addLayout: (type: LayoutType, parentId: string | null, index?: number) => void;
  addBlock: (type: BlockType, parentId: string | null, index?: number) => void;
  updateComponentProps: (componentId: string, newProps: Partial<ComponentProps>) => void;
  updateComponentStyle: (componentId: string, style: Partial<ComponentStyle['desktop']>) => void;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;
  moveComponent: (draggedId: string, targetId: string, position: 'top' | 'bottom' | 'inside') => void;
  
  clearCanvas: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  togglePreviewMode: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set, get) => ({
      components: defaultComponents,
      selectedComponentId: null,
      editingComponentId: null,
      device: 'desktop',
      activeTab: 'components',
      isExportModalOpen: false,
      isPreviewMode: false,

      selectComponent: (id) => set(produce(draft => {
        draft.selectedComponentId = id;
        if (id && draft.editingComponentId !== id) {
          draft.activeTab = 'styles';
        }
      })),
      
      setEditingComponentId: (id) => set({ editingComponentId: id }),
      setDevice: (device) => set({ device }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      togglePreviewMode: () => set(state => ({ isPreviewMode: !state.isPreviewMode })),

      addComponent: (type, parentId, index) => set(produce(draft => {
        const isLayoutComponent = type === 'Row' || type === 'Column';
        const componentType: ComponentType = isLayoutComponent ? 'Container' : type as ComponentType;
        
        const newComponent: Component = {
          id: nanoid(),
          type: componentType,
          parent: parentId,
          props: {
            text: (type === 'Heading' || type === 'Paragraph') ? `This is a ${type.toLowerCase()}` : type === 'Button' ? 'Click Me' : undefined,
            src: type === 'Image' ? 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/EEE/31343C' : type === 'Video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
            icon: type === 'Icon' ? 'Smile' : undefined,
            href: type === 'Link' ? '#' : undefined,
            style: {
              desktop: {
                paddingTop: (type === 'Container' || type === 'Row' || type === 'Column' || type === 'Link') ? '16px' : '4px',
                paddingBottom: (type === 'Container' || type === 'Row' || type === 'Column' || type === 'Link') ? '16px' : '4px',
                paddingLeft: (type === 'Container' || type === 'Row' || type === 'Column' || type === 'Link') ? '16px' : '4px',
                paddingRight: (type === 'Container' || type === 'Row' || type === 'Column' || type === 'Link') ? '16px' : '4px',
                height: type === 'Divider' ? '1px' : undefined,
                width: type === 'Divider' ? '100%' : type === 'Video' ? '100%' : undefined,
                backgroundColor: type === 'Divider' ? '#A0A0A0' : undefined,
                aspectRatio: type === 'Video' ? '16 / 9' : undefined,
                ...(type === 'Row' && { display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }),
                ...(type === 'Column' && { display: 'flex', flexDirection: 'column', gap: '16px' }),
                ...(componentType === 'Container' && !isLayoutComponent && { display: 'flex', flexDirection: 'column', gap: '8px' }),
              }
            },
          },
          ...( (componentType === 'Container' || componentType === 'Link') && { children: [] }),
        };

        if (!parentId) {
          const insertIndex = index !== undefined ? index : draft.components.length;
          draft.components.splice(insertIndex, 0, newComponent);
        } else {
          const pathResult = findComponentPath(parentId, draft.components);
          if (pathResult) {
            const parent = getComponentAtPath(pathResult.path, draft.components);
            if (parent.type === 'Container' || parent.type === 'Link') {
              if (!parent.children) parent.children = [];
              const insertIndex = index !== undefined ? index : parent.children.length;
              parent.children.splice(insertIndex, 0, newComponent);
            }
          }
        }
      })),
      
      addLayout: (type, parentId, index) => set(produce(draft => {
        if (type === 'TwoColumn') {
          const containerId = nanoid();
          const layoutContainer: Component = {
            id: containerId,
            type: 'Container',
            parent: parentId,
            props: { style: { desktop: { display: 'flex', flexDirection: 'row', gap: '16px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' } } },
            children: [
              { id: nanoid(), type: 'Container', parent: containerId, props: { style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', border: '1px dashed #D1D5DB' } } }, children: [] },
              { id: nanoid(), type: 'Container', parent: containerId, props: { style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', border: '1px dashed #D1D5DB' } } }, children: [] }
            ]
          };

          if (!parentId) {
            const insertIndex = index !== undefined ? index : draft.components.length;
            draft.components.splice(insertIndex, 0, layoutContainer);
          } else {
            const pathResult = findComponentPath(parentId, draft.components);
            if (pathResult) {
              const parent = getComponentAtPath(pathResult.path, draft.components);
              if (parent.children) {
                const insertIndex = index !== undefined ? index : parent.children.length;
                parent.children.splice(insertIndex, 0, layoutContainer);
              }
            }
          }
        }
      })),

      addBlock: (type, parentId, index) => set(produce(draft => {
        let newBlock: Component | null = null;
        if (type === 'Card') {
          const cardId = nanoid();
          newBlock = {
            id: cardId,
            type: 'Container',
            parent: parentId,
            props: {
              style: {
                desktop: {
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#15141A',
                  borderRadius: '12px',
                  border: '1px solid #2A292F',
                  width: '320px',
                }
              }
            },
            children: [
              { id: nanoid(), type: 'Image', parent: cardId, props: { src: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x250/EEE/31343C', style: { desktop: { borderRadius: '12px 12px 0 0' } } } },
              {
                id: nanoid(), type: 'Container', parent: cardId, props: {
                  style: {
                    desktop: {
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px',
                    }
                  }
                }, children: [
                  { id: nanoid(), type: 'Heading', parent: cardId, props: { text: 'Card Title', style: { desktop: { fontSize: '20px' } } } },
                  { id: nanoid(), type: 'Paragraph', parent: cardId, props: { text: 'This is a short description for the card component.', style: { desktop: { color: '#A0A0A0', fontSize: '14px' } } } },
                  { id: nanoid(), type: 'Button', parent: cardId, props: { text: 'Learn More', style: { desktop: { backgroundColor: '#6E42E8', color: '#FFFFFF', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px', borderRadius: '8px', marginTop: '16px' } } } },
                ]
              }
            ]
          };
        }

        if (newBlock) {
          if (!parentId) {
            const insertIndex = index !== undefined ? index : draft.components.length;
            draft.components.splice(insertIndex, 0, newBlock);
          } else {
            const pathResult = findComponentPath(parentId, draft.components);
            if (pathResult) {
              const parent = getComponentAtPath(pathResult.path, draft.components);
              if (parent.children) {
                const insertIndex = index !== undefined ? index : parent.children.length;
                parent.children.splice(insertIndex, 0, newBlock);
              }
            }
          }
        }
      })),

      updateComponentProps: (componentId, newProps) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (pathResult) {
          const component = getComponentAtPath(pathResult.path, draft.components);
          Object.assign(component.props, newProps);
        }
      })),

      updateComponentStyle: (componentId, style) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (pathResult) {
          const component = getComponentAtPath(pathResult.path, draft.components);
          const device = get().device;
          if (!component.props.style[device]) {
            component.props.style[device] = {};
          }
          Object.assign(component.props.style[device], style);
        }
      })),

      deleteComponent: (componentId) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (!pathResult) return;
        
        const parentId = getComponentAtPath(pathResult.path, draft.components).parent;
        if (!parentId) {
          draft.components = draft.components.filter(c => c.id !== componentId);
        } else {
          const parentPathResult = findComponentPath(parentId, draft.components);
          if (parentPathResult) {
            const parent = getComponentAtPath(parentPathResult.path, draft.components);
            parent.children = parent.children?.filter(c => c.id !== componentId);
          }
        }
        if (draft.selectedComponentId === componentId) {
          draft.selectedComponentId = null;
        }
      })),
      
      duplicateComponent: (componentId) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (!pathResult) return;
        
        const originalComponent = getComponentAtPath(pathResult.path, draft.components);
        
        const duplicateRecursive = (comp: Component): Component => {
          const newId = nanoid();
          const newComp: Component = { ...JSON.parse(JSON.stringify(comp)), id: newId, children: comp.children ? comp.children.map(c => duplicateRecursive(c)) : undefined };
          if (newComp.children) { newComp.children.forEach(child => child.parent = newId); }
          return newComp;
        };
        
        const newComponent = duplicateRecursive(originalComponent);
        const parentId = originalComponent.parent;
        const parentPathResult = parentId ? findComponentPath(parentId, draft.components) : null;
        
        if (parentPathResult) {
          const parent = getComponentAtPath(parentPathResult.path, draft.components);
          const originalIndex = parent.children!.findIndex(c => c.id === componentId);
          parent.children!.splice(originalIndex + 1, 0, newComponent);
        } else {
          const originalIndex = draft.components.findIndex(c => c.id === componentId);
          draft.components.splice(originalIndex + 1, 0, newComponent);
        }
      })),

      moveComponent: (draggedId, targetId, position) => set(produce(draft => {
        if (draggedId === targetId) return;
        const draggedPathResult = findComponentPath(draggedId, draft.components);
        if (!draggedPathResult) return;
        const componentToMove = JSON.parse(JSON.stringify(getComponentAtPath(draggedPathResult.path, draft.components)));
        
        // Remove from original position
        const draggedPath = draggedPathResult.path;
        if (draggedPath.length === 1) { draft.components.splice(draggedPath[0], 1); } 
        else {
          const parentPath = draggedPath.slice(0, -1);
          const parent = getComponentAtPath(parentPath, draft.components);
          parent.children?.splice(draggedPath[draggedPath.length - 1], 1);
        }

        // Find target and insert
        const targetPathResult = findComponentPath(targetId, draft.components);
        if (!targetPathResult) return;
        const targetComponent = targetPathResult.component;
        const targetPath = targetPathResult.path;

        if (position === 'inside' && (targetComponent.type === 'Container' || targetComponent.type === 'Link')) {
            const target = getComponentAtPath(targetPath, draft.components);
            if (!target.children) target.children = [];
            componentToMove.parent = target.id;
            target.children.push(componentToMove);
        } else {
            const parentPath = targetPath.slice(0, -1);
            const childIndex = targetPath[targetPath.length - 1];
            const insertIndex = position === 'top' ? childIndex : childIndex + 1;
            
            if (parentPath.length === 0) {
                componentToMove.parent = null;
                draft.components.splice(insertIndex, 0, componentToMove);
            } else {
                const parent = getComponentAtPath(parentPath, draft.components);
                componentToMove.parent = parent.id;
                parent.children?.splice(insertIndex, 0, componentToMove);
            }
        }
      })),

      clearCanvas: () => set({ components: [] }),
      openExportModal: () => set({ isExportModalOpen: true }),
      closeExportModal: () => set({ isExportModalOpen: false }),
    }),
    {
      partialize: (state) => {
        const { components, selectedComponentId } = state;
        return { components, selectedComponentId };
      },
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
