export const ItemTypes = {
  COMPONENT: 'component',
  LAYOUT: 'layout',
  BLOCK: 'block',
  CANVAS_COMPONENT: 'canvas_component'
};

export interface StyleProperties {
  // Typography
  color?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | '500' | '600' | '700';
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  // Spacing
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  // Flexbox (for containers)
  display?: 'flex';
  flexDirection?: 'row' | 'column';
  gap?: string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  // Appearance
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  opacity?: string;
  boxShadow?: string;
  // Size
  width?: string;
  height?: string;
  flex?: string;
  aspectRatio?: string;
}

export interface ComponentStyle {
  desktop: StyleProperties;
  tablet?: StyleProperties;
  mobile?: StyleProperties;
}

export interface ComponentProps {
  // Content
  text?: string;
  src?: string; // For images and videos
  icon?: string; // For icons
  href?: string; // For links
  // Styling & Layout
  style: ComponentStyle;
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  animation?: {
    type?: 'fadeIn';
  };
  customClassName?: string;
  [key: string]: any;
}

export type Component = {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: Component[];
  parent: string | null;
};

export type ComponentType = 'Heading' | 'Paragraph' | 'Button' | 'Container' | 'Image' | 'Icon' | 'Divider' | 'Link' | 'Video';
export type DraggableComponentType = ComponentType | 'Row' | 'Column';
export type LayoutType = 'TwoColumn' | 'Grid';
export type BlockType = 'Card';
