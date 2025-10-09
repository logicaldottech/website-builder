import React from 'react';
import { Twitter, Instagram, Linkedin, Code } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' },
];

const Footer: React.FC = () => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10 pt-8">
          <div className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <Code className="w-6 h-6 text-primary-slate" />
            Builder
          </div>
          <p className="text-sm text-text-secondary order-last md:order-none">
            © 2025 Builder. All rights reserved.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-text-secondary hover:text-primary-slate transition-colors">
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
