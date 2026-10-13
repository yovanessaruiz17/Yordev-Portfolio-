import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenBlog?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBlog, onOpenAbout }) => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['inicio', 'servicios', 'proyectos', 'tecnologias', 'faq', 'contacto'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Sobre mí', href: '#sobre-mi', id: 'sobre-mi', isModal: true },
    { name: 'Servicios', href: '#servicios', id: 'servicios' },
    { name: 'Proyectos', href: '#proyectos', id: 'proyectos' },
    { name: 'Tecnologías', href: '#tecnologias', id: 'tecnologias' },
    { name: 'Blog', href: '#blog', id: 'blog', isBlog: true },
    { name: 'FAQ', href: '#faq', id: 'faq' },
    { name: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { name: string; href: string; id: string; isModal?: boolean; isBlog?: boolean }
  ) => {
    if (item.isModal && onOpenAbout) {
      e.preventDefault();
      onOpenAbout();
      setMobileMenuOpen(false);
      return;
    }
    if (item.isBlog && onOpenBlog) {
      e.preventDefault();
      onOpenBlog();
      setMobileMenuOpen(false);
      return;
    }
    setActiveSection(item.id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0f19]/90 backdrop-blur-md border-b border-purple-900/30 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#inicio"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
          aria-label="Ir al inicio - Yorleidys Ruiz"
        >
          <Logo size="md" />
        </a>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#11162b]/70 border border-purple-900/20 backdrop-blur-sm"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full shadow-[0_0_8px_#a855f7]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 hover:shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Hablemos</span>
            <MessageCircle className="w-4 h-4 text-purple-200" />
          </a>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#contacto"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-purple-600 shadow-sm"
          >
            <span>Hablemos</span>
            <MessageCircle className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900/80 border border-purple-900/40 text-slate-200 hover:text-white focus:outline-none"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0d1222]/95 border-b border-purple-900/40 backdrop-blur-xl px-6 py-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-900/30 text-purple-300 border border-purple-700/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-purple-900/30 flex justify-between items-center text-xs text-slate-400">
            <span>Yorleidys Ruiz • Cartagena, Colombia</span>
            <span className="text-purple-400">Freelance Disponible</span>
          </div>
        </div>
      )}
    </header>
  );
};
