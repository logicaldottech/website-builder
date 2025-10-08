import { nanoid } from 'nanoid';
import { Component } from '../types/builder';

// Helper to recursively assign new IDs to a component and its children
const assignNewIds = (component: Component): Component => {
  const newId = nanoid();
  const newComponent: Component = {
    ...component,
    id: newId,
  };

  if (component.children) {
    newComponent.children = component.children.map(child => {
      const newChild = assignNewIds(child);
      newChild.parent = newId;
      return newChild;
    });
  }

  return newComponent;
};

export const modernHeroSectionBlueprint = (): Component => {
  const blueprint: Component = {
    id: '', // Will be replaced
    type: 'Section',
    parent: null,
    props: {
      htmlTag: 'section',
      style: {
        desktop: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '100px',
          paddingBottom: '100px',
          backgroundColor: '#15141A'
        }
      }
    },
    children: [
      {
        id: '', type: 'Container', parent: '', props: {
          style: { desktop: { width: '100%', maxWidth: '1200px' } }
        },
        children: [
          {
            id: '', type: 'Row', parent: '', props: {
              style: { desktop: { display: 'flex', alignItems: 'center', gap: '48px' } }
            },
            children: [
              {
                id: '', type: 'Column', parent: '', props: {
                  style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' } }
                },
                children: [
                  { id: '', type: 'Heading', parent: '', props: { text: 'Your Powerful Headline Goes Here', htmlTag: 'h1', style: { desktop: { fontSize: '48px', fontWeight: '900', color: '#F0F0F0', lineHeight: '1.2' } } } },
                  { id: '', type: 'Paragraph', parent: '', props: { text: 'This is a paragraph where you can describe your product or service. Make it compelling and to the point.', style: { desktop: { fontSize: '18px', color: '#A0A0A0', lineHeight: '1.6' } } } },
                  {
                    id: '', type: 'Container', parent: '', props: {
                      style: { desktop: { display: 'flex', gap: '16px', marginTop: '16px' } }
                    },
                    children: [
                      { id: '', type: 'Button', parent: '', props: { text: 'Get Started', style: { desktop: { backgroundColor: '#6E42E8', color: '#FFFFFF', padding: '12px 24px', borderRadius: '8px', fontWeight: '600' } } } },
                      { id: '', type: 'Button', parent: '', props: { text: 'Learn More', style: { desktop: { backgroundColor: 'transparent', border: '1px solid #2A292F', color: '#F0F0F0', padding: '12px 24px', borderRadius: '8px', fontWeight: '600' } } } }
                    ]
                  }
                ]
              },
              {
                id: '', type: 'Column', parent: '', props: {
                  style: { desktop: { flex: '1' } }
                },
                children: [
                  { id: '', type: 'Image', parent: '', props: { src: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/15141A/6E42E8?text=Your+Image', style: { desktop: { width: '100%', borderRadius: '12px' } } } }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  return assignNewIds(blueprint);
};

export const threeColumnFeatureSectionBlueprint = (): Component => {
  const featureColumn: Component = {
    id: '', type: 'Column', parent: '', props: {
      style: {
        desktop: {
          flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: '#15141A', border: '1px solid #2A292F', borderRadius: '12px', padding: '32px',
          textAlign: 'center'
        }
      }
    },
    children: [
      { id: '', type: 'Icon', parent: '', props: { icon: 'Smile', style: { desktop: { color: '#6E42E8', width: '40px', height: '40px', marginBottom: '16px' } } } },
      { id: '', type: 'Heading', parent: '', props: { text: 'Feature Title', htmlTag: 'h3', style: { desktop: { fontSize: '22px', fontWeight: '700', color: '#F0F0F0' } } } },
      { id: '', type: 'Paragraph', parent: '', props: { text: 'A short, centered description of the feature goes here.', style: { desktop: { fontSize: '16px', color: '#A0A0A0', lineHeight: '1.6', marginTop: '8px' } } } }
    ]
  };

  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section',
      style: {
        desktop: {
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: '80px', paddingBottom: '80px',
          backgroundColor: '#0B0A0E'
        }
      }
    },
    children: [
      {
        id: '', type: 'Container', parent: '', props: {
          style: {
            desktop: {
              width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center'
            }
          }
        },
        children: [
          { id: '', type: 'Heading', parent: '', props: { text: 'Discover Our Features', htmlTag: 'h2', style: { desktop: { fontSize: '36px', fontWeight: '900', color: '#F0F0F0', marginBottom: '16px' } } } },
          { id: '', type: 'Paragraph', parent: '', props: { text: 'Explore the key benefits and advantages that make our product stand out.', style: { desktop: { fontSize: '18px', color: '#A0A0A0', lineHeight: '1.6', marginBottom: '48px', maxWidth: '600px' } } } },
          {
            id: '', type: 'Row', parent: '', props: {
              style: { desktop: { display: 'flex', gap: '32px', width: '100%' } }
            },
            children: [
              featureColumn,
              { ...featureColumn, children: featureColumn.children?.map(c => ({ ...c, props: { ...c.props, text: c.props.text?.replace('Title', 'Two') } })) },
              { ...featureColumn, children: featureColumn.children?.map(c => ({ ...c, props: { ...c.props, text: c.props.text?.replace('Title', 'Three') } })) }
            ]
          }
        ]
      }
    ]
  };

  return assignNewIds(blueprint);
};
