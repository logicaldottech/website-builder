import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import { Component, ComponentProps, DraggableComponentType, LayoutType, BlockType, ComponentType, ComponentStyle, GlobalColorState } from '../types/builder';
import { nanoid } from 'nanoid';

export type Device = 'desktop' | 'tablet' | 'mobile';
export type ActiveTab = 'layers' | 'components' | 'styles';
export type StyleState = 'desktop' | 'tablet' | 'mobile' | 'hover';

export interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  targetId: string | null;
}

export interface ClipboardState {
  data: Component | Component['props']['style'] | null;
  type: 'component' | 'styles' | null;
}

export interface ConfirmModalState {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
}

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

// Helper to get the full ancestry of a component
export const getComponentAncestry = (id: string, components: Component[]): Component[] => {
  const pathResult = findComponentPath(id, components);
  if (!pathResult) return [];

  const ancestry: Component[] = [];
  let currentChildren = components;
  
  for (const index of pathResult.path) {
    const component = currentChildren[index];
    ancestry.push(component);
    currentChildren = component.children || [];
  }
  
  return ancestry;
};


// Helper to access a component at a given path
const getComponentAtPath = (path: number[], components: Component[]): Component => {
  let component: any = { children: components };
  for (const index of path) {
    component = component.children[index];
  }
  return component;
};

export interface BuilderState extends GlobalColorState {
  components: Component[];
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  editingComponentId: string | null;
  device: Device;
  activeTab: ActiveTab;
  isExportModalOpen: boolean;
  isSectionLibraryOpen: boolean;
  isImageManagerOpen: boolean;
  isIconPickerOpen: boolean;
  imageManagerCallback: ((url: string) => void) | null;
  iconPickerCallback: ((iconName: string) => void) | null;
  userImages: string[];
  isPreviewMode: boolean;
  contextMenu: ContextMenuState;
  clipboard: ClipboardState;
  confirmModal: ConfirmModalState;

  // Actions
  selectComponent: (id: string | null) => void;
  setHoveredComponentId: (id: string | null) => void;
  setEditingComponentId: (id: string | null) => void;
  setDevice: (device: Device) => void;
  setActiveTab: (tab: ActiveTab) => void;
  
  addComponent: (type: DraggableComponentType, parentId: string | null, index?: number) => void;
  addLayout: (type: LayoutType, parentId: string | null, index?: number) => void;
  addBlock: (type: BlockType, parentId: string | null, index?: number) => void;
  addSectionFromBlueprint: (blueprint: Component) => void;
  updateComponentProps: (componentId: string, newProps: Partial<ComponentProps>) => void;
  updateComponentStyle: (componentId: string, style: Partial<ComponentStyle['desktop']>, state?: StyleState) => void;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;
  moveComponent: (draggedId: string, targetId: string, position: 'top' | 'bottom' | 'inside') => void;
  
  clearCanvas: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  openSectionLibrary: () => void;
  closeSectionLibrary: () => void;
  openImageManager: (callback: (url: string) => void) => void;
  closeImageManager: () => void;
  openIconPicker: (callback: (iconName: string) => void) => void;
  closeIconPicker: () => void;
  addUserImage: (url: string) => void;
  togglePreviewMode: () => void;

  openContextMenu: (targetId: string, x: number, y: number) => void;
  closeContextMenu: () => void;
  copyComponent: () => void;
  pasteComponent: () => void;
  copyStyles: () => void;
  pasteStyles: () => void;
  addNewColumnToRow: () => void;
  moveSection: (direction: 'up' | 'down') => void;

  openConfirmModal: (message: string, onConfirm: () => void) => void;
  closeConfirmModal: () => void;

