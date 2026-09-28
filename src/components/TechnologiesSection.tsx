import React, { useState } from 'react';
import { technologiesData } from '../data/portfolioData';

export const TechnologiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('todas');

  const getTechSvg = (id: string) => {
    switch (id) {
      case 'html5':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M4 2L5.8 20.2L12 22L18.2 20.2L20 2H4Z" fill="#E34F26" />
            <path d="M12 3.8V20.2L16.8 18.8L18.3 3.8H12Z" fill="#EF652A" />
            <path d="M12 8.4H8.4L8.7 11.5H12V14.6H8.9L9.2 17.5L12 18.3V16.3L10.7 15.9L10.5 13.5H12V11.5H10.5V8.4H12Z" fill="white" />
            <path d="M12 8.4H15.6L15.3 11.5H12V13.5H15.1L14.7 17.5L12 18.3V20.3L16.8 18.9L17.4 11.5H12V8.4Z" fill="#EBEBEB" />
          </svg>
        );
      case 'css3':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M4 2L5.8 20.2L12 22L18.2 20.2L20 2H4Z" fill="#1572B6" />
            <path d="M12 3.8V20.2L16.8 18.8L18.3 3.8H12Z" fill="#33A9DC" />
            <path d="M12 8.4H8.4L8.7 11.5H12V8.4ZM8.8 13.5L9 15.6L12 16.4V14.4L10.7 14L10.6 13.5H8.8Z" fill="white" />
            <path d="M12 8.4V11.5H15.3L15.1 13.5H12V15.6H14.9L14.6 18.3L12 19V21L16.8 19.6L17.4 12.2H12V8.4Z" fill="#EBEBEB" />
          </svg>
        );
      case 'javascript':
        return (
          <div className="w-8 h-8 rounded bg-[#F7DF1E] flex items-end justify-end p-1 text-slate-900 font-extrabold text-xs">
            JS
          </div>
        );
      case 'react':
        return (
          <svg className="w-8 h-8 animate-spin-slow" viewBox="-11.5 -10.23 23 20.46" fill="none">
            <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
            <g stroke="#61DAFB" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        );
      case 'nodejs':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#339933">
            <path d="M12 2L3 7.2V17.5L12 22.7L21 17.5V7.2L12 2ZM11 19.5L5 16V9.3L11 12.8V19.5ZM13 19.5V12.8L19 9.3V16L13 19.5Z" />
          </svg>
        );
      case 'php':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#777BB4">
            <path d="M12 4C6.5 4 2 7.6 2 12s4.5 8 10 8 10-3.6 10-8-4.5-8-10-8zm-5.5 11.2l1-4.7h2.2c1.2 0 2 .6 1.7 1.8-.3 1.2-1.3 1.7-2.4 1.7H8.1l-.6 2.4H6.5zm7.3 0l1-4.7h2.2c1.2 0 2 .6 1.7 1.8-.3 1.2-1.3 1.7-2.4 1.7h-.9l-.6 2.4h-1zm-3-2.4h1.1c.5 0 .9-.2 1-.7.1-.5-.2-.7-.7-.7h-1.1l-.3 1.4z" />
          </svg>
        );
      case 'mysql':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#00758F">
            <path d="M18.8 6.5C18.2 4.4 16.3 3 13.9 3c-3.1 0-5.7 2.4-6.1 5.4-2.8.5-5 3-5 6 0 3.4 2.8 6.1 6.2 6.1h9.3c3.2 0 5.7-2.6 5.7-5.7 0-3.7-2.6-7.2-5.2-8.3z" />
          </svg>
        );
      case 'wordpress':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#21759B">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-8.2 10c0-1.7.5-3.3 1.4-4.6l4.4 12c-3.5-1.5-5.8-4.7-5.8-7.4zm8.2 8.2c-.9 0-1.7-.1-2.5-.4L12.5 11l2.7 7.6c-1 .4-2.1.6-3.2.6zm1.3-12.8c.6 0 1.2.1 1.2.1s-.4 1.6-.4 2.8c0 1.2.7 2.1 1.3 3.3.6 1.1 1.2 2.6 1.2 4.3 0 .7-.1 1.3-.3 1.9L19.2 10c-.7-3.8-3.4-6.4-5.9-6.4z" />
          </svg>
        );
      case 'git':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#F05032">
            <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L9.4 4 12 6.6c.6-.2 1.4 0 1.8.5.5.5.6 1.2.4 1.8l2.6 2.6c.6-.2 1.3 0 1.8.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.6-1.3-.4-1.9l-2.4-2.4v5.3c.2.1.4.3.5.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.4-.4.6-.5V8.9c-.2-.1-.4-.3-.6-.5-.5-.5-.6-1.3-.3-1.9L8.3 5.1 2.4 11c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.6-8.6c.6-.6.6-1.5 0-2.1z" />
          </svg>
        );
      case 'figma':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M8 24C10.2 24 12 22.2 12 20V16H8C5.8 16 4 17.8 4 20C4 22.2 5.8 24 8 24Z" fill="#0ACF83" />
            <path d="M4 12C4 9.8 5.8 8 8 8H12V16H8C5.8 16 4 14.2 4 12Z" fill="#A259FF" />
            <path d="M4 4C4 1.8 5.8 0 8 0H12V8H8C5.8 8 4 6.2 4 4Z" fill="#F24E1E" />
            <path d="M12 0H16C18.2 0 20 1.8 20 4C20 6.2 18.2 8 16 8H12V0Z" fill="#FF7262" />
            <path d="M20 12C20 14.2 18.2 16 16 16C13.8 16 12 14.2 12 12C12 9.8 13.8 8 16 8C18.2 8 20 9.8 20 12Z" fill="#1ABCFE" />
          </svg>
        );
      case 'laravel':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF2D20">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 18.5L3.5 15.8V9.2L12 13.5l8.5-4.3v6.6L12 20.5z" />
          </svg>
        );
      case 'woocommerce':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#96588A">
            <path d="M21.5 5.5H2.5C1.7 5.5 1 6.2 1 7v10c0 .8.7 1.5 1.5 1.5h19c.8 0 1.5-.7 1.5-1.5V7c0-.8-.7-1.5-1.5-1.5zM6 14.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
          </svg>
        );
      case 'vue':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M2 3H6L12 13.5L18 3H22L12 20.5L2 3Z" fill="#42B883" />
            <path d="M6 3H9.5L12 7.5L14.5 3H18L12 13.5L6 3Z" fill="#35495E" />
          </svg>
        );
      case 'bootstrap':
        return (
          <div className="w-8 h-8 rounded bg-[#7952B3] flex items-center justify-center text-white font-extrabold text-base">
            B
          </div>
        );
      case 'github':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
          </svg>
        );
      default:
        return (
          <div className="w-8 h-8 rounded bg-purple-900/60 flex items-center justify-center text-purple-300 font-bold text-xs">
            CODE
          </div>
        );
    }
  };

  const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'cms', label: 'CMS & E-commerce' },
    { id: 'tools', label: 'Herramientas' },
  ];

  const filteredTech =
    activeCategory === 'todas'
      ? technologiesData
      : technologiesData.filter((t) => t.categoria === activeCategory);

  return (
    <section id="tecnologias" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 block">
            TECNOLOGÍAS QUE USO
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Herramientas con las que{' '}
            <br className="hidden sm:inline" />
            hago realidad{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              tus ideas
            </span>
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-sm'
                  : 'bg-[#11162b]/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Technology Cards Grid matching screenshot squircle cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
          {filteredTech.map((tech) => (
            <div
              key={tech.id}
              className="group p-4 rounded-2xl bg-[#11162b] border border-purple-900/30 hover:border-purple-500/60 shadow-md hover:shadow-purple-950/40 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default min-h-[105px]"
            >
              <div className="mb-2.5 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {getTechSvg(tech.id)}
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                {tech.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
