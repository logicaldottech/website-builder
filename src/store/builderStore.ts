import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import { Component, ComponentProps, DraggableComponentType, LayoutType, ComponentType, ComponentStyle } from '../types/builder';
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
  let component: Component = components[path[0]];
  for (let i = 1; i < path.length; i++) {
     // @ts-ignore
    component = component.children[path[i]];
  }
  return component;
};

export interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
  device: Device;
  activeTab: ActiveTab;
  isExportModalOpen: boolean;

  // Actions
  selectComponent: (id: string | null) => void;
  setDevice: (device: Device) => void;
  setActiveTab: (tab: ActiveTab) => void;
  
  addComponent: (type: DraggableComponentType, parentId: string | null) => void;
  addLayout: (type: LayoutType, parentId: string | null) => void;
  updateComponentProps: (componentId: string, newProps: Partial<ComponentProps>) => void;
  updateComponentStyle: (componentId: string, style: Partial<ComponentStyle>) => void;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;
  moveComponent: (draggedId: string, targetId: string) => void;
  
  clearCanvas: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set, get) => ({
      components: defaultComponents,
      selectedComponentId: null,
      device: 'desktop',
      activeTab: 'components',
      isExportModalOpen: false,

      selectComponent: (id) => set(produce(draft => {
        draft.selectedComponentId = id;
        if (id) {
          draft.activeTab = 'styles';
        }
      })),
      
      setDevice: (device) => set({ device }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addComponent: (type, parentId) => set(produce(draft => {
        const isLayoutComponent = type === 'Row' || type === 'Column';
        const componentType: ComponentType = isLayoutComponent ? 'Container' : type as ComponentType;
        
        const newComponent: Component = {
          id: nanoid(),
          type: componentType,
          parent: parentId,
          props: {
            text: (type === 'Heading' || type === 'Paragraph') ? `This is a ${type.toLowerCase()}` : type === 'Button' ? 'Click Me' : undefined,
            src: type === 'Image' ? 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/EEE/31343C' : undefined,
            icon: type === 'Icon' ? 'Smile' : undefined,
            href: type === 'Link' ? '#' : undefined,
            style: {
              desktop: {
                padding: (type === 'Container' || type === 'Row' || type === 'Column' || type === 'Link') ? '16px' : '4px',
                margin: '0px',
                height: type === 'Spacer' ? '20px' : undefined,
                ...(type === 'Row' && { display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }),
                ...(type === 'Column' && { display: 'flex', flexDirection: 'column', gap: '16px' }),
                ...(componentType === 'Container' && !isLayoutComponent && { display: 'flex', flexDirection: 'column', gap: '8px' }),
              }
            },
          },
          ...( (componentType === 'Container' || componentType === 'Link') && { children: [] }),
        };

        if (!parentId) {
          draft.components.push(newComponent);
        } else {
          const pathResult = findComponentPath(parentId, draft.components);
          if (pathResult) {
            const parent = getComponentAtPath(pathResult.path, draft.components);
            if (parent.type === 'Container' || parent.type === 'Link') {
              if (!parent.children) parent.children = [];
              parent.children.push(newComponent);
            }
          }
        }
      })),
      
      addLayout: (type, parentId) => set(produce(draft => {
        if (type === 'TwoColumn') {
          const containerId = nanoid();
          const col1Id = nanoid();
          const col2Id = nanoid();

          const layoutContainer: Component = {
            id: containerId,
            type: 'Container',
            parent: parentId,
            props: {
              style: {
                desktop: { display: 'flex', flexDirection: 'row', gap: '16px', padding: '16px' }
              }
            },
            children: [
              {
                id: col1Id,
                type: 'Container',
                parent: containerId,
                props: { style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', border: '1px dashed #D1D5DB' } } },
                children: []
              },
              {
                id: col2Id,
                type: 'Container',
                parent: containerId,
                props: { style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', border: '1px dashed #D1D5DB' } } },
                children: []
              }
            ]
          };

          if (!parentId) {
            draft.components.push(layoutContainer);
          } else {
            const pathResult = findComponentPath(parentId, draft.components);
            if (pathResult) {
              const parent = getComponentAtPath(pathResult.path, draft.components);
              if (parent.children) {
                parent.children.push(layoutContainer);
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
          const newComp: Component = {
            ...JSON.parse(JSON.stringify(comp)), // Deep copy
            id: newId,
            children: comp.children ? comp.children.map(c => duplicateRecursive(c)) : undefined
          };
          if (newComp.children) {
            newComp.children.forEach(child => child.parent = newId);
          }
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

      moveComponent: (draggedId, targetId) => set(produce(draft => {
        const draggedPathResult = findComponentPath(draggedId, draft.components);
        if (!draggedPathResult) return;
        const draggedComponent = JSON.parse(JSON.stringify(getComponentAtPath(draggedPathResult.path, draft.components)));
        
        const oldParentId = draggedComponent.parent;
        if (oldParentId) {
          const oldParentPath = findComponentPath(oldParentId, draft.components);
          if (oldParentPath) {
            const oldParent = getComponentAtPath(oldParentPath.path, draft.components);
            oldParent.children = oldParent.children?.filter(c => c.id !== draggedId);
          }
        } else {
          draft.components = draft.components.filter(c => c.id !== draggedId);
        }
        
        const targetPathResult = findComponentPath(targetId, draft.components);
        if (!targetPathResult) return;
        const newParentId = getComponentAtPath(targetPathResult.path, draft.components).parent;
        draggedComponent.parent = newParentId;

        if (newParentId) {
           const newParentPath = findComponentPath(newParentId, draft.components);
           if (newParentPath) {
             const newParent = getComponentAtPath(newParentPath.path, draft.components);
             const targetIndex = newParent.children!.findIndex(c => c.id === targetId);
             newParent.children!.splice(targetIndex, 0, draggedComponent);
           }
        } else {
           const targetIndex = draft.components.findIndex(c => c.id === targetId);
           draft.components.splice(targetIndex, 0, draggedComponent);
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

export const useTemporalStore = create(useBuilderStore.temporal);
