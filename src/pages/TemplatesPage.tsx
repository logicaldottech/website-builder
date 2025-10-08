import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TemplateCard from '../components/templates/TemplateCard';
import CreateSiteModal from '../components/templates/CreateSiteModal';
import { Template } from '../types/builder';

const templates: Template[] = [
  {
    id: 'portfolio-pro',
    name: 'Portfolio Pro',
    description: 'A sleek, modern portfolio to showcase your creative work with style and professionalism.',
    previewImage: 'https://i.ibb.co/yYw2zC1/template-portfolio.png',
  },
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    description: 'A high-converting landing page designed to turn visitors into customers for your software.',
    previewImage: 'https://i.ibb.co/gDFGv5D/template-saas.png',
  },
  {
    id: 'agency-site',
    name: 'Digital Agency',
    description: 'A professional website for creative agencies to showcase services and projects.',
    previewImage: 'https://i.ibb.co/LgLwzBq/hero-block-preview.png',
  },
  {
    id: 'blog-minimal',
    name: 'Minimalist Blog',
    description: 'A clean, content-focused blog template for writers and publishers.',
    previewImage: 'https://i.ibb.co/Vv0F5fP/features-block-preview.png',
  },
  {
    id: 'e-commerce-store',
    name: 'E-commerce Storefront',
    description: 'A feature-rich storefront for your online business, ready for products.',
    previewImage: 'https://i.ibb.co/yYw2zC1/template-portfolio.png',
  },
  {
    id: 'startup-page',
    name: 'Startup Framework',
    description: 'A versatile template to quickly launch a website for your new venture.',
    previewImage: 'https://i.ibb.co/gDFGv5D/template-saas.png',
  },
];

const TemplatesPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-primary mb-4">
              Choose a Template to Start
            </h1>
            <p className="text-lg text-text-secondary">
              Launch a new, fully editable Next.js site with a single click. Each template is professionally designed and ready for your content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelectTemplate(template)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {selectedTemplate && (
        <CreateSiteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          template={selectedTemplate}
        />
      )}
    </div>
  );
};

export default TemplatesPage;
