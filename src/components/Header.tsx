import React, { useState } from 'react';
import { Menu, X, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: "Features", href: "#" },
  { name: "Templates", href: "/templates" },
  { name: "Layout Guide", href: "/guide" },
  { name: "Importer Guide", href: "/importer-guide" },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem: React.FC<{ name: string; href: string; className: string; }> = ({ name, href, className }) => {
    if (href.startsWith('/')) {
      return <Link to={href} className={className} onClick={() => setIsMenuOpen(false)}>{name}</Link>;
    }
    return <a href={href} className={className} onClick={() => setIsMenuOpen(false)}>{name}</a>;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-white/10">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-text-primary">
              <Code className="w-7 h-7 text-primary-slate" />
              Builder
            </Link>
          </div>
          
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <NavItem key={link.name} name={link.name} href={link.href} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors" />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/builder" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log In
            </Link>
            <Link to="/builder" className="px-5 py-2.5 text-sm font-semibold bg-primary-slate text-white rounded-lg hover:bg-opacity-90 transition-all">
              Sign Up
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-secondary hover:text-text-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-secondary-gray">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
            {navLinks.map((link) => (
              <NavItem key={link.name} name={link.name} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-white/5" />
            ))}
            <div className="border-t border-white/10 pt-4 mt-4 flex flex-col space-y-4">
               <Link to="/builder" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/builder" className="w-full text-center px-5 py-2.5 text-sm font-semibold bg-primary-slate text-white rounded-lg hover:bg-opacity-90 transition-all" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
