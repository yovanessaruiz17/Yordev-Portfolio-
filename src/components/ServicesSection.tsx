import React, { useState } from 'react';
import {
  Monitor,
  Layout,
  ShoppingBag,
  Settings,
  Zap,
  Layers,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { servicesData } from '../data/portfolioData';
import { Service } from '../types';

export const ServicesSection: React.FC = () => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'monitor':
        return <Monitor className="w-6 h-6 text-purple-300" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-purple-300" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-6 h-6 text-purple-300" />;
      case 'settings':
        return <Settings className="w-6 h-6 text-purple-300" />;
      case 'zap':
        return <Zap className="w-6 h-6 text-purple-300" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-purple-300" />;
      default:
        return <Monitor className="w-6 h-6 text-purple-300" />;
    }
  };

  const displayedServices = showAllServices ? servicesData : servicesData.slice(0, 4);

  return (
    <section id="servicios" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 block">
            ¿CÓMO PUEDO AYUDARTE?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Servicios que{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              impulsan tu negocio
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            Soluciones digitales completas, enfocadas en resultados y diseñadas para hacer crecer tu marca.
          </p>
        </div>

        {/* Services Grid (4 columns on desktop matching reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group p-6 rounded-2xl bg-[#11162b] border border-purple-900/30 hover:border-purple-500/60 shadow-lg hover:shadow-purple-950/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Icon square */}
                <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-700/40 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-purple-900/60 transition-all duration-300 shadow-sm">
                  {getServiceIcon(service.icono)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {service.titulo}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {service.descripcion}
                </p>
              </div>

              {/* Quick details hint */}
              <div className="pt-4 border-t border-purple-900/20 flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300 font-medium">
                <span>Ver detalles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* View all services toggle link matching reference */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors focus:outline-none focus:underline"
          >
            <span>{showAllServices ? 'Mostrar menos servicios' : 'Ver todos los servicios'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e1428] border border-purple-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center mb-5">
              {getServiceIcon(selectedService.icono)}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{selectedService.titulo}</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">{selectedService.descripcion}</p>

            {selectedService.caracteristicas && (
              <div className="mb-8">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
                  ¿Qué incluye este servicio?
                </h4>
                <ul className="space-y-2.5">
                  {selectedService.caracteristicas.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60"
              >
                Cerrar
              </button>
              <a
                href="#contacto"
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-950/50"
              >
                Cotizar este servicio
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
