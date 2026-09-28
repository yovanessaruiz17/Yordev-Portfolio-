import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonialsData } from '../data/portfolioData';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 block">
            LO QUE DICEN MIS CLIENTES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Resultados que hablan{' '}
            <br className="hidden sm:inline" />
            por{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              sí solos
            </span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop: 3 cards grid; Mobile: active slide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((item, index) => {
              // On mobile, show only current index; on md+ show all 3
              const isVisibleOnMobile = index === currentIndex;

              return (
                <div
                  key={item.id}
                  className={`p-6 sm:p-7 rounded-2xl bg-[#11162b] border border-purple-900/30 hover:border-purple-500/50 shadow-lg flex flex-col justify-between transition-all duration-300 ${
                    isVisibleOnMobile ? 'block' : 'hidden md:flex'
                  }`}
                >
                  <div>
                    {/* 5 Stars Rating */}
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(item.estrellas)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative mb-6">
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                        "{item.comentario}"
                      </p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="pt-4 border-t border-purple-900/20 flex items-center gap-3.5">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-11 h-11 rounded-full object-cover border border-purple-500/40 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {item.nombre}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.cargo}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Arrow Navigation (Visible on mobile/tablet or interactive everywhere) */}
          <div className="flex md:hidden items-center justify-between mt-6">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-full bg-[#11162b] border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i ? 'w-6 bg-purple-500' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2.5 rounded-full bg-[#11162b] border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Pagination indicator dots matching screenshot */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-8">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <span className="w-2 h-2 rounded-full bg-purple-900/60" />
            <span className="w-2 h-2 rounded-full bg-purple-900/60" />
          </div>
        </div>
      </div>
    </section>
  );
};
