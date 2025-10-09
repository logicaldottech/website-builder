export const ItemTypes = {
  COMPONENT: 'component',
  LAYOUT: 'layout',
  BLOCK: 'block',
  WIDGET: 'widget', // New type for composite elements
  CANVAS_COMPONENT: 'canvas_component'
};

export interface StyleProperties {
  // Typography
  color?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700' | '900';
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  lineHeight?: string;
  letterSpacing?: string;
  textShadow?: string;
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
  display?: 'flex' | 'block' | 'inline-block' | 'grid';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: string;
  columnGap?: string;
  rowGap?: string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
  // Appearance
  backgroundColor?: string;
  backgroundImage?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  opacity?: string;
  boxShadow?: string;
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box' | 'text';
  WebkitBackgroundClip?: 'border-box' | 'padding-box' | 'content-box' | 'text';
  filter?: string;
  // Size
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  flex?: string;
  aspectRatio?: string;
  // Position
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  order?: string;
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  // Columns
  columnCount?: string;
  // Image
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  // Transform
  transform?: string;
  // Blend Mode
  mixBlendMode?: string;
}

export interface ComponentStyle {
  desktop: StyleProperties;
  tablet?: StyleProperties;
  mobile?: StyleProperties;
  hover?: StyleProperties;
}

export interface SectionBackground {
  type: 'none' | 'color' | 'gradient' | 'image' | 'video';
  color?: string;
  gradient?: string;
  image?: {
    src?: string;
    position?: string;
    attachment?: 'scroll' | 'fixed';
    repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    size?: 'cover' | 'contain' | 'auto';
  };
  video?: {
    src?: string;
  };
  overlay?: {
    color?: string;
    opacity?: number; // 0 to 1
  };
}

export interface ImageFilters {
  brightness?: number; // 100 is default
  contrast?: number; // 100 is default
  saturate?: number; // 100 is default
  blur?: number; // 0 is default
}

export interface SectionProps {
  paddingY?: { sm: string; md: string; lg: string };
  background?: SectionBackground;
  fullBleed?: boolean;
  htmlTag?: 'section' | 'header' | 'footer' | 'div';
  ariaLabel?: string;
  animation?: {
    preset?: 'fadeIn' | 'fadeInUp' | 'slideUp' | 'pulse' | 'scaleIn';
    duration?: number;
    delay?: number;
  };
}

export interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center';
  paddingX?: { sm: string; md: string; lg: string };
  rowGap?: string;
  columnGap?: string;
  isSticky?: boolean;
  stickyOffset?: string;
}

export interface ComponentProps {
  // Content
  text?: string;
  src?: string; // For images and videos
  altText?: string; // For images
  icon?: string; // For icons
  href?: string; // For links
  linkTarget?: '_self' | '_blank';
  iconPosition?: 'before' | 'after';
  // Structure
  htmlTag?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'nav' | 'aside' | 'article' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'details' | 'summary';
  customId?: string;
  customClassName?: string;
  // Styling & Layout
  style: ComponentStyle;
  filters?: ImageFilters;
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  // New structured props
  sectionProps?: SectionProps;
  containerProps?: ContainerProps;
  widgetType?: WidgetType;
  variant?: string;
  [key: string]: any;
}

export type Component = {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: Component[];
  parent: string | null;
};

export type ComponentType = 'Section' | 'Container' | 'Row' | 'Column' | 'Heading' | 'Paragraph' | 'Button' | 'Image' | 'Icon' | 'Divider' | 'Link' | 'Video';
export type DraggableComponentType = ComponentType;
export type LayoutType = 'TwoColumn' | 'Grid';
export type BlockType = 'Card';
export type WidgetType = 'FeatureCard' | 'Testimonial' | 'PricingCard' | 'StatsCounter' | 'Steps' | 'Accordion' | 'Tabs' | 'Alert' | 'Badge' | 'Divider';


export interface GlobalColorState {
  globalColors: Record<string, string>;
  savedColors: string[];
  recentColors: string[];
}

export interface BlockLibraryItem {
  id: string;
  type: 'section' | 'template';
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  thumbnail: string;
  blueprint: Component | Component[];
}
