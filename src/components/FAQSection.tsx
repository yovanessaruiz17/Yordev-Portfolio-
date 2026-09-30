import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FAQItem {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

export const faqsData: FAQItem[] = [
  {
    id: 'faq-1',
    categoria: 'Servicios',
    pregunta: '¿Qué servicios de desarrollo web y software ofrece Yorleidys Ruiz?',
    respuesta:
      'Ofrezco servicios integrales que van desde el diseño y desarrollo de sitios web corporativos y landing pages de alta conversión, hasta tiendas virtuales (E-commerce) completas con pasarelas de pago, aplicaciones web personalizadas con bases de datos en la nube (Firestore, SQL), diseño UI/UX en Figma y optimización de velocidad de carga con SEO y GEO técnico.',
  },
  {
    id: 'faq-2',
    categoria: 'Ubicación y Cobertura',
    pregunta: '¿Dónde presta servicios? ¿Trabaja únicamente en Cartagena o a nivel remoto?',
    respuesta:
      'Mi base de operaciones está en Cartagena de Indias, Bolívar, Colombia, pero trabajo de manera 100% remota con clientes en toda Colombia (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga) y a nivel internacional (Estados Unidos, España, México y Latinoamérica), manteniendo reuniones por Google Meet, comunicación constante por WhatsApp y entregas mediante repositorios seguros.',
  },
  {
    id: 'faq-3',
    categoria: 'Precios y Metodología',
    pregunta: '¿Cómo es el proceso de contratación y la modalidad de pago?',
    respuesta:
      'El proceso comienza con una conversación inicial para entender los requerimientos específicos de tu negocio. Te entrego una cotización formal y cronograma de entregables. Por lo general, se trabaja con un anticipo inicial del 50% al iniciar el proyecto y el 50% restante contra entrega final previa a la puesta en producción. Cada proyecto incluye garantía de soporte técnico.',
  },
  {
    id: 'faq-4',
    categoria: 'Tiempos de Entrega',
    pregunta: '¿Cuánto tiempo toma desarrollar una página web o tienda online?',
    respuesta:
      'El tiempo depende de la complejidad del proyecto: una landing page o sitio web corporativo estándar suele tomar entre 1 a 2 semanas; una tienda online con pasarela de pago y catálogo de productos toma entre 2 a 3 semanas; y aplicaciones web complejas con paneles administrativos a medida toman de 3 a 6 semanas, siempre con entregas parciales para revisión.',
  },
  {
    id: 'faq-5',
    categoria: 'Tecnología',
    pregunta: '¿Qué tecnologías utiliza en el desarrollo de software?',
    respuesta:
      'Utilizo un stack moderno, escalable y seguro adaptado a las necesidades de cada proyecto: en frontend React, TypeScript, Tailwind CSS, HTML5 y JavaScript moderno; en backend Node.js, Express, PHP y Laravel; en bases de datos Google Cloud Firestore, PostgreSQL y MySQL; y en CMS WordPress y WooCommerce cuando el cliente requiere autogestión de contenidos sin código.',
  },
  {
    id: 'faq-6',
    categoria: 'Garantía y Soporte',
    pregunta: '¿Qué garantía incluye el proyecto una vez entregado?',
    respuesta:
      'Todos los proyectos incluyen garantía de soporte técnico de 30 días posteriores al lanzamiento para resolver cualquier duda o ajuste sin costo adicional. Además, entrego documentación básica y capacitación si requieres administrar productos o entradas de blog tú mismo.',
  },
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const { socialLinks } = usePortfolio();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 relative" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/40 text-purple-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>RESPUESTAS DIRECTAS & DUDAS FRECUENTES</span>
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Preguntas{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Resolvemos las dudas más habituales sobre servicios de desarrollo web, metodologías de trabajo, tiempos de entrega y soporte técnico.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Questions Accordion */}
          <div className="lg:col-span-8 space-y-3.5">
            {faqsData.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? 'bg-[#10152c] border-purple-500/50 shadow-lg shadow-purple-950/30'
                      : 'bg-[#0c1020]/90 border-purple-900/30 hover:border-purple-600/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 hidden sm:inline-block">
                        {faq.categoria}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.pregunta}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-purple-300' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-purple-900/20 animate-in fade-in duration-150">
                      <p className="pt-3">{faq.respuesta}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Direct Contact CTA Card */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#121636] to-[#0c1024] border border-purple-500/40 shadow-xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">¿Tienes otra pregunta sobre tu proyecto?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Cuéntame los detalles de tu idea o requerimiento de software y te responderé con asesoría técnica personalizada.
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/40 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar por WhatsApp</span>
              </a>

              <a
                href="#contacto"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ir al formulario de contacto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
