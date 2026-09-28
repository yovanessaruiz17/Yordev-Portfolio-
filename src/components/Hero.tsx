import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { personalInfo, statsData } from '../data/portfolioData';

interface HeroProps {
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section
      id="inicio"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>{personalInfo.heroEyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Transformo ideas en{' '}
              <br className="hidden sm:inline" />
              experiencias digitales{' '}
              <br className="hidden sm:inline" />
              que{' '}
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                conectan y convierten.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
              {personalInfo.heroDescripcion}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <a
                href="#proyectos"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 hover:shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{personalInfo.ctaPrincipal}</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-[#11162b]/80 hover:bg-[#1a203d] border border-purple-800/40 hover:border-purple-600/60 hover:text-white transition-all duration-200"
              >
                <span>{personalInfo.ctaSecundario}</span>
                <MessageCircle className="w-4 h-4 text-purple-400" />
              </a>
            </div>

            {/* Metrics & Statistics Row */}
            <div className="w-full pt-8 border-t border-purple-900/30 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
              {statsData.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {stat.valor}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Element */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Radial glow background behind developer */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-700/20 to-transparent rounded-full filter blur-3xl scale-90 -z-10" />

            {/* Central visual composition container */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Circular framing with glowing border */}
              <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full p-2 bg-gradient-to-b from-purple-500/40 via-purple-800/20 to-transparent border border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.35)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0d1222] relative">
                  <img
                    src="/assets/img/hero/yorleidys_avatar.jpg"
                    alt="Yorleidys Ruiz - Desarrolladora Web & Diseñadora Digital"
                    className="w-full h-full object-cover object-top scale-105 hover:scale-110 transition-transform duration-500"
                    loading="eager"
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Floating Element 1: Left Code badge `</>` */}
              <div className="absolute -left-2 sm:-left-6 top-1/4 p-3.5 rounded-2xl bg-[#11162b]/90 border border-purple-500/50 shadow-xl shadow-purple-950/60 backdrop-blur-md animate-bounce duration-[3000ms]">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center text-purple-300 font-mono font-bold text-lg">
                  {'</>'}
                </div>
              </div>

              {/* Floating Element 2: Right Top Code Window Mockup */}
              <div className="absolute -right-2 sm:-right-6 top-12 p-3 rounded-xl bg-[#11162b]/90 border border-purple-500/40 shadow-xl shadow-purple-950/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-purple-900/40">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <div className="h-1.5 bg-purple-400/80 rounded w-4/5" />
                  <div className="h-1.5 bg-slate-600/60 rounded w-full" />
                  <div className="h-1.5 bg-indigo-400/80 rounded w-3/5" />
                </div>
              </div>

              {/* Floating Element 3: Right Bottom Vector Pen Tool */}
              <div className="absolute -right-1 sm:-right-4 bottom-14 p-3 rounded-2xl bg-[#11162b]/90 border border-purple-500/40 shadow-xl shadow-purple-950/60 backdrop-blur-md animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-700/40 flex items-center justify-center text-purple-300">
                  <svg
                    className="w-5 h-5 text-purple-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 19 7-7 3 3-7 7-3-3z" />
                    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="m2 2 7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
