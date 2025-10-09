import { BlockLibraryItem } from '../types/builder';
import { 
  testimonialSectionBlueprint,
  ctaSectionBlueprint,
  aboutUsSectionBlueprint,
  contactSectionBlueprint,
  logoCloudSectionBlueprint
} from './sectionBlueprints';

// This is a seeded library. In a real app, this would come from a database.

export const blockLibrary: BlockLibraryItem[] = [
  // Sections
  {
    id: 'section-about-1',
    type: 'section',
    title: 'Image With Text',
    description: 'A classic section to introduce a topic with an image and supporting text.',
    categories: ['About', 'Features'],
    tags: ['Light', 'Minimal', 'Agency'],
    thumbnail: 'https://i.ibb.co/yYw2zC1/template-portfolio.png',
    blueprint: aboutUsSectionBlueprint(),
  },
  {
    id: 'section-testimonials-1',
    type: 'section',
    title: 'Testimonial Cards',
    description: 'Showcase customer feedback in a clean, card-based layout.',
    categories: ['Testimonials', 'Social Proof'],
    tags: ['Dark', 'SaaS'],
    thumbnail: 'https://i.ibb.co/Jq9xQcZ/testimonial-preview.png',
    blueprint: testimonialSectionBlueprint(),
  },
  {
    id: 'section-cta-1',
    type: 'section',
    title: 'Gradient CTA',
    description: 'A high-impact call to action with a bold gradient background.',
    categories: ['CTA'],
    tags: ['Gradient', 'SaaS', 'Bold'],
    thumbnail: 'https://i.ibb.co/gZ3YpPv/cta-preview.png',
    blueprint: ctaSectionBlueprint(),
  },
  {
    id: 'section-contact-1',
    type: 'section',
    title: 'Contact Form & Map',
    description: 'A standard contact section with a form and an embedded map.',
    categories: ['Contact'],
    tags: ['Form', 'Map', 'Agency'],
    thumbnail: 'https://i.ibb.co/hX6sYdZ/contact-preview.png',
    blueprint: contactSectionBlueprint(),
  },
  {
    id: 'section-logos-1',
    type: 'section',
    title: 'Grayscale Logo Cloud',
    description: 'Build credibility by showcasing logos of clients or partners.',
    categories: ['Social Proof', 'Logos'],
    tags: ['Dark', 'Minimal'],
    thumbnail: 'https://i.ibb.co/k3VzYtB/logo-cloud-preview.png',
    blueprint: logoCloudSectionBlueprint(),
  },
  {
    id: 'section-hero-1',
    type: 'section',
    title: 'Centered Hero',
    description: 'A simple, bold hero section with a centered headline and CTA.',
    categories: ['Hero'],
    tags: ['Light', 'Minimal', 'SaaS'],
    thumbnail: 'https://i.ibb.co/LgLwzBq/hero-block-preview.png',
    blueprint: ctaSectionBlueprint(), // Reusing for demo
  },
  {
    id: 'section-features-1',
    type: 'section',
    title: 'Three Column Features',
    description: 'A simple, bold hero section with a centered headline and CTA.',
    categories: ['Features'],
    tags: ['Light', 'Minimal', 'SaaS'],
    thumbnail: 'https://i.ibb.co/Vv0F5fP/features-block-preview.png',
    blueprint: testimonialSectionBlueprint(), // Reusing for demo
  },

  // Page Templates
  {
    id: 'template-landing-1',
    type: 'template',
    title: 'SaaS Landing Page',
    description: 'A complete, high-converting landing page for a software product.',
    categories: ['Landing', 'SaaS'],
    tags: ['Dark', 'Gradient', 'Modern'],
    thumbnail: 'https://i.ibb.co/gDFGv5D/template-saas.png',
    blueprint: [
      ctaSectionBlueprint(), // Reusing for demo
      testimonialSectionBlueprint(),
      logoCloudSectionBlueprint(),
      contactSectionBlueprint(),
    ],
  },
  {
    id: 'template-portfolio-1',
    type: 'template',
    title: 'Creative Portfolio',
    description: 'A minimal and stylish portfolio template for designers and artists.',
    categories: ['Portfolio', 'Agency'],
    tags: ['Light', 'Minimal', 'Creative'],
    thumbnail: 'https://i.ibb.co/yYw2zC1/template-portfolio.png',
    blueprint: [
      aboutUsSectionBlueprint(), // Reusing for demo
      contactSectionBlueprint(),
    ],
  },
];
