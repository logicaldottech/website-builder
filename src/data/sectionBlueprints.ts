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

export const testimonialSectionBlueprint = (): Component => {
  const testimonialCard: Component = {
    id: '', type: 'Column', parent: '', props: {
      style: {
        desktop: {
          flex: '1', display: 'flex', flexDirection: 'column', gap: '24px',
          backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '32px',
        },
        mobile: { padding: '24px' }
      }
    },
    children: [
      { id: '', type: 'Paragraph', parent: '', props: { text: '"This is an amazing product that completely changed our workflow. The support team is also fantastic!"', style: { desktop: { fontStyle: 'italic', color: '#94a3b8', fontSize: '16px', lineHeight: '1.7' } } } },
      {
        id: '', type: 'Container', parent: '', props: {
          style: { desktop: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' } }
        },
        children: [
          { id: '', type: 'Image', parent: '', props: { src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', style: { desktop: { width: '48px', height: '48px', borderRadius: '9999px' } } } },
          {
            id: '', type: 'Container', parent: '', props: {
              style: { desktop: { display: 'flex', flexDirection: 'column' } }
            },
            children: [
              { id: '', type: 'Heading', parent: '', props: { text: 'Jane Doe', htmlTag: 'h5', style: { desktop: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9' } } } },
              { id: '', type: 'Paragraph', parent: '', props: { text: 'CEO, Tech Innovators', style: { desktop: { fontSize: '14px', color: '#94a3b8' } } } }
            ]
          }
        ]
      }
    ]
  };

  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section', style: { desktop: { paddingTop: '80px', paddingBottom: '80px' } }
    },
    children: [{
      id: '', type: 'Container', parent: '', props: {
        style: { desktop: { maxWidth: '1200px', paddingLeft: '16px', paddingRight: '16px' } }
      },
      children: [
        { id: '', type: 'Heading', parent: '', props: { text: 'What Our Clients Say', htmlTag: 'h2', style: { desktop: { textAlign: 'center', fontSize: '36px', fontWeight: '900', color: '#f1f5f9', marginBottom: '48px' } } } },
        {
          id: '', type: 'Row', parent: '', props: {
            style: { desktop: { display: 'flex', gap: '32px' }, mobile: { flexDirection: 'column' } }
          },
          children: [
            testimonialCard,
            assignNewIds({ ...testimonialCard, children: testimonialCard.children!.map(c => c.type === 'Container' ? { ...c, children: c.children!.map(cc => cc.type === 'Image' ? { ...cc, props: { ...cc.props, src: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' } } : cc) } : c) }),
            assignNewIds({ ...testimonialCard, children: testimonialCard.children!.map(c => c.type === 'Container' ? { ...c, children: c.children!.map(cc => cc.type === 'Image' ? { ...cc, props: { ...cc.props, src: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' } } : cc) } : c) }),
          ]
        }
      ]
    }]
  };
  return assignNewIds(blueprint);
};

export const ctaSectionBlueprint = (): Component => {
  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section',
      sectionSpecificProps: { background: { type: 'gradient', gradient: 'linear-gradient(105deg, #64748b, #334155)' } },
      style: { desktop: { paddingTop: '64px', paddingBottom: '64px' } }
    },
    children: [{
      id: '', type: 'Container', parent: '', props: {
        style: { desktop: { maxWidth: '1100px', paddingLeft: '16px', paddingRight: '16px' } }
      },
      children: [{
        id: '', type: 'Row', parent: '', props: {
          style: {
            desktop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            mobile: { flexDirection: 'column', gap: '24px', textAlign: 'center' }
          }
        },
        children: [
          {
            id: '', type: 'Column', parent: '', props: { style: {} },
            children: [
              { id: '', type: 'Heading', parent: '', props: { text: 'Ready to Grow Your Business?', htmlTag: 'h2', style: { desktop: { fontSize: '36px', fontWeight: '900', color: '#FFFFFF' }, mobile: { fontSize: '28px' } } } },
              { id: '', type: 'Paragraph', parent: '', props: { text: 'Contact us today for a free, no-obligation quote.', style: { desktop: { fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' } } } }
            ]
          },
          {
            id: '', type: 'Column', parent: '', props: { style: { mobile: { width: '100%' } } },
            children: [
              { id: '', type: 'Button', parent: '', props: { text: 'Get a Free Quote', style: { desktop: { backgroundColor: '#FFFFFF', color: '#64748b', padding: '16px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '700' }, mobile: { width: '100%' } } } }
            ]
          }
        ]
      }]
    }]
  };
  return assignNewIds(blueprint);
};

export const aboutUsSectionBlueprint = (): Component => {
  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section', style: { desktop: { paddingTop: '80px', paddingBottom: '80px' } }
    },
    children: [{
      id: '', type: 'Container', parent: '', props: { style: { desktop: { maxWidth: '1100px', paddingLeft: '16px', paddingRight: '16px' } } },
      children: [{
        id: '', type: 'Row', parent: '', props: {
          style: {
            desktop: { display: 'flex', alignItems: 'center', gap: '64px' },
            mobile: { flexDirection: 'column', gap: '48px' }
          }
        },
        children: [
          { id: '', type: 'Column', parent: '', props: { style: { desktop: { flex: '2' } } }, children: [
            { id: '', type: 'Image', parent: '', props: { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop', style: { desktop: { borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' } } } }
          ]},
          { id: '', type: 'Column', parent: '', props: { style: { desktop: { flex: '3' } } }, children: [
            { id: '', type: 'Heading', parent: '', props: { text: 'About Our Company', htmlTag: 'h3', style: { desktop: { fontSize: '30px', fontWeight: '800', color: '#f1f5f9', marginBottom: '16px' } } } },
            { id: '', type: 'Paragraph', parent: '', props: { text: 'We are a passionate team of developers and designers dedicated to creating high-quality software solutions. Our mission is to empower businesses with tools that are both powerful and a joy to use.', style: { desktop: { color: '#94a3b8', lineHeight: '1.7', marginBottom: '16px' } } } },
            { id: '', type: 'Paragraph', parent: '', props: { text: 'Founded in 2025, we have been helping clients from all over the world to achieve their goals.', style: { desktop: { color: '#94a3b8', lineHeight: '1.7', marginBottom: '24px' } } } },
            { id: '', type: 'Button', parent: '', props: { text: 'Read Our Story', style: { desktop: { backgroundColor: 'transparent', border: '1px solid #334155', color: '#f1f5f9', padding: '12px 24px', borderRadius: '8px' } } } }
          ]}
        ]
      }]
    }]
  };
  return assignNewIds(blueprint);
};

export const contactSectionBlueprint = (): Component => {
  const formField: Component = {
    id: '', type: 'Paragraph', parent: '', props: {
      text: 'Your Name', style: { desktop: { width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#94a3b8' } }
    }
  };
  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section', style: { desktop: { paddingTop: '80px', paddingBottom: '80px' } }
    },
    children: [{
      id: '', type: 'Container', parent: '', props: { style: { desktop: { maxWidth: '1100px', paddingLeft: '16px', paddingRight: '16px' } } },
      children: [
        { id: '', type: 'Heading', parent: '', props: { text: 'Get In Touch', htmlTag: 'h2', style: { desktop: { textAlign: 'center', fontSize: '36px', fontWeight: '900', color: '#f1f5f9', marginBottom: '48px' } } } },
        { id: '', type: 'Row', parent: '', props: { style: { desktop: { display: 'flex', gap: '48px' }, mobile: { flexDirection: 'column' } } },
          children: [
            { id: '', type: 'Column', parent: '', props: { style: { desktop: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' } } }, children: [
              { id: '', type: 'Heading', parent: '', props: { text: 'Send Us a Message', htmlTag: 'h4', style: { desktop: { fontSize: '22px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' } } } },
              formField,
              { ...assignNewIds(formField), props: { ...formField.props, text: 'Your Email' } },
              { ...assignNewIds(formField), props: { ...formField.props, text: 'Subject' } },
              { ...assignNewIds(formField), props: { ...formField.props, text: 'Your Message', style: { ...formField.props.style, desktop: { ...formField.props.style.desktop, minHeight: '120px' } } } },
              { id: '', type: 'Button', parent: '', props: { text: 'Submit Message', style: { desktop: { width: '100%', backgroundColor: '#64748b', color: '#FFFFFF', padding: '12px', borderRadius: '8px', marginTop: '8px' } } } }
            ]},
            { id: '', type: 'Column', parent: '', props: { style: { desktop: { flex: '1' }, mobile: { minHeight: '300px' } } }, children: [
              { id: '', type: 'Image', parent: '', props: { src: 'https://i.ibb.co/F8Zt2Yh/map-placeholder.png', style: { desktop: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' } } } }
            ]}
          ]
        }
      ]
    }]
  };
  return assignNewIds(blueprint);
};

export const logoCloudSectionBlueprint = (): Component => {
  const logoImage: Component = {
    id: '', type: 'Image', parent: '', props: {
      src: 'https://logodownload.org/wp-content/uploads/2014/09/google-logo-1.png',
      style: {
        desktop: { height: '32px', width: 'auto', filter: 'grayscale(100%)', opacity: '0.6', transition: 'all 0.3s' },
        hover: { filter: 'grayscale(0%)', opacity: '1' }
      }
    }
  };
  const blueprint: Component = {
    id: '', type: 'Section', parent: null, props: {
      htmlTag: 'section', style: { desktop: { paddingTop: '64px', paddingBottom: '64px', backgroundColor: '#1e293b' } }
    },
    children: [{
      id: '', type: 'Container', parent: '', props: { style: { desktop: { maxWidth: '1100px', paddingLeft: '16px', paddingRight: '16px' } } },
      children: [
        { id: '', type: 'Heading', parent: '', props: { text: 'TRUSTED BY COMPANIES WORLDWIDE', htmlTag: 'h6', style: { desktop: { textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '32px' } } } },
        { id: '', type: 'Row', parent: '', props: {
          style: {
            desktop: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '48px' },
            mobile: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }
          }
        }, children: [
          logoImage,
          { ...assignNewIds(logoImage), props: { ...logoImage.props, src: 'https://logodownload.org/wp-content/uploads/2019/09/stripe-logo-1.png' } },
          { ...assignNewIds(logoImage), props: { ...logoImage.props, src: 'https://logodownload.org/wp-content/uploads/2014/05/amazon-logo-1-1.png' } },
          { ...assignNewIds(logoImage), props: { ...logoImage.props, src: 'https://logodownload.org/wp-content/uploads/2014/02/netflix-logo-1.png' } },
          { ...assignNewIds(logoImage), props: { ...logoImage.props, src: 'https://logodownload.org/wp-content/uploads/2019/08/slack-logo-1.png' } }
        ]}
      ]
    }]
  };
  return assignNewIds(blueprint);
};
