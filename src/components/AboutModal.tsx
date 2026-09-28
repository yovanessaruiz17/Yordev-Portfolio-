import React from 'react';
import { X, CheckCircle2, MapPin, Award, BookOpen, MessageCircle } from 'lucide-react';
import { personalInfo, statsData } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { socialLinks } = usePortfolio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1428] border border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700/60 transition-colors"
          aria-label="Cerrar modal Sobre mí"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-purple-900/30">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-purple-500/60 shadow-[0_0_20px_rgba(124,58,237,0.3)] shrink-0">
            <img
              src="/assets/img/hero/yorleidys_avatar.jpg"
              alt={personalInfo.nombre}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
              {personalInfo.marca}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">
              {personalInfo.nombre}
            </h3>
            <p className="text-sm text-purple-300/90 font-medium mb-3">
              {personalInfo.titulo}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{personalInfo.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-4 mb-8 text-slate-300 text-sm sm:text-base leading-relaxed text-left">
          <p>
            {personalInfo.aboutTexto}
          </p>
          <p>
            Trabajo con enfoque en resultados medibles: optimización de tiempos de carga, código modular y arquitecturas adaptadas al crecimiento de cada cliente. Mi objetivo es que cada plataforma no solo luzca estética, sino que se convierta en una herramienta de negocio activa y rentable.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#11162b] border border-purple-900/30 mb-8">
          {statsData.map((stat) => (
            <div key={stat.id} className="text-center">
              <span className="text-2xl font-extrabold text-white block">{stat.valor}</span>
              <span className="text-xs text-slate-400 leading-tight block">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mb-8 text-left">
          <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
            Pilares de trabajo
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Arquitectura Frontend y Backend moderna',
              'Sistemas de Ecommerce y conversión',
              'Auditoría y SEO Técnico',
              'Diseño UI/UX centrado en el usuario',
            ].map((pillar, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-purple-900/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60"
          >
            Cerrar
          </button>
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/40"
          >
            <span>Hablemos por WhatsApp</span>
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
