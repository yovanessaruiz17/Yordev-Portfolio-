import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Cookie,
  Scale,
  Printer,
  ExternalLink,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export type LegalTab = 'privacy' | 'terms' | 'cookies' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const { socialLinks } = usePortfolio();

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-4xl my-auto bg-[#0d1222] border border-purple-900/50 rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#11172c]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Centro de Cumplimiento Legal y Privacidad
              </h2>
              <p className="text-xs text-purple-300/80">
                Políticas de protección de datos (Ley 1581 de 2012 / RGPD), términos de servicio y cookies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-700 hover:text-white border border-slate-700/50 transition-colors"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
              aria-label="Cerrar modal legal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-purple-900/30 bg-[#0a0e1c] overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Protección de Datos (Ley 1581 / RGPD)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Términos y Condiciones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Política de Cookies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Aviso Legal y Descargo</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-300">
          {/* TAB 1: PRIVACY & DATA PROTECTION */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Cumplimiento Normativo Habeas Data</p>
                  <p className="text-purple-200/90 mt-0.5">
                    Esta política se rige por la <strong>Ley Estatutaria 1581 de 2012</strong> de la República de Colombia, su Decreto Reglamentario 1377 de 2013 y, con alcance internacional aplicable, el Reglamento General de Protección de Datos (<strong>RGPD / GDPR</strong> Reglamento UE 2016/679).
                  </p>
                  <p className="text-slate-400 mt-1">Última actualización: Septiembre de 2026</p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">1.</span> Identificación del Responsable del Tratamiento
                </h3>
                <p>
                  El responsable del tratamiento de sus datos personales recolectados a través de este sitio web (<strong className="text-white">yordevctg17.netlify.app</strong>) y sus canales oficiales es:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/30 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Titular / Razón Comercial:</span>
                    <strong className="text-white">Yorleidys Ruiz (YorDev)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Actividad Profesional:</span>
                    <span>Desarrollo de Software y Servicios Web Freelance</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ubicación y Domicilio:</span>
                    <span>Cartagena de Indias, Bolívar, Colombia</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Canal Oficial de Atención Habeas Data:</span>
                    <a href={`mailto:${socialLinks.email}`} className="text-purple-400 hover:underline font-mono">
                      {socialLinks.email}
                    </a>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">2.</span> Datos Personales que Recolectamos
                </h3>
                <p>
                  Únicamente solicitamos y procesamos los datos estrictamente necesarios para brindar atención comercial y técnica a través de nuestros formularios y canales de contacto:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong className="text-white">Datos de identificación y contacto:</strong> Nombre completo, dirección de correo electrónico, número de teléfono o enlace de WhatsApp.</li>
                  <li><strong className="text-white">Información del proyecto o consulta:</strong> Descripción de los requerimientos de desarrollo de software, presupuestos estimados y especificaciones comerciales compartidas voluntariamente por el usuario.</li>
                  <li><strong className="text-white">Datos técnicos y de seguridad:</strong> Dirección IP anonimizada, fecha y hora de envío, tokens de validación contra bots (Google reCAPTCHA) para prevenir ataques cibernéticos y spam.</li>
                </ul>
                <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30 text-xs text-purple-200/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>Importante:</strong> No recolectamos ni almacenamos datos sensibles (origen racial, convicciones religiosas o políticas, datos de salud ni biométricos) ni datos financieros de tarjetas de crédito directamente en este portal.</span>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">3.</span> Finalidades Específicas del Tratamiento
                </h3>
                <p>Los datos suministrados serán tratados con las siguientes finalidades legítimas:</p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>Responder a solicitudes de información, cotizaciones técnicas y propuestas comerciales de desarrollo web o aplicaciones.</li>
                  <li>Ejecutar y gestionar contratos de prestación de servicios de software formalizados entre el cliente y Yorleidys Ruiz.</li>
                  <li>Envío de comunicaciones directas relacionadas con el estado de avance, entregables o soporte técnico de proyectos en curso.</li>
                  <li>Garantizar la seguridad e integridad del sitio web, evitando inyecciones de código malicioso, ataques de fuerza bruta o envíos automatizados no autorizados.</li>
                </ol>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">4.</span> Derechos de los Titulares de los Datos (Derechos ARCO)
                </h3>
                <p>
                  De conformidad con el artículo 8 de la Ley 1581 de 2012 y el RGPD, usted como titular de la información tiene derecho a:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-1">✓ Conocer y Acceder:</strong>
                    Acceder de forma gratuita a los datos personales suministrados que se encuentren bajo nuestro tratamiento.
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-1">✓ Actualizar y Rectificar:</strong>
                    Solicitar la corrección de datos inexactos, incompletos, fraccionados o que induzcan a error.
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-1">✓ Suprimir (Derecho al Olvido):</strong>
                    Solicitar la eliminación total de sus datos cuando considere que no están siendo tratados conforme a la ley o hayan dejado de ser necesarios.
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-1">✓ Revocar la Autorización:</strong>
                    Revocar en cualquier momento el consentimiento otorgado para el tratamiento de su información.
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">5.</span> Procedimiento para Ejercer sus Derechos y Tiempos de Respuesta
                </h3>
                <p>
                  Para ejercer cualquiera de sus derechos, envíe una comunicación escrita al correo electrónico{' '}
                  <strong className="text-purple-300 font-mono">{socialLinks.email}</strong> con el asunto <em>&quot;Habeas Data - Ejercicio de Derechos&quot;</em>, indicando:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
                  <li>Nombre completo e identificación del titular.</li>
                  <li>Descripción clara y concisa de la solicitud (consulta, actualización, rectificación o eliminación).</li>
                  <li>Datos de contacto para notificar la respuesta.</li>
                </ul>
                <p className="text-xs text-slate-400 bg-[#090d1a] p-3 rounded-xl border border-purple-900/30">
                  ⏱️ <strong>Plazo legal de respuesta:</strong> Conforme al artículo 14 y 15 de la Ley 1581 de 2012, las consultas serán atendidas en un plazo máximo de diez (10) días hábiles, y los reclamos (supresión, rectificación o revocatoria) en un plazo máximo de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recepción.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">6.</span> Seguridad y Medidas Técnicas de Protección
                </h3>
                <p>
                  Implementamos rigurosas medidas técnicas y administrativas para salvaguardar sus datos contra accesos no autorizados, pérdida o alteración:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Cifrado SSL/TLS de 256 bits:</strong> Toda la transmisión de información viaja cifrada bajo protocolo HTTPS seguro.</li>
                  <li><strong>Base de datos en la nube con reglas estrictas (Firebase Firestore):</strong> Control de permisos a nivel de documento y validación de esquemas.</li>
                  <li><strong>Protección contra ataques:</strong> Filtros anti-XSS (Cross-Site Scripting), validación de expresiones regulares y bloqueo de inyecciones maliciosas.</li>
                  <li><strong>Autenticación de Dos Factores (2FA):</strong> Para el acceso administrativo al panel de gestión del portafolio.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">7.</span> Transferencia y Proveedores de Infraestructura Tecnológica
                </h3>
                <p>
                  No vendemos, alquilamos ni comercializamos datos personales con terceros para fines publicitarios. Para la operación y despliegue del portal, utilizamos proveedores de infraestructura de primer nivel que operan bajo estándares de cumplimiento de privacidad:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
                  <li><strong>Google Cloud Platform & Firebase:</strong> Almacenamiento seguro en la nube y autenticación.</li>
                  <li><strong>Netlify:</strong> Hospedaje web global y CDN de distribución de contenido seguro.</li>
                </ul>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-3">
                <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Términos de Navegación y Prestación de Servicios</p>
                  <p className="text-indigo-200/90 mt-0.5">
                    Las presentes condiciones regulan el acceso, uso del sitio web y las directrices generales de contratación de servicios de desarrollo de software y diseño web freelance con Yorleidys Ruiz.
                  </p>
                  <p className="text-slate-400 mt-1">Última actualización: Septiembre de 2026</p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">1.</span> Aceptación de los Términos
                </h3>
                <p>
                  Al navegar en este sitio web, enviar consultas a través de nuestros formularios o solicitar cotizaciones, el usuario manifiesta haber leído, comprendido y aceptado en su totalidad estos Términos y Condiciones. Si no está de acuerdo, deberá abstenerse de utilizar el portal.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">2.</span> Alcance de los Servicios Freelance
                </h3>
                <p>
                  Yorleidys Ruiz ofrece servicios profesionales especializados e independientes en:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Desarrollo de sitios web corporativos, landing pages y tiendas virtuales (E-commerce).</li>
                  <li>Desarrollo de aplicaciones web a medida con tecnologías modernas (React, Node.js, Laravel, PHP, WordPress).</li>
                  <li>Diseño de interfaces de usuario (UI/UX), sistemas de diseño y prototipado.</li>
                  <li>Optimización de velocidad de carga, SEO técnico y mantenimiento correctivo/preventivo.</li>
                </ul>
                <p className="text-xs text-slate-400">
                  Cada contratación específica se formaliza mediante una propuesta o cotización formal aprobada entre las partes, la cual define alcance técnico, cronograma de entregas, costo y condiciones de pago.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">3.</span> Cotizaciones, Pagos y Hitos de Desarrollo
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li><strong>Vigencia de las cotizaciones:</strong> Las cotizaciones emitidas tienen una validez de quince (15) días calendario a partir de su envío, tras lo cual podrán estar sujetas a revisión de tarifas o disponibilidad de agenda.</li>
                  <li><strong>Estructura de pagos por hitos:</strong> Salvo pacto en contrario, los proyectos de desarrollo se inician con un anticipo inicial del cincuenta por ciento (50%) y el saldo restante se abona contra entrega final previa a la puesta en producción.</li>
                  <li><strong>Cambios de alcance (Feature Creep):</strong> Cualquier requerimiento adicional, módulo nuevo o cambio estructural no contemplado en la propuesta inicial será cotizado como adición presupuestal y ajustará el cronograma de entrega.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">4.</span> Propiedad Intelectual y Derechos de Autor
                </h3>
                <p>
                  El régimen de derechos de autor se rige bajo la Ley 23 de 1982 de Colombia y la Decisión 351 de la Comunidad Andina:
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-0.5">A. Transferencia de derechos patrimoniales sobre desarrollos a medida:</strong>
                    Una vez liquidado y cancelado el cien por ciento (100%) del valor acordado del proyecto, el cliente adquiere los derechos patrimoniales exclusivos de uso y explotación sobre el código fuente final personalizado desarrollado para su negocio.
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-0.5">B. Derecho moral y exhibición en portafolio profesional:</strong>
                    Conforme a la legislación de propiedad intelectual, Yorleidys Ruiz conserva sus derechos morales de autora y la facultad de exhibir capturas, enlaces de demostración y mención de los proyectos culminados en su portafolio profesional y redes, con fines exclusivamente ilustrativos y curriculares.
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <strong className="text-white block mb-0.5">C. Componentes y librerías de código abierto (Open Source):</strong>
                    Los desarrollos pueden integrar dependencias de terceros (React, Tailwind CSS, Laravel, paquetes NPM) que se rigen por sus respectivas licencias públicas (MIT, Apache 2.0, BSD, GPL).
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">5.</span> Exclusión de Responsabilidad y Limitación de Garantías
                </h3>
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Cláusula Expresa de Limitación de Responsabilidad</span>
                  </div>
                  <p>
                    Yorleidys Ruiz presta servicios con altos estándares de diligencia profesional y buenas prácticas técnicas. Sin embargo, <strong>en ningún caso responderá por:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Caídas, interrupciones o fallas atribuibles a empresas de hosting externas, registradores de dominios o proveedores de internet ajenos al control de la desarrolladora.</li>
                    <li>Modificaciones, errores o desconfiguraciones causadas por terceros, el propio cliente o accesos no autorizados posteriores a la entrega.</li>
                    <li>Caídas de servicios de APIs externas de terceros (ej. pasarelas de pago PayU, Stripe, Wompi, APIs de Google Maps, WhatsApp Business o Facebook Pixel).</li>
                    <li>Lucro cesante, pérdidas comerciales, daños consecuenciales o indirectos derivados de la operación del negocio del cliente.</li>
                    <li>La legalidad, veracidad, derechos de autor o licencias de los textos, imágenes, marcas y productos que el cliente suministre para ser publicados en su web.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">6.</span> Ley Aplicable y Jurisdicción
                </h3>
                <p>
                  Estos Términos y Condiciones se rigen e interpretan bajo las leyes vigentes de la <strong className="text-white">República de Colombia</strong>. Cualquier conflicto o discrepancia que no pueda ser resuelta de común acuerdo en un plazo de treinta (30) días, se someterá a los centros de conciliación o jueces de la ciudad de <strong>Cartagena de Indias, Bolívar, Colombia</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: COOKIES POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                <Cookie className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Transparencia en Tecnologías de Rastreo y Almacenamiento</p>
                  <p className="text-purple-200/90 mt-0.5">
                    Este portal utiliza cookies técnicas y tecnologías de almacenamiento local para garantizar el funcionamiento seguro del sitio web y optimizar la experiencia de usuario.
                  </p>
                  <p className="text-slate-400 mt-1">Última actualización: Septiembre de 2026</p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">1.</span> ¿Qué son las Cookies y el Almacenamiento Web?
                </h3>
                <p>
                  Una cookie es un pequeño archivo de texto que un sitio web guarda en su navegador o dispositivo al visitarlo. Además de las cookies tradicionales, utilizamos tecnologías modernas como <strong className="text-white">LocalStorage</strong> y <strong className="text-white">SessionStorage</strong>, las cuales permiten almacenar información localmente en su dispositivo para acelerar la carga de la página sin transmitir datos a servidores publicitarios.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">2.</span> Tipos de Cookies y Tecnologías Utilizadas en este Sitio
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-white text-xs sm:text-sm">A. Cookies Técnicas y Estrictamente Necesarias</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        Siempre Activas
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Son indispensables para la navegación y el funcionamiento del portal. Permiten la comunicación segura entre su navegador y el servidor, la gestión de sesiones de usuario y la prevención de fraudes. No pueden ser desactivadas sin que el sitio deje de operar correctamente.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-white text-xs sm:text-sm">B. Almacenamiento Local de Rendimiento (LocalStorage)</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/40">
                        Rendimiento Local
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Almacena temporalmente en su propio dispositivo el catálogo de proyectos y artículos de blog de forma cifrada (caché rápida), evitando consultas repetitivas a la base de datos y garantizando que el sitio cargue instantáneamente incluso con conexiones lentas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/30">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-white text-xs sm:text-sm">C. Cookies de Seguridad de Terceros (Google reCAPTCHA)</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                        Seguridad Antifraude
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Utilizamos Google reCAPTCHA para verificar que los envíos en los formularios de contacto sean realizados por seres humanos y no por bots automatizados, salvaguardando la integridad del servicio contra spam masivo y ataques de denegación de servicio.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">3.</span> Lo que NO hacemos con las Cookies
                </h3>
                <div className="p-3 rounded-xl bg-[#090d1a] border border-emerald-900/40 text-xs space-y-1 text-slate-300">
                  <p className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Compromiso de Cero Rastreo Publicitario Invasivo</span>
                  </p>
                  <p>
                    Este sitio web <strong>NO utiliza cookies de rastreo comercial cruzado ni redes publicitarias de terceros (como Google AdSense o píxeles de retargeting invasivo)</strong> para perfilar su identidad con fines de venta de publicidad externa.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">4.</span> ¿Cómo Administrar o Desactivar las Cookies?
                </h3>
                <p>
                  Usted puede permitir, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración de las opciones de su navegador web:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#090d1a] border border-purple-900/30 text-center">
                    <strong className="text-white block">Google Chrome</strong>
                    <span className="text-[11px] text-slate-400">Configuración &gt; Privacidad y seguridad &gt; Cookies</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d1a] border border-purple-900/30 text-center">
                    <strong className="text-white block">Mozilla Firefox</strong>
                    <span className="text-[11px] text-slate-400">Ajustes &gt; Privacidad &amp; Seguridad</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d1a] border border-purple-900/30 text-center">
                    <strong className="text-white block">Apple Safari</strong>
                    <span className="text-[11px] text-slate-400">Preferencias &gt; Privacidad</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d1a] border border-purple-900/30 text-center">
                    <strong className="text-white block">Microsoft Edge</strong>
                    <span className="text-[11px] text-slate-400">Configuración &gt; Permisos de sitios</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: LEGAL NOTICE & DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-800/40 flex items-start gap-3">
                <Scale className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Aviso Legal, Titularidad y Descargo de Responsabilidad</p>
                  <p className="text-slate-300 mt-0.5">
                    Información legal de identificación y condiciones generales de exoneración de responsabilidad relativas a enlaces externos, demos y contenidos de terceros.
                  </p>
                  <p className="text-slate-400 mt-1">Última actualización: Septiembre de 2026</p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">1.</span> Información General del Titular
                </h3>
                <p>
                  En cumplimiento con el principio de transparencia en el comercio electrónico (Ley 527 de 1999 de Colombia):
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Titular:</strong> Yorleidys Ruiz (YorDev)</li>
                  <li><strong>Domicilio:</strong> Cartagena de Indias, Bolívar, Colombia</li>
                  <li><strong>Correo Electrónico de Contacto:</strong> <a href={`mailto:${socialLinks.email}`} className="text-purple-400 underline">{socialLinks.email}</a></li>
                  <li><strong>Sitio Web Oficial:</strong> yordevctg17.netlify.app</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">2.</span> Enlaces a Sitios Web de Terceros y Demostraciones
                </h3>
                <p>
                  Este sitio web puede contener enlaces o referencias a sitios web externos, proyectos de clientes, repositorios en GitHub, plataformas sociales o demostraciones interactivas.
                </p>
                <div className="p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/30 text-xs text-slate-300 space-y-1.5">
                  <p>
                    Yorleidys Ruiz <strong>no ejerce control alguno ni asume responsabilidad por los contenidos, políticas de privacidad, términos de uso, exactitud o disponibilidad</strong> de los sitios web de terceros enlazados.
                  </p>
                  <p className="text-slate-400">
                    La inclusión de cualquier enlace o mención de un cliente no implica una asociación, aval o sociedad mercantil entre Yorleidys Ruiz y los titulares de dichos sitios web externos.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">3.</span> Exactitud de la Información Técnica y Artículos de Blog
                </h3>
                <p>
                  Los artículos, guías técnicas y opiniones expresadas en la sección de Blog se publican con fines exclusivamente informativos y formativos. Si bien se procura mantener la información actualizada y precisa, la tecnología de software evoluciona constantemente; por tanto, no se garantiza que todo código, librería o procedimiento técnico esté libre de cambios por parte de sus desarrolladores originales.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-white border-b border-purple-900/30 pb-1.5 flex items-center gap-2">
                  <span className="text-purple-400">4.</span> Notificación de Infracción de Derechos de Autor
                </h3>
                <p>
                  Si alguna persona natural o jurídica considera que cualquier contenido, marca o imagen publicada en este sitio web vulnera sus derechos de propiedad intelectual, podrá comunicarlo inmediatamente al correo{' '}
                  <strong className="text-purple-400 font-mono">{socialLinks.email}</strong>, aportando la evidencia correspondiente. Procederemos a la revisión y retiro expedito del material si resultare procedente.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer info & close */}
        <div className="px-6 py-4 border-t border-purple-900/30 bg-[#0a0e1c] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Cartagena de Indias, Colombia • Válido para clientes nacionales e internacionales</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40"
            >
              Entendido y Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
