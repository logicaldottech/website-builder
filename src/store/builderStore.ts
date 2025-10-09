import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import { Component, ComponentProps, DraggableComponentType, LayoutType, BlockType, ComponentType, ComponentStyle, GlobalColorState, ContainerProps, SectionProps, WidgetType } from '../types/builder';
import { nanoid } from 'nanoid';
import { designSpec } from '../data/designSpec';
import { LayoutItem } from '../types/layouts';
import { convertPresetToComponent } from '../utils/layoutConverter';
import * as elementBlueprints from '../data/elementBlueprints';
import { generateLayoutFromPrompt as generateLayoutFromPromptService } from '../services/aiLayoutGenerator';

export type Device = 'desktop' | 'tablet' | 'mobile';
export type ActiveSidebarTab = 'layers' | 'add' | 'properties';
export type ActivePropertiesTab = 'Style' | 'Settings' | 'Interactions';
export type StyleState = 'desktop' | 'tablet' | 'mobile' | 'hover';
export type Theme = 'light' | 'dark';

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
  options?: {
    confirmText?: string;
    cancelText?: string;
  }
}

// Helper to recursively assign new IDs
export const assignNewIds = (component: Component): Component => {
  const newId = nanoid();
  const newComponent: Component = { ...component, id: newId };
  if (component.children) {
    newComponent.children = component.children.map(child => {
      const newChild = assignNewIds(child);
      newChild.parent = newId;
      return newChild;
    });
  }
  return newComponent;
};


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

// V2 MIGRATION LOGIC
export const migrateStateToV2 = (state: BuilderState): BuilderState => {
  // Check if migration has already run to prevent re-running on HMR
  if ((state as any).schemaVersion === 2) {
    return state;
  }

  const migratedComponents = state.components.map(component => {
    if (component.type === 'Section' && (!component.children || component.children.length === 0 || component.children[0].type !== 'Container')) {
      // This is an old section that needs migration
      const newContainerId = nanoid();
      
      const oldDesktopStyle = component.props.style?.desktop || {};
      const oldTabletStyle = component.props.style?.tablet || {};
      const oldMobileStyle = component.props.style?.mobile || {};
      
      const newContainer: Component = {
        id: newContainerId,
        type: 'Container',
        parent: component.id,
        props: {
          containerProps: {
            maxWidth: 'lg',
            align: 'center',
            paddingX: { lg: oldDesktopStyle.paddingLeft || '16px', md: oldTabletStyle.paddingLeft || '16px', sm: oldMobileStyle.paddingLeft || '16px' },
            rowGap: oldDesktopStyle.gap || '0px',
            columnGap: oldDesktopStyle.gap || '0px',
          },
          style: {
            desktop: {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }
          }
        },
        children: component.children || [],
      };
      
      // Update children's parent ID
      if (newContainer.children) {
        newContainer.children.forEach(child => child.parent = newContainerId);
      }

      // Create new section props
      const newSectionProps: SectionProps = {
        paddingY: { lg: oldDesktopStyle.paddingTop || '64px', md: oldTabletStyle.paddingTop || '40px', sm: oldMobileStyle.paddingTop || '24px' },
        background: component.props.sectionSpecificProps?.background || { type: 'none' },
        fullBleed: false,
        htmlTag: 'section',
      };
      
      // Update the original section component
      component.children = [newContainer];
      component.props.sectionProps = newSectionProps;
      // Clean up old styles from the section itself
      delete component.props.style?.desktop?.paddingLeft;
      delete component.props.style?.desktop?.paddingRight;
      delete component.props.style?.desktop?.gap;
      delete component.props.style?.desktop?.display;
      delete component.props.style?.desktop?.flexDirection;
      delete component.props.style?.desktop?.alignItems;
      delete component.props.style?.desktop?.justifyContent;
      delete component.props.style?.desktop?.maxWidth;
    }
    return component;
  });

  return {
    ...state,
    components: migratedComponents,
    schemaVersion: 2, // Mark that migration has run
  } as BuilderState;
};

export interface BuilderState extends GlobalColorState {
  components: Component[];
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  editingComponentId: string | null;
  device: Device;
  activeSidebarTab: ActiveSidebarTab;
  activePropertiesTab: ActivePropertiesTab;
  theme: Theme;
  isExportModalOpen: boolean;
  isImageManagerOpen: boolean;
  isIconPickerOpen: boolean;
  isBlocksGalleryOpen: boolean;
  imageManagerCallback: ((url: string) => void) | null;
  iconPickerCallback: ((iconName: string) => void) | null;
  userImages: string[];
  isPreviewMode: boolean;
  contextMenu: ContextMenuState;
  clipboard: ClipboardState;
  confirmModal: ConfirmModalState;
  designSpec: any;
  schemaVersion?: number;

