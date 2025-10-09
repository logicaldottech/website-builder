import { nanoid } from 'nanoid';
import { Component, WidgetType } from '../types/builder';

const assignNewIds = (component: Component): Component => {
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

export const featureCardBlueprint = (variant: 'neutral' | 'primary' = 'neutral'): Component => {
  const isPrimary = variant === 'primary';
  const blueprint: Component = {
    id: '',
    type: 'Container',
    parent: '',
    props: {
      widgetType: 'FeatureCard',
      variant,
      style: {
        desktop: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '24px',
          borderRadius: '12px',
          border: isPrimary ? '1px solid var(--primary)' : '1px solid var(--border)',
          backgroundColor: isPrimary ? 'var(--primary-600-10)' : 'var(--surface)',
          boxShadow: '0 2px 8px rgba(16,24,40,.08)',
        },
      },
    },
    children: [
      { id: '', type: 'Icon', parent: '', props: { icon: 'Star', style: { desktop: { color: 'var(--primary)', fontSize: '24px' } } } },
      { id: '', type: 'Heading', parent: '', props: { text: 'Fast & Flexible', htmlTag: 'h3', style: { desktop: { fontSize: '18px', fontWeight: '600' } } } },
      { id: '', type: 'Paragraph', parent: '', props: { text: 'A short paragraph describing the feature.', style: { desktop: { color: 'var(--text-muted)' } } } },
      { id: '', type: 'Link', parent: '', props: { text: 'Learn more →', href: '#', style: { desktop: { color: 'var(--primary)', fontWeight: '500' } } } },
    ],
  };
  return assignNewIds(blueprint);
};

export const testimonialBlueprint = (variant: 'emphasized' | 'plain' = 'emphasized'): Component => {
  const isEmphasized = variant === 'emphasized';
  const blueprint: Component = {
    id: '',
    type: 'Container',
    parent: '',
    props: {
      widgetType: 'Testimonial',
      variant,
      style: {
        desktop: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--alt)',
          ...(isEmphasized && { boxShadow: '0 8px 24px rgba(16,24,40,.10)' }),
        },
      },
    },
    children: [
      { id: '', type: 'Paragraph', parent: '', props: { text: '"This is an amazing product that completely changed our workflow. The support team is also fantastic!"', style: { desktop: { fontStyle: 'italic' } } } },
      {
        id: '', type: 'Row', parent: '', props: { style: { desktop: { alignItems: 'center', gap: '12px', marginTop: '16px' } } },
        children: [
          { id: '', type: 'Image', parent: '', props: { src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', style: { desktop: { width: '48px', height: '48px', borderRadius: '9999px' } } } },
          {
            id: '', type: 'Column', parent: '', props: { style: { desktop: { padding: '0', gap: '0' } } },
            children: [
              { id: '', type: 'Heading', parent: '', props: { text: 'Jane Doe', htmlTag: 'h4', style: { desktop: { fontSize: '16px', fontWeight: '600' } } } },
              { id: '', type: 'Paragraph', parent: '', props: { text: 'CEO, Tech Innovators', style: { desktop: { fontSize: '14px', color: 'var(--text-muted)' } } } },
            ],
          },
        ],
      },
    ],
  };
  return assignNewIds(blueprint);
};

