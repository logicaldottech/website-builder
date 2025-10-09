import { nanoid } from 'nanoid';
import { Component } from '../types/builder';
import { LayoutItem } from '../types/layouts';

const containerWidths = {
  sm: '720px',
  md: '960px',
  lg: '1200px',
  xl: '1320px',
};

const backgroundColors = {
  surface: 'var(--surface)',
  alt: 'var(--surface-alt)',
  none: 'transparent',
};

const generateDummyImage = (width: number, height: number, text: string = 'Image'): string => {
  const bgColor = 'e5e7eb';
  const textColor = '5b6478';
  return `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

function createPlaceholderComponent(type: string, parentId: string): Component {
  const baseProps = {
    id: nanoid(),
    parent: parentId,
    props: {
      style: {
        desktop: {},
        mobile: {},
      },
    },
    children: [],
  };

  switch (type.toLowerCase()) {
    case 'heading':
      return {
        ...baseProps,
        type: 'Heading',
        props: {
          ...baseProps.props,
          text: 'Visually Stunning Layouts',
          htmlTag: 'h2',
          style: {
            desktop: { fontSize: '36px', fontWeight: '700', marginBottom: '16px' },
          },
        },
      };
    case 'paragraph':
    case 'subtext':
      return {
        ...baseProps,
        type: 'Paragraph',
        props: {
          ...baseProps.props,
          text: 'Our new AI makes it effortless to create beautiful, responsive sections for your website in seconds. Describe what you want, and watch it appear.',
          style: {
            desktop: { fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6' },
          },
        },
      };
    case 'button':
    case 'buttons':
    case 'cta':
    case 'primary button':
       return {
        ...baseProps,
        type: 'Button',
        props: {
          ...baseProps.props,
          text: 'Get Started',
           style: {
            desktop: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontWeight: '600', marginTop: '24px' },
            hover: { opacity: '0.9' }
          },
        },
      };
    case 'image':
    case 'media':
    case 'map':
      return {
        ...baseProps,
        type: 'Image',
        props: {
          ...baseProps.props,
          src: generateDummyImage(600, 400, 'Image'),
          altText: 'AI-generated placeholder image',
          style: {
            desktop: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', minHeight: '300px' },
          },
        },
      };
    case 'icon':
        return {
          ...baseProps,
          type: 'Icon',
          props: {
            ...baseProps.props,
            icon: 'Star',
            style: {
              desktop: { color: 'var(--primary)', fontSize: '32px', marginBottom: '16px' },
            },
          },
        };
    case 'bullet list':
        return {
            ...baseProps,
            type: 'Column',
            props: {
                ...baseProps.props,
                style: { desktop: { gap: '12px', marginTop: '16px' } }
            },
            children: [
                { id: nanoid(), type: 'Paragraph', parent: baseProps.id, props: { text: '✓ Feature one is amazing.', style: { desktop: {} } } },
                { id: nanoid(), type: 'Paragraph', parent: baseProps.id, props: { text: '✓ Feature two will blow your mind.', style: { desktop: {} } } },
                { id: nanoid(), type: 'Paragraph', parent: baseProps.id, props: { text: '✓ Feature three is simply the best.', style: { desktop: {} } } },
            ]
        };
    case 'pricing card':
        return {
            id: nanoid(),
            type: 'FeatureCard', // Using FeatureCard as a stand-in for a pricing card structure
            parent: parentId,
            props: {
                widgetType: 'FeatureCard',
                variant: 'primary',
                style: { desktop: {} }
            },
        };
    case 'logos':
    case 'brands':
        return {
            id: nanoid(),
            type: 'Row',
            parent: parentId,
            props: {
                style: { desktop: { justifyContent: 'space-around', alignItems: 'center', width: '100%' } }
            },
            children: Array.from({length: 5}).map(() => ({
                id: nanoid(),
                type: 'Image',
                parent: parentId, // This ID is incorrect, but will be fixed by assignNewIds
                props: {
                    src: generateDummyImage(120, 40, 'LOGO'),
                    style: { desktop: { filter: 'grayscale(100%)', opacity: '0.7' } }
                }
            }))
        };
    default:
      return {
        ...baseProps,
        type: 'Container',
        props: {
          ...baseProps.props,
          style: {
            desktop: { width: '100%', minHeight: '100px', border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' },
          },
        },
        children: [{
            id: nanoid(),
            type: 'Paragraph',
            parent: baseProps.id,
            props: { text: type, style: { desktop: { color: '#9ca3af' } } }
        }]
      };
  }
}

function parseWidth(width: string | undefined): string {
    if (!width) return '1';
    return width.replace('fr', '');
}

export function convertPresetToComponent(preset: LayoutItem): Component {
  const sectionId = nanoid();
  const containerId = nanoid();
  
  const backgroundProp = typeof preset.section.background === 'object' 
    ? { type: 'solid', ...preset.section.background } 
    : { type: preset.section.background === 'none' ? 'none' : 'color', color: backgroundColors[preset.section.background] || 'transparent' };

  const section: Component = {
    id: sectionId,
    type: 'Section',
    parent: null,
    props: {
      htmlTag: 'section',
      sectionProps: {
        paddingY: {
          lg: `${preset.section.paddingY.lg}px`,
          md: `${preset.section.paddingY.md}px`,
          sm: `${preset.section.paddingY.sm}px`,
        },
        background: backgroundProp,
        animation: preset.section.animation,
        fullBleed: preset.section.background !== 'none', // Assume full bleed for any background
      },
      style: { desktop: {} },
    },
    children: [
      {
        id: containerId,
        type: 'Container',
        parent: sectionId,
        props: {
          htmlTag: 'div',
          containerProps: {
            maxWidth: preset.section.container.maxWidth,
            align: 'center',
            paddingX: { lg: '16px', md: '16px', sm: '16px' },
            rowGap: `${preset.section.container.rows[0]?.gap.md || 16}px`,
            columnGap: `${preset.section.container.rows[0]?.gap.md || 16}px`,
          },
          style: {
            desktop: {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
        children: preset.section.container.rows.map(row => {
          const rowId = nanoid();
          return {
            id: rowId,
            type: 'Row',
            parent: containerId,
            props: {
              htmlTag: 'div',
              style: {
                desktop: {
                  display: 'flex',
                  width: '100%',
                  gap: `${row.gap.md}px`,
                  alignItems: row.align,
                },
                mobile: {
                  flexDirection: 'column',
                  gap: `${row.gap.sm}px`,
                },
              },
            },
            children: row.columns.map(col => {
              const colId = nanoid();
              return {
                id: colId,
                type: 'Column',
                parent: rowId,
                props: {
                  htmlTag: 'div',
                  style: {
                    desktop: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: parseWidth(col.width.lg),
                      minHeight: col.minHeight ? `${col.minHeight}px` : undefined,
                    },
                    tablet: {
                        flex: parseWidth(col.width.md),
                    },
                    mobile: {
                      flex: '1',
                      width: '100%',
                    },
                  },
                },
                children: col.placeholders ? col.placeholders.map(p => createPlaceholderComponent(p, colId)) : [],
              };
            }),
          };
        }),
      },
    ],
  };

  return section;
}