  // Actions
  selectComponent: (id: string | null) => void;
  setHoveredComponentId: (id: string | null) => void;
  setEditingComponentId: (id: string | null) => void;
  setDevice: (device: Device) => void;
  setActiveSidebarTab: (tab: ActiveSidebarTab) => void;
  setActivePropertiesTab: (tab: ActivePropertiesTab) => void;
  setTheme: (theme: Theme) => void;
  
  addComponent: (type: DraggableComponentType, parentId: string | null, index?: number) => void;
  insertWidget: (type: WidgetType, parentId: string | null, index?: number) => void;
  updateComponentProps: (componentId: string, newProps: Partial<ComponentProps>) => void;
  updateComponentStyle: (componentId: string, style: Partial<ComponentStyle['desktop']>, state?: StyleState) => void;
  updateWidgetVariant: (componentId: string, variant: string) => void;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;
  moveComponent: (draggedId: string, targetId: string, position: 'top' | 'bottom' | 'inside') => void;
  
  clearCanvas: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  openImageManager: (callback: (url: string) => void) => void;
  closeImageManager: () => void;
  openIconPicker: (callback: (iconName: string) => void) => void;
  closeIconPicker: () => void;
  addUserImage: (url: string) => void;
  togglePreviewMode: () => void;
  toggleBlocksGallery: () => void;

  openContextMenu: (targetId: string, x: number, y: number) => void;
  closeContextMenu: () => void;
  copyComponent: () => void;
  pasteComponent: () => void;
  copyStyles: () => void;
  pasteStyles: () => void;
  addNewColumnToRow: () => void;
  moveSection: (direction: 'up' | 'down') => void;

  openConfirmModal: (message: string, onConfirm: () => void, onCancel?: () => void, options?: ConfirmModalState['options']) => void;
  closeConfirmModal: () => void;

