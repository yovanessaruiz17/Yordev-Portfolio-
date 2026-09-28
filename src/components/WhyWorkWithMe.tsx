import React from 'react';
import {
  Target,
  MessageSquare,
  ShieldCheck,
  Clock,
  Code2,
  HeartHandshake,
} from 'lucide-react';
import { valuePropsData } from '../data/portfolioData';

export const WhyWorkWithMe: React.FC = () => {
  const getPropIcon = (icono: string) => {
    switch (icono) {
      case 'target':
        return <Target className="w-5 h-5 text-purple-300" />;
      case 'message-square':
        return <MessageSquare className="w-5 h-5 text-purple-300" />;
      case 'check-circle-2':
        return <ShieldCheck className="w-5 h-5 text-purple-300" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-purple-300" />;
      case 'code-2':
        return <Code2 className="w-5 h-5 text-purple-300" />;
      case 'heart-handshake':
        return <HeartHandshake className="w-5 h-5 text-purple-300" />;
      default:
        return <Target className="w-5 h-5 text-purple-300" />;
    }
  };

  return (
    <section className="py-20 relative border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 block">
              ¿POR QUÉ TRABAJAR CONMIGO?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
              Más que código,{' '}
              <br />
              entrego{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                soluciones
              </span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-md">
              Cada proyecto es una alianza estratégica. Combino rigor técnico, sensibilidad visual y compromiso auténtico para que tu marca destaque y crezca en el ecosistema digital.
            </p>
          </div>

          {/* Right Column: 6 Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {valuePropsData.map((item) => (
              <div key={item.id} className="flex items-start gap-4 text-left group">
                {/* Icon box */}
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-purple-900/60 transition-all duration-200">
                  {getPropIcon(item.icono)}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                    {item.titulo}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
