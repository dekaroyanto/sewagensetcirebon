import React, { useState, useEffect } from 'react';
import {
  Phone,
  Menu,
  X,
  Zap,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { ThemeToggle } from './ThemeToggle';
import { SGCLogo } from './SGCLogo';

interface NavbarProps {
  currentPage: 'home' | 'katalog' | 'artikel';
  activeSection: string;
  onNavigate: (target: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean, focused core navigation links
  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'katalog', label: 'Katalog' },
    { id: 'portofolio', label: 'Portofolio' },
    { id: 'artikel', label: 'Artikel & Tips' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200/80 dark:border-slate-800'
        : 'bg-white dark:bg-slate-900 py-3.5 border-b border-slate-100 dark:border-slate-800/80'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('beranda')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            id="brand-logo-btn"
            aria-label="Sewa Genset Cirebon Beranda"
          >
            <SGCLogo variant="horizontal" size="sm" />
          </button>

          {/* Desktop Clean Menu Links & Theme Toggle */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = (currentPage === 'katalog' && link.id === 'katalog') ||
                (currentPage === 'artikel' && link.id === 'artikel') ||
                (currentPage === 'home' && activeSection === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  id={`nav-link-${link.id}`}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/50 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Desktop Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-800 flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Right Action Area: Theme Toggle & Hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              aria-label="Buka Menu Navigasi"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Clean Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = (currentPage === 'katalog' && link.id === 'katalog') ||
                  (currentPage === 'artikel' && link.id === 'artikel') ||
                  (currentPage === 'home' && activeSection === link.id);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between cursor-pointer ${isActive
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                      }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};