  insertGeneratedLayouts: (items: LayoutItem[]) => void;
  generateLayoutFromPrompt: (prompt: string) => Promise<{notes: string[], unsupported: string[]}>;

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
      activeSidebarTab: 'add',
      activePropertiesTab: 'Style',
      theme: 'light',
      isExportModalOpen: false,
      isImageManagerOpen: false,
      isIconPickerOpen: false,
      isBlocksGalleryOpen: false,
      imageManagerCallback: null,
      iconPickerCallback: null,
      userImages: [],
      isPreviewMode: false,
      contextMenu: { isVisible: false, x: 0, y: 0, targetId: null },
      clipboard: { data: null, type: null },
      confirmModal: { isOpen: false, message: '', onConfirm: null },
      designSpec: designSpec,
      globalColors: {
        primary: '#6C63FF',
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
          draft.activeSidebarTab = 'properties';
        }
      })),
      
      setHoveredComponentId: (id) => set({ hoveredComponentId: id }),
      setEditingComponentId: (id) => set({ editingComponentId: id }),
      setDevice: (device) => set({ device }),
      setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
      setActivePropertiesTab: (tab) => set({ activePropertiesTab: tab }),
      setTheme: (theme) => set({ theme }),
      togglePreviewMode: () => set(state => ({ isPreviewMode: !state.isPreviewMode })),
      toggleBlocksGallery: () => set(state => ({ isBlocksGalleryOpen: !state.isBlocksGalleryOpen })),

      openContextMenu: (targetId, x, y) => set({ contextMenu: { isVisible: true, targetId, x, y } }),
      closeContextMenu: () => set(produce(draft => { draft.contextMenu.isVisible = false; })),

      openConfirmModal: (message, onConfirm, onCancel, options) => set({ 
        confirmModal: { isOpen: true, message, onConfirm: () => { onConfirm(); get().closeConfirmModal(); }, options } 
      }),
      closeConfirmModal: () => set({ confirmModal: { isOpen: false, message: '', onConfirm: null, options: undefined } }),

      insertGeneratedLayouts: (items) => set(produce(draft => {
        if (items.length === 0) return;
        const newComponents = items.map(preset => convertPresetToComponent(preset));
        draft.components.push(...newComponents);
        if (newComponents.length > 0) {
          draft.selectedComponentId = newComponents[0].id;
        }
      })),

      generateLayoutFromPrompt: async (prompt) => {
        const result = generateLayoutFromPromptService(prompt);
        if (result.ok) {
          get().insertGeneratedLayouts(result.items);
        }
        return { notes: result.notes, unsupported: result.unsupported_items };
      },

      copyComponent: () => set(produce(draft => {
        const { selectedComponentId } = draft;
        if (!selectedComponentId) return;
        const pathResult = findComponentPath(selectedComponentId, draft.components);
        if (pathResult) {
          const componentToCopy = getComponentAtPath(pathResult.path, draft.components);
          draft.clipboard = { data: JSON.parse(JSON.stringify(componentToCopy)), type: 'component' };
        }
      })),

      pasteComponent: () => set(produce(draft => {
        const { selectedComponentId, clipboard } = draft;
        if (!selectedComponentId || clipboard.type !== 'component' || !clipboard.data) return;

        const newComponent = assignNewIds(clipboard.data as Component);
        
        const targetPathResult = findComponentPath(selectedComponentId, draft.components);
        if (!targetPathResult) return;

        const parentId = targetPathResult.component.parent;
        const parentPathResult = parentId ? findComponentPath(parentId, draft.components) : null;
        
        if (parentPathResult) {
          const parent = getComponentAtPath(parentPathResult.path, draft.components);
          const targetIndex = parent.children!.findIndex(c => c.id === selectedComponentId);
          parent.children!.splice(targetIndex + 1, 0, newComponent);
          newComponent.parent = parent.id;
        } else {
          const targetIndex = draft.components.findIndex(c => c.id === selectedComponentId);
          draft.components.splice(targetIndex + 1, 0, newComponent);
          newComponent.parent = null;
        }
      })),

      copyStyles: () => set(produce(draft => {
        const { selectedComponentId } = draft;
        if (!selectedComponentId) return;
        const pathResult = findComponentPath(selectedComponentId, draft.components);
        if (pathResult) {
          const componentToCopy = getComponentAtPath(pathResult.path, draft.components);
          draft.clipboard = { data: JSON.parse(JSON.stringify(componentToCopy.props.style)), type: 'styles' };
        }
      })),

      pasteStyles: () => set(produce(draft => {
        const { selectedComponentId, clipboard } = draft;
        if (!selectedComponentId || clipboard.type !== 'styles' || !clipboard.data) return;

        const pathResult = findComponentPath(selectedComponentId, draft.components);
        if (pathResult) {
          const targetComponent = getComponentAtPath(pathResult.path, draft.components);
          targetComponent.props.style = clipboard.data as ComponentStyle;
        }
      })),

      addNewColumnToRow: () => set(produce(draft => {
        const { selectedComponentId } = draft;
        if (!selectedComponentId) return;
        const pathResult = findComponentPath(selectedComponentId, draft.components);
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
        const { selectedComponentId } = draft;
        if (!selectedComponentId) return;
        const index = draft.components.findIndex(c => c.id === selectedComponentId);
        if (index === -1 || draft.components[index].type !== 'Section') return;

        if (direction === 'up' && index > 0) {
          [draft.components[index - 1], draft.components[index]] = [draft.components[index], draft.components[index - 1]];
        } else if (direction === 'down' && index < draft.components.length - 1) {
          [draft.components[index], draft.components[index + 1]] = [draft.components[index + 1], draft.components[index]];
        }
      })),

      addComponent: (type, parentId, index) => set(produce(draft => {
        let newComponent: Component;

        if (type === 'Section') {
          const sectionId = nanoid();
          const containerId = nanoid();
          newComponent = {
            id: sectionId,
            type: 'Section',
            parent: null,
            props: {
              sectionProps: {
                paddingY: { lg: '64px', md: '48px', sm: '32px' },
                background: { type: 'none' },
                fullBleed: false,
                htmlTag: 'section',
              },
              style: { desktop: {} }
            },
            children: [{
              id: containerId,
              type: 'Container',
              parent: sectionId,
              props: {
                containerProps: {
                  maxWidth: 'lg',
                  align: 'center',
                  paddingX: { lg: '16px', md: '16px', sm: '16px' },
                  rowGap: '16px',
                  columnGap: '16px',
                },
                style: {
                  desktop: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }
                },
                children: []
              },
              children: []
            }]
          };
        } else {
            newComponent = {
            id: nanoid(),
            type: type,
            parent: parentId,
            props: {
              text: (type === 'Heading' || type === 'Paragraph') ? `This is a ${type.toLowerCase()}` : type === 'Button' ? 'Click Me' : type === 'Link' ? 'Link Text' : undefined,
              src: type === 'Image' ? 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/EEE/31343C' : type === 'Video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
              altText: type === 'Image' ? 'Placeholder Image' : undefined,
              icon: type === 'Icon' ? 'Smile' : undefined,
              href: type === 'Link' ? '#' : undefined,
              linkTarget: '_self',
              iconPosition: 'before',
              htmlTag: type === 'Heading' ? 'h1' : type === 'Paragraph' ? 'p' : 'div',
              style: {
                desktop: {
                  ...(type === 'Heading' && { margin: '0', fontSize: '36px', fontWeight: '700' }),
                  ...(type === 'Paragraph' && { margin: '0', fontSize: '16px', lineHeight: '1.6' }),
                  ...(type === 'Button' && { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontWeight: '600' }),
                  ...(type === 'Image' && { width: '100%', objectFit: 'cover' }),
                  ...(type === 'Icon' && { color: 'var(--text)', fontSize: '48px' }),
                  ...(type === 'Divider' && { height: '1px', width: '100%', backgroundColor: 'var(--border)' }),
                  ...(type === 'Video' && { width: '100%', aspectRatio: '16 / 9' }),
                  ...(type === 'Row' && { width: '100%', display: 'flex', flexDirection: 'row' }),
                  ...(type === 'Column' && { flex: '1', display: 'flex', flexDirection: 'column', padding: '16px' }),
                },
                mobile: { ...(type === 'Row' && { flexDirection: 'column' }) },
                hover: { ...(type === 'Button' && { opacity: '0.9' }) }
              },
            },
            ...( ['Row', 'Column', 'Link'].includes(type) && { children: [] }),
          };
        }

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

      insertWidget: (type, parentId, index) => set(produce(draft => {
        const blueprintFn = (elementBlueprints as any)[`${type.charAt(0).toLowerCase() + type.slice(1)}Blueprint`];
        if (!blueprintFn) return;

        const newWidget = blueprintFn();

        if (!parentId) {
            console.warn("Widgets cannot be dropped at the root level.");
            return;
        }

        let parentPathResult = findComponentPath(parentId, draft.components);
        if (!parentPathResult) return;

        let parentComponent = getComponentAtPath(parentPathResult.path, draft.components);
        let insertionIndex = index !== undefined ? index : (parentComponent.children?.length || 0);
        
        // If the drop target is a Row, auto-wrap the widget in a new Column.
        if (parentComponent.type === 'Row') {
            const newColumnId = nanoid();
            const newColumn: Component = {
                id: newColumnId,
                type: 'Column',
                parent: parentComponent.id,
                props: {
                    style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', padding: '0px' } }
                },
                children: [newWidget]
            };
            newWidget.parent = newColumnId;

            if (!parentComponent.children) parentComponent.children = [];
            parentComponent.children.splice(insertionIndex, 0, newColumn);
            draft.selectedComponentId = newWidget.id;
            return; // Done
        }
        
        // If the drop target is not a Column (and not a Row which we handled), reject it.
        if (parentComponent.type !== 'Column') {
            console.warn(`Widgets can only be dropped into Columns, not ${parentComponent.type}.`);
            return;
        }
        
        // Default case: drop target is a Column.
        if (!parentComponent.children) parentComponent.children = [];
        newWidget.parent = parentComponent.id;
        parentComponent.children.splice(insertionIndex, 0, newWidget);
        draft.selectedComponentId = newWidget.id;
      })),
      
      updateWidgetVariant: (componentId, variant) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (!pathResult || !pathResult.component.props.widgetType) return;
        
        const widgetType = pathResult.component.props.widgetType;
        const blueprintFn = (elementBlueprints as any)[`${widgetType.charAt(0).toLowerCase() + widgetType.slice(1)}Blueprint`];
        if (!blueprintFn) return;

        const newBlueprint = blueprintFn(variant);
        const targetComponent = getComponentAtPath(pathResult.path, draft.components);
        
        // Preserve content and children, but update styles and variant prop
        targetComponent.props.style = newBlueprint.props.style;
        targetComponent.props.variant = variant;
      })),

      updateComponentProps: (componentId, newProps) => set(produce(draft => {
        const pathResult = findComponentPath(componentId, draft.components);
        if (pathResult) {
          const component = getComponentAtPath(pathResult.path, draft.components);
          // Simple merge for top-level props
          for (const key in newProps) {
            if (typeof (newProps as any)[key] === 'object' && (newProps as any)[key] !== null && !Array.isArray((newProps as any)[key])) {
              // Deep merge for nested objects like sectionProps
              (component.props as any)[key] = {
                ...((component.props as any)[key] || {}),
                ...(newProps as any)[key],
              };
            } else {
              (component.props as any)[key] = (newProps as any)[key];
            }
          }
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

        const componentToDelete = pathResult.component;
        // Prevent deleting the last container in a section
        if (componentToDelete.type === 'Container') {
          const parentPathResult = componentToDelete.parent ? findComponentPath(componentToDelete.parent, draft.components) : null;
          if (parentPathResult && parentPathResult.component.type === 'Section' && parentPathResult.component.children?.length === 1) {
            alert("Cannot delete the only container inside a Section.");
            return;
          }
        }
        
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
        const newComponent = assignNewIds(originalComponent);
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
        const { components, selectedComponentId, globalColors, savedColors, recentColors, userImages, theme, schemaVersion } = state;
        return { components, selectedComponentId, globalColors, savedColors, recentColors, userImages, theme, schemaVersion };
      },
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
