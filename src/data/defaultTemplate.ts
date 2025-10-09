import { nanoid } from 'nanoid';
import { Component } from '../types/builder';

export const defaultComponents: Component[] = [
  // Header
  {
    id: nanoid(),
    type: 'Container',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
      }
    },
    children: [
      {
        id: nanoid(),
        type: 'Heading',
        props: {
          text: 'Builder',
          style: {
            fontSize: '24px',
            color: '#111827',
          }
        }
      },
      {
        id: nanoid(),
        type: 'Container',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
            alignItems: 'center',
          }
        },
        children: [
          { id: nanoid(), type: 'Paragraph', props: { text: 'Features', style: { fontSize: '16px', color: '#4B5563', cursor: 'pointer' } } },
          { id: nanoid(), type: 'Paragraph', props: { text: 'Pricing', style: { fontSize: '16px', color: '#4B5563', cursor: 'pointer' } } },
          { id: nanoid(), type: 'Button', props: { text: 'Sign Up', style: { backgroundColor: '#64748b', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px' } } },
        ]
      }
    ]
  },
  // Hero Section
  {
    id: nanoid(),
    type: 'Container',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 32px',
        backgroundColor: '#FFFFFF',
        gap: '24px',
      }
    },
    children: [
      {
        id: nanoid(),
        type: 'Heading',
        props: {
          text: 'Build Websites Visually',
          style: {
            fontSize: '56px',
            color: '#111827',
            margin: '0px',
          }
        }
      },
      {
        id: nanoid(),
        type: 'Paragraph',
        props: {
          text: 'The future of web design is here. Create, customize, and launch your dream website with an intuitive drag-and-drop interface.',
          style: {
            fontSize: '20px',
            color: '#4B5563',
            margin: '0px',
            padding: '0px 200px',
          }
        }
      },
      {
        id: nanoid(),
        type: 'Button',
        props: {
          text: 'Start Building for Free',
          style: {
            backgroundColor: '#64748b',
            color: '#FFFFFF',
            fontSize: '18px',
            padding: '16px 32px',
            borderRadius: '8px',
            margin: '16px 0 0 0',
          }
        }
      }
    ]
  },
  // Features Section
  {
    id: nanoid(),
    type: 'Container',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 32px',
        backgroundColor: '#F9FAFB',
        gap: '48px',
      }
    },
    children: [
      {
        id: nanoid(),
        type: 'Container',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
          }
        },
        children: [
          {
            id: nanoid(),
            type: 'Container',
            props: { style: { flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px' } },
            children: [
              { id: nanoid(), type: 'Heading', props: { text: 'Drag & Drop', style: { fontSize: '20px', color: '#111827' } } },
              { id: nanoid(), type: 'Paragraph', props: { text: 'Effortlessly arrange elements with our intuitive drag-and-drop system.', style: { fontSize: '16px', color: '#4B5563' } } }
            ]
          },
          {
            id: nanoid(),
            type: 'Container',
            props: { style: { flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px' } },
            children: [
              { id: nanoid(), type: 'Heading', props: { text: 'Live Styling', style: { fontSize: '20px', color: '#111827' } } },
              { id: nanoid(), type: 'Paragraph', props: { text: 'See your changes in real-time as you edit styles, colors, and spacing.', style: { fontSize: '16px', color: '#4B5563' } } }
            ]
          },
          {
            id: nanoid(),
            type: 'Container',
            props: { style: { flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px' } },
            children: [
              { id: nanoid(), type: 'Heading', props: { text: 'Responsive', style: { fontSize: '20px', color: '#111827' } } },
              { id: nanoid(), type: 'Paragraph', props: { text: 'Designs adapt automatically to desktop, tablet, and mobile screens.', style: { fontSize: '16px', color: '#4B5563' } } }
            ]
          }
        ]
      }
    ]
  },
  // Footer
  {
    id: nanoid(),
    type: 'Container',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px',
        backgroundColor: '#111827',
      }
    },
    children: [
      {
        id: nanoid(),
        type: 'Paragraph',
        props: {
          text: '© 2025 Builder. All Rights Reserved.',
          style: {
            fontSize: '14px',
            color: '#9CA3AF',
          }
        }
      },
      {
        id: nanoid(),
        type: 'Container',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
          }
        },
        children: [
          { id: nanoid(), type: 'Paragraph', props: { text: 'Twitter', style: { fontSize: '14px', color: '#9CA3AF', cursor: 'pointer' } } },
          { id: nanoid(), type: 'Paragraph', props: { text: 'LinkedIn', style: { fontSize: '14px', color: '#9CA3AF', cursor: 'pointer' } } },
        ]
      }
    ]
  }
];
