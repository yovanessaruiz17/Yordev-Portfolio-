import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ExternalLink,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { GoogleIcon } from './admin/GoogleReviewsManager';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, socialLinks } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const googleReviewUrl =
    socialLinks.googleReviewUrl ||
    'https://search.google.com/local/writereview?placeid=ChIJyordev-cartagena';

  const defaultInviteMessage = `¡Hola! 👋 Te agradezco mucho por confiar en mi trabajo en el desarrollo de tu sitio web con YorDev.\n\n¿Podrías regalarme 1 minuto para dejar tu reseña y calificación en mi perfil de Google? Tu opinión me ayuda muchísimo:\n👉 ${googleReviewUrl}\n\n¡Muchas gracias! ✨`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyInviteMessage = () => {
    navigator.clipboard.writeText(defaultInviteMessage);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const totalReviews = testimonials.length;
  const averageRating =
    totalReviews > 0
      ? (
          testimonials.reduce((acc, curr) => acc + (Number(curr.estrellas) || 5), 0) /
          totalReviews
        ).toFixed(1)
      : '5.0';

  return (
    <section id="testimonios" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Google Reviews Trust Card */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/40 text-purple-300 mb-3">
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>OPINIONES Y CALIFICACIONES DE CLIENTES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Resultados que hablan{' '}
              <br className="hidden sm:inline" />
              por{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                sí solos
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              La satisfacción de cada cliente es mi mayor carta de presentación. Lee las experiencias reales de empresas y emprendedores que han confiado en YorDev.
            </p>
          </div>

          {/* Google Reviews Trust Badge & CTA */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1328]/90 border border-purple-500/40 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-2.5 shrink-0 shadow-inner">
                <GoogleIcon className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold text-white">{averageRating}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1">
                  <span>Google Reviews</span>
                  <span className="text-purple-400">•</span>
                  <span className="text-purple-300">{totalReviews} opiniones</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 hover:scale-[1.02] transition-all whitespace-nowrap"
                title="Abre tu perfil de Google para que cualquier cliente califique tu trabajo"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Dejar reseña en Google</span>
                <ExternalLink className="w-3 h-3 text-purple-200" />
              </a>

              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                title="Pedir reseña a un cliente"
                aria-label="Pedir reseña a un cliente"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel / Cards Grid */}
        {testimonials.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0f1424]/60 border border-purple-900/30">
            <GoogleIcon className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Sé el primero en dejar una reseña en Google</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              ¿Trabajaste conmigo recientemente? Califica tu experiencia de desarrollo de software y ayúdame a seguir creciendo.
            </p>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
            >
              <span>Calificar en Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop: 3-4 cards grid; Mobile: carousel slide */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item, index) => {
                const isVisibleOnMobile = index === currentIndex;

                return (
                  <div
                    key={item.id}
                    className={`p-6 sm:p-7 rounded-2xl bg-[#0f1424] border transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden group ${
                      item.isDemo
                        ? 'border-purple-900/30 hover:border-purple-500/50'
                        : 'border-purple-800/40 hover:border-purple-500/60'
                    } ${isVisibleOnMobile ? 'block' : 'hidden md:flex'}`}
                  >
                    {/* Top ambient glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors pointer-events-none" />

                    <div>
                      {/* Top Row: Google Badge & Origin */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center p-1 shrink-0">
                            <GoogleIcon className="w-full h-full" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-white leading-tight">Google Review</span>
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Verificada
                            </span>
                          </div>
                        </div>

                        {item.isDemo && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            title="Comentario de demostración editable desde el Panel de Administración"
                          >
                            Demo
                          </span>
                        )}
                      </div>

                      {/* Stars & Date */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(Number(item.estrellas) || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {item.fecha && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.fecha}
                          </span>
                        )}
                      </div>

                      {/* Testimonial Quote */}
                      <div className="relative mb-6">
                        <Quote className="w-6 h-6 text-purple-600/20 absolute -top-2 -left-2 pointer-events-none" />
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic relative z-10">
                          &quot;{item.comentario}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Client Info Footer */}
                    <div className="pt-4 border-t border-purple-900/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-10 h-10 rounded-full object-cover border border-purple-500/40 shadow-sm"
                            onError={(e) => {
                              // Fallback a inicial si la imagen falla
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {item.nombre.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {item.nombre}
                          </h4>
                          <p className="text-[11px] text-purple-400/90 font-medium">
                            {item.cargo}
                            {item.empresa && (
                              <span className="text-slate-400 font-normal"> • {item.empresa}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {googleReviewUrl && (
                        <a
                          href={googleReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
                          title="Ver en Google Reviews"
                        >
                          <span className="hidden sm:inline">Google</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation (Mobile only) */}
            {testimonials.length > 1 && (
              <div className="flex md:hidden items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="p-2.5 rounded-full bg-[#11162b] border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
                  aria-label="Comentario anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      type="button"
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
                  type="button"
                  onClick={nextSlide}
                  className="p-2.5 rounded-full bg-[#11162b] border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
                  aria-label="Siguiente comentario"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Compartir y Pedir Reseña a Clientes */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e1328] border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Pedir Reseña en Google a un Cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Copia este mensaje preparado con tu enlace oficial de Google Maps para enviarlo a tus clientes por WhatsApp o correo electrónico una vez finalices su proyecto.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#080c1a] border border-purple-900/40 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
              {defaultInviteMessage}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyInviteMessage}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡Mensaje Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Mensaje Completo</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(defaultInviteMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Compartir en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