  // Global Color Actions
  updateGlobalColor: (name: string, color: string) => void;
  addSavedColor: (color: string) => void;
  removeSavedColor: (color: string) => void;
  addRecentColor: (color: string) => void;
}

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set, get) => ({
      components: [],
      selectedComponentId: null,
      hoveredComponentId: null,
      editingComponentId: null,
      device: 'desktop',
      activeTab: 'components',
      isExportModalOpen: false,
      isSectionLibraryOpen: false,
      isImageManagerOpen: false,
      isIconPickerOpen: false,
      imageManagerCallback: null,
      iconPickerCallback: null,
      userImages: [],
      isPreviewMode: false,
      contextMenu: { isVisible: false, x: 0, y: 0, targetId: null },
      clipboard: { data: null, type: null },
      confirmModal: { isOpen: false, message: '', onConfirm: null },
      globalColors: {
        primary: '#64748b',
        secondary: '#1e293b',
        text: '#f1f5f9',
        background: '#0f172a',
        accent: '#FBBF24',
      },
      savedColors: [],
      recentColors: [],

      selectComponent: (id) => set(produce(draft => {
        draft.selectedComponentId = id;
        if (id && draft.editingComponentId !== id) {
          draft.activeTab = 'styles';
        }
      })),
      
      setHoveredComponentId: (id) => set({ hoveredComponentId: id }),
      setEditingComponentId: (id) => set({ editingComponentId: id }),
      setDevice: (device) => set({ device }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      togglePreviewMode: () => set(state => ({ isPreviewMode: !state.isPreviewMode })),

      openContextMenu: (targetId, x, y) => set({ contextMenu: { isVisible: true, targetId, x, y } }),
      closeContextMenu: () => set(produce(draft => { draft.contextMenu.isVisible = false; })),

      openConfirmModal: (message, onConfirm) => set({ confirmModal: { isOpen: true, message, onConfirm } }),
      closeConfirmModal: () => set({ confirmModal: { isOpen: false, message: '', onConfirm: null } }),

      copyComponent: () => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        if (!targetId) return;
        const pathResult = findComponentPath(targetId, draft.components);
        if (pathResult) {
          const componentToCopy = getComponentAtPath(pathResult.path, draft.components);
          draft.clipboard = { data: JSON.parse(JSON.stringify(componentToCopy)), type: 'component' };
        }
      })),

      pasteComponent: () => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        const { clipboard } = draft;
        if (!targetId || clipboard.type !== 'component' || !clipboard.data) return;

        const duplicateRecursive = (comp: Component): Component => {
          const newId = nanoid();
          const newComp: Component = { ...JSON.parse(JSON.stringify(comp)), id: newId, children: comp.children ? comp.children.map(c => duplicateRecursive(c)) : undefined };
          if (newComp.children) { newComp.children.forEach(child => child.parent = newId); }
          return newComp;
        };

        const newComponent = duplicateRecursive(clipboard.data as Component);
        
        const targetPathResult = findComponentPath(targetId, draft.components);
        if (!targetPathResult) return;

        const parentId = targetPathResult.component.parent;
        const parentPathResult = parentId ? findComponentPath(parentId, draft.components) : null;
        
        if (parentPathResult) {
          const parent = getComponentAtPath(parentPathResult.path, draft.components);
          const targetIndex = parent.children!.findIndex(c => c.id === targetId);
          parent.children!.splice(targetIndex + 1, 0, newComponent);
          newComponent.parent = parent.id;
        } else {
          const targetIndex = draft.components.findIndex(c => c.id === targetId);
          draft.components.splice(targetIndex + 1, 0, newComponent);
          newComponent.parent = null;
        }
      })),

      copyStyles: () => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        if (!targetId) return;
        const pathResult = findComponentPath(targetId, draft.components);
        if (pathResult) {
          const componentToCopy = getComponentAtPath(pathResult.path, draft.components);
          draft.clipboard = { data: JSON.parse(JSON.stringify(componentToCopy.props.style)), type: 'styles' };
        }
      })),

      pasteStyles: () => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        const { clipboard } = draft;
        if (!targetId || clipboard.type !== 'styles' || !clipboard.data) return;

        const pathResult = findComponentPath(targetId, draft.components);
        if (pathResult) {
          const targetComponent = getComponentAtPath(pathResult.path, draft.components);
          targetComponent.props.style = clipboard.data as ComponentStyle;
        }
      })),

      addNewColumnToRow: () => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        if (!targetId) return;
        const pathResult = findComponentPath(targetId, draft.components);
        if (pathResult && pathResult.component.type === 'Row') {
          const rowComponent = getComponentAtPath(pathResult.path, draft.components);
          if (!rowComponent.children) rowComponent.children = [];
          const newColumn: Component = {
            id: nanoid(),
            type: 'Column',
            parent: rowComponent.id,
            props: {
              htmlTag: 'div',
              style: {
                desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }
              }
            },
            children: []
          };
          rowComponent.children.push(newColumn);
        }
      })),

      moveSection: (direction) => set(produce(draft => {
        const { targetId } = draft.contextMenu;
        if (!targetId) return;
        const index = draft.components.findIndex(c => c.id === targetId);
        if (index === -1 || draft.components[index].type !== 'Section') return;

        if (direction === 'up' && index > 0) {
          [draft.components[index - 1], draft.components[index]] = [draft.components[index], draft.components[index - 1]];
        } else if (direction === 'down' && index < draft.components.length - 1) {
          [draft.components[index], draft.components[index + 1]] = [draft.components[index + 1], draft.components[index]];
        }
      })),

      addComponent: (type, parentId, index) => set(produce(draft => {
        const newComponent: Component = {
          id: nanoid(),
          type: type,
          parent: parentId,
          props: {
            text: (type === 'Heading' || type === 'Paragraph') ? `This is a ${type.toLowerCase()}` : type === 'Button' ? 'Click Me' : type === 'Link' ? 'Link Text' : undefined,
            src: type === 'Image' ? 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/EEE/31343C' : type === 'Video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
            altText: type === 'Image' ? 'Placeholder Image' : undefined,
            icon: type === 'Icon' ? 'Smile' : undefined,
            href: type === 'Link' ? '#' : undefined,
            linkTarget: '_self',
            iconPosition: 'before',
            htmlTag: type === 'Section' ? 'section' : type === 'Heading' ? 'h1' : type === 'Paragraph' ? 'p' : 'div',
            style: {
              desktop: {
                ...(type === 'Heading' && { margin: '0', fontSize: '36px', fontWeight: '700' }),
                ...(type === 'Paragraph' && { margin: '0', fontSize: '16px', lineHeight: '1.6' }),
                ...(type === 'Button' && { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', backgroundColor: '#64748b', color: '#FFFFFF', fontWeight: '600' }),
                ...(type === 'Image' && { width: '100%', objectFit: 'cover' }),
                ...(type === 'Icon' && { color: '#f1f5f9', fontSize: '48px' }),
                ...(type === 'Divider' && { height: '1px', width: '100%', backgroundColor: '#94a3b8' }),
                ...(type === 'Video' && { width: '100%', aspectRatio: '16 / 9' }),
                ...(type === 'Section' && { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '64px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px' }),
                ...(type === 'Container' && { width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '16px' }),
                ...(type === 'Row' && { width: '100%', display: 'flex', flexDirection: 'row', gap: '16px' }),
                ...(type === 'Column' && { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }),
              },
              hover: {
                ...(type === 'Button' && { opacity: '0.9' }),
              }
            },
            ...(type === 'Section' && {
              sectionSpecificProps: {
                background: {
                  type: 'color',
                  color: 'transparent'
                }
              }
            }),
          },
          ...( ['Section', 'Container', 'Row', 'Column', 'Link'].includes(type) && { children: [] }),
        };

        if (!parentId) {
          const insertIndex = index !== undefined ? index : draft.components.length;
          draft.components.splice(insertIndex, 0, newComponent);
        } else {
          const pathResult = findComponentPath(parentId, draft.components);
          if (pathResult) {
            const parent = getComponentAtPath(pathResult.path, draft.components);
            if (['Section', 'Container', 'Row', 'Column', 'Link'].includes(parent.type)) {
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
            props: { htmlTag: 'div', style: { desktop: { display: 'flex', flexDirection: 'row', gap: '16px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' } } },
            children: [
              { id: nanoid(), type: 'Container', parent: containerId, props: { htmlTag: 'div', style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' } } }, children: [] },
              { id: nanoid(), type: 'Container', parent: containerId, props: { htmlTag: 'div', style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' } } }, children: [] }
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
              htmlTag: 'div',
              style: {
                desktop: {
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  width: '320px',
                }
              }
            },
            children: [
              { id: nanoid(), type: 'Image', parent: cardId, props: { htmlTag: 'div', src: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x250/EEE/31343C', style: { desktop: { borderRadius: '12px 12px 0 0' } } } },
              {
                id: nanoid(), type: 'Container', parent: cardId, props: {
                  htmlTag: 'div',
                  style: {
                    desktop: {
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px',
                    }
                  }
                }, children: [
                  { id: nanoid(), type: 'Heading', parent: cardId, props: { htmlTag: 'h2', text: 'Card Title', style: { desktop: { fontSize: '20px' } } } },
                  { id: nanoid(), type: 'Paragraph', parent: cardId, props: { htmlTag: 'p', text: 'This is a short description for the card component.', style: { desktop: { color: '#94a3b8', fontSize: '14px' } } } },
                  { id: nanoid(), type: 'Button', parent: cardId, props: { htmlTag: 'div', text: 'Learn More', style: { desktop: { backgroundColor: '#64748b', color: '#FFFFFF', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px', borderRadius: '8px', marginTop: '16px' } } } },
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

      addSectionFromBlueprint: (blueprint) => set(produce(draft => {
        draft.components.push(blueprint);
      })),

      updateComponentProps: (componentId, newProps) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (pathResult) {
          const component = getComponentAtPath(pathResult.path, draft.components);
          Object.assign(component.props, newProps);
        }
      })),

      updateComponentStyle: (componentId, style, state) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (pathResult) {
          const component = getComponentAtPath(pathResult.path, draft.components);
          const styleState = state || get().device;
          if (!component.props.style[styleState]) {
            component.props.style[styleState] = {};
          }
          Object.assign(component.props.style[styleState], style);
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
        
        const draggedPath = draggedPathResult.path;
        if (draggedPath.length === 1) { draft.components.splice(draggedPath[0], 1); } 
        else {
          const parentPath = draggedPath.slice(0, -1);
          const parent = getComponentAtPath(parentPath, draft.components);
          parent.children?.splice(draggedPath[draggedPath.length - 1], 1);
        }

        const targetPathResult = findComponentPath(targetId, draft.components);
        if (!targetPathResult) return;
        const targetComponent = targetPathResult.component;
        const targetPath = targetPathResult.path;

        if (position === 'inside' && (['Section', 'Container', 'Row', 'Column', 'Link'].includes(targetComponent.type))) {
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
      openSectionLibrary: () => set({ isSectionLibraryOpen: true }),
      closeSectionLibrary: () => set({ isSectionLibraryOpen: false }),
      openImageManager: (callback) => set({ isImageManagerOpen: true, imageManagerCallback: callback }),
      closeImageManager: () => set({ isImageManagerOpen: false, imageManagerCallback: null }),
      openIconPicker: (callback) => set({ isIconPickerOpen: true, iconPickerCallback: callback }),
      closeIconPicker: () => set({ isIconPickerOpen: false, iconPickerCallback: null }),
      addUserImage: (url) => set(produce(draft => { draft.userImages.unshift(url) })),

      // Global Color Actions
      updateGlobalColor: (name, color) => set(produce(draft => { draft.globalColors[name] = color; })),
      addSavedColor: (color) => set(produce(draft => { if (!draft.savedColors.includes(color)) draft.savedColors.unshift(color); })),
      removeSavedColor: (color) => set(produce(draft => { draft.savedColors = draft.savedColors.filter(c => c !== color); })),
      addRecentColor: (color) => set(produce(draft => {
        draft.recentColors = [color, ...draft.recentColors.filter(c => c !== color)].slice(0, 10);
      })),
    }),
    {
      partialize: (state) => {
        const { components, selectedComponentId, globalColors, savedColors, recentColors, userImages } = state;
        return { components, selectedComponentId, globalColors, savedColors, recentColors, userImages };
      },
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
