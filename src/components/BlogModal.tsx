import React, { useState } from 'react';
import { X, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BlogPost } from '../types';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  const { blogPosts } = usePortfolio();
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0e1428] border border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700/60 transition-colors"
          aria-label="Cerrar blog"
        >
          <X className="w-5 h-5" />
        </button>

        {selectedArticle ? (
          /* Article Reading View */
          <div className="text-left animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-semibold text-purple-400 hover:underline mb-4 inline-flex items-center gap-1.5"
            >
              ← Volver a artículos
            </button>

            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-900">
              <img
                src={selectedArticle.imagen}
                alt={selectedArticle.titulo}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-purple-950/80 text-purple-300 text-xs font-semibold backdrop-blur-sm border border-purple-500/30">
                {selectedArticle.categoria}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {selectedArticle.fecha}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {selectedArticle.tiempoLectura}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
              {selectedArticle.titulo}
            </h3>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-purple-900/30 pt-4">
              <p className="font-medium text-purple-200">
                {selectedArticle.extracto}
              </p>

              {selectedArticle.contenido ? (
                selectedArticle.contenido.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p>
                    En el desarrollo moderno, la experiencia del usuario final depende directamente de cómo estructuramos el código y priorizamos la carga de recursos críticos. Minimizar los scripts bloqueantes, adoptar renderizado eficiente y optimizar imágenes permite reducir drásticamente la tasa de rebote.
                  </p>
                  <p>
                    Al construir aplicaciones web con frameworks modernos como React, es vital mantener un estado desacoplado y componentes puros que faciliten el mantenimiento y la escalabilidad del producto a mediano y largo plazo.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Articles List View */
          <div className="text-left">
            <div className="mb-8">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-2">
                ARTÍCULOS Y RECURSOS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Blog de desarrollo y diseño
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Reflexiones técnicas, buenas prácticas y estrategias digitales.
              </p>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedArticle(post)}
                  className="group p-5 rounded-2xl bg-[#11162b] border border-purple-900/30 hover:border-purple-500/60 transition-all flex flex-col sm:flex-row gap-5 cursor-pointer shadow-md"
                >
                  <div className="sm:w-44 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={post.imagen}
                      alt={post.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-purple-400 font-medium mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/40">
                          {post.categoria}
                        </span>
                        <span className="text-slate-400">{post.fecha}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                        {post.titulo}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {post.extracto}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{post.tiempoLectura}</span>
                      <span className="text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Leer artículo <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