export const pricingCardBlueprint = (variant: 'neutral' | 'primary' = 'primary'): Component => {
    const isPrimary = variant === 'primary';
    const blueprint: Component = {
        id: '', type: 'Container', parent: '',
        props: {
            widgetType: 'PricingCard', variant,
            style: {
                desktop: {
                    display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px',
                    borderRadius: '16px', border: `1px solid ${isPrimary ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: 'var(--surface)', boxShadow: '0 8px 24px rgba(16,24,40,.10)',
                },
                hover: { transform: 'scale(1.02)' }
            }
        },
        children: [
            { id: '', type: 'Heading', parent: '', props: { text: 'Pro Plan', htmlTag: 'h3', style: { desktop: { fontSize: '20px', fontWeight: '600', color: isPrimary ? 'var(--primary)' : 'var(--text)' } } } },
            { id: '', type: 'Heading', parent: '', props: { text: '$49/mo', htmlTag: 'h2', style: { desktop: { fontSize: '36px', fontWeight: '700' } } } },
            { id: '', type: 'Column', parent: '', props: { style: { desktop: { padding: '0', gap: '8px', marginTop: '16px' } } },
                children: [
                    { id: '', type: 'Paragraph', parent: '', props: { text: '✓ 10 Projects' } },
                    { id: '', type: 'Paragraph', parent: '', props: { text: '✓ Advanced Analytics' } },
                ]
            },
            { id: '', type: 'Button', parent: '', props: { text: 'Choose Plan', style: { desktop: { width: '100%', marginTop: '16px' } } } },
        ]
    };
    return assignNewIds(blueprint);
};

export const statsCounterBlueprint = (variant: 'neutral' | 'accent' = 'accent'): Component => {
    const isAccent = variant === 'accent';
    const blueprint: Component = {
        id: '', type: 'Container', parent: '',
        props: {
            widgetType: 'StatsCounter', variant,
            style: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', alignItems: 'center' } }
        },
        children: [
            { id: '', type: 'Heading', parent: '', props: { text: '10M+', htmlTag: 'h2', style: { desktop: { fontSize: '48px', fontWeight: '700', color: isAccent ? 'var(--accent)' : 'var(--text)' } } } },
            { id: '', type: 'Paragraph', parent: '', props: { text: 'Active Users', style: { desktop: { color: 'var(--text-muted)', fontWeight: '500' } } } },
        ]
    };
    return assignNewIds(blueprint);
};

export const stepsBlueprint = (variant: 'numbered' | 'lined' = 'numbered'): Component => {
    const isNumbered = variant === 'numbered';
    const stepItem: Component = {
        id: '', type: 'Row', parent: '',
        props: { style: { desktop: { alignItems: 'center', gap: '16px' } } },
        children: [
            { id: '', type: 'Container', parent: '', props: { style: { desktop: { width: '32px', height: '32px', borderRadius: '99px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' } } }, children: [
                { id: '', type: 'Paragraph', parent: '', props: { text: '1' } }
            ]},
            { id: '', type: 'Heading', parent: '', props: { text: 'Your First Step', htmlTag: 'h4', style: { desktop: { fontSize: '18px', fontWeight: '600' } } } },
        ]
    };
    const blueprint: Component = {
        id: '', type: 'Column', parent: '',
        props: {
            widgetType: 'Steps', variant,
            style: { desktop: { padding: '0', gap: '24px' } }
        },
        children: [
            stepItem,
            assignNewIds({ ...stepItem, children: stepItem.children!.map((c, i) => i === 0 ? { ...c, children: [{...c.children![0], props: {...c.children![0].props, text: '2'}}] } : c) }),
            assignNewIds({ ...stepItem, children: stepItem.children!.map((c, i) => i === 0 ? { ...c, children: [{...c.children![0], props: {...c.children![0].props, text: '3'}}] } : c) }),
        ]
    };
    return assignNewIds(blueprint);
};

export const accordionBlueprint = (variant: 'bordered' | 'shadow' = 'bordered'): Component => {
    const isBordered = variant === 'bordered';
    const accordionItem: Component = {
        id: '', type: 'Container', parent: '',
        props: {
            htmlTag: 'details',
            style: { desktop: { ...(isBordered && { borderBottom: '1px solid var(--border)' }), padding: '16px 0' } }
        },
        children: [
            { id: '', type: 'Heading', parent: '', props: { htmlTag: 'summary', text: 'Can I cancel my subscription?', style: { desktop: { fontWeight: '600', cursor: 'pointer' } } } },
            { id: '', type: 'Paragraph', parent: '', props: { text: 'Yes, you can cancel your plan at any time from your account dashboard.', style: { desktop: { paddingTop: '12px', color: 'var(--text-muted)' } } } },
        ]
    };
    const blueprint: Component = {
        id: '', type: 'Column', parent: '',
        props: {
            widgetType: 'Accordion', variant,
            style: { desktop: { padding: '0', borderRadius: '12px', ...(!isBordered && { boxShadow: '0 2px 8px rgba(16,24,40,.08)' }) } }
        },
        children: [ accordionItem, assignNewIds(accordionItem) ]
    };
    return assignNewIds(blueprint);
};

export const tabsBlueprint = (variant: 'underline' | 'pill' = 'underline'): Component => {
    const blueprint: Component = {
        id: '', type: 'Column', parent: '',
        props: {
            widgetType: 'Tabs', variant,
            style: { desktop: { padding: '0', gap: '16px' } }
        },
        children: [
            { id: '', type: 'Row', parent: '', props: { style: { desktop: { borderBottom: '1px solid var(--border)', gap: '16px' } } }, children: [
                { id: '', type: 'Button', parent: '', props: { text: 'Tab 1', style: { desktop: { backgroundColor: 'transparent', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', borderRadius: '0', padding: '12px 0', fontWeight: '600' } } } },
                { id: '', type: 'Button', parent: '', props: { text: 'Tab 2', style: { desktop: { backgroundColor: 'transparent', color: 'var(--text-muted)', borderRadius: '0', padding: '12px 0' } } } },
            ]},
            { id: '', type: 'Column', parent: '', props: { style: { desktop: { padding: '16px 0' } } }, children: [
                { id: '', type: 'Paragraph', parent: '', props: { text: 'Content for Tab 1 goes here.' } }
            ]}
        ]
    };
    return assignNewIds(blueprint);
};

export const alertBlueprint = (variant: 'info' | 'success' | 'warning' | 'danger' = 'info'): Component => {
    const colors = {
        info: { bg: '#eff6ff', border: '#60a5fa', icon: '#3b82f6' },
        success: { bg: '#f0fdf4', border: '#4ade80', icon: '#22c55e' },
        warning: { bg: '#fffbeb', border: '#facc15', icon: '#f59e0b' },
        danger: { bg: '#fef2f2', border: '#f87171', icon: '#ef4444' },
    };
    const blueprint: Component = {
        id: '', type: 'Row', parent: '',
        props: {
            widgetType: 'Alert', variant,
            style: { desktop: { alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '12px', backgroundColor: colors[variant].bg, border: `1px solid ${colors[variant].border}` } }
        },
        children: [
            { id: '', type: 'Icon', parent: '', props: { icon: 'Info', style: { desktop: { color: colors[variant].icon, marginTop: '2px' } } } },
            { id: '', type: 'Paragraph', parent: '', props: { text: 'This is an informational message.', style: { desktop: { color: 'var(--text)' } } } },
        ]
    };
    return assignNewIds(blueprint);
};

export const badgeBlueprint = (variant: 'primary' | 'accent' | 'neutral' = 'primary'): Component => {
    const colors = {
        primary: { bg: 'var(--primary)', text: '#fff' },
        accent: { bg: 'var(--accent)', text: '#000' },
        neutral: { bg: 'var(--surface-alt)', text: 'var(--text-muted)' },
    };
    const blueprint: Component = {
        id: '', type: 'Paragraph', parent: '',
        props: {
            widgetType: 'Badge', variant, text: 'New Feature',
            style: { desktop: { display: 'inline-block', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', backgroundColor: colors[variant].bg, color: colors[variant].text } }
        },
    };
    return assignNewIds(blueprint);
};

export const dividerBlueprint = (variant: 'line' | 'dashed' | 'spaced' = 'line'): Component => {
    const blueprint: Component = {
        id: '', type: 'Divider', parent: '',
        props: {
            widgetType: 'Divider', variant,
            style: {
                desktop: {
                    width: '100%',
                    borderTopWidth: '1px',
                    borderTopColor: 'var(--border)',
                    borderTopStyle: variant === 'dashed' ? 'dashed' : 'solid',
                    margin: variant === 'spaced' ? '32px 0' : '16px 0',
                },
            },
        },
    };
    return assignNewIds(blueprint);
};
