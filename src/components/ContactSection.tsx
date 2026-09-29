import React, { useState } from 'react';
import { Mail, MapPin, Radio, Send, MessageCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ReCaptcha } from './ReCaptcha';

interface ContactSectionProps {
  onOpenLegal?: (tab?: 'privacy' | 'terms') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenLegal }) => {
  const { socialLinks } = usePortfolio();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!acceptedLegal) {
      setError('Debes autorizar el tratamiento de datos personales conforme a la Ley 1581 de 2012 para enviar el mensaje.');
      return;
    }

    if (!isCaptchaVerified) {
      setError('Por favor completa la verificación de seguridad reCAPTCHA antes de enviar.');
      return;
    }

    setError('');
    setSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setIsCaptchaVerified(false);
      setAcceptedLegal(false);
    }, 800);
  };

  return (
    <section id="contacto" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Glowing Container matching screenshot */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#121633] via-[#0e122b] to-[#0a0d20] border border-purple-500/30 p-8 sm:p-12 lg:p-16 shadow-[0_0_60px_-15px_rgba(124,58,237,0.3)] overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: YR Emblem & Info */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Glowing Monogram Card matching reference */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900/60 to-purple-950/80 border border-purple-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <span className="text-3xl font-extrabold bg-gradient-to-br from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">
                    YR
                  </span>
                  {/* Sparkle */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 text-purple-300 animate-pulse">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title & Copy */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                ¿Listo para llevar tu proyecto al siguiente nivel?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Cuéntame tu idea y trabajemos juntos para hacerla realidad.
              </p>

              {/* Contact Info Items */}
              <div className="flex flex-col gap-3.5 mb-8 text-sm text-slate-300">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex items-center gap-3 hover:text-purple-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{socialLinks.email}</span>
                </a>

                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Cartagena, Colombia</span>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Radio className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                  <span>Disponible para proyectos freelance y colaboraciones</span>
                </div>
              </div>

              {/* WhatsApp direct CTA */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/50 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all"
              >
                <span>Hablemos de tu proyecto</span>
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-6 w-full">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center animate-in zoom-in-95 duration-200">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">¡Mensaje enviado con éxito!</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Gracias por ponerte en contacto. Te responderé lo más pronto posible para conversar sobre tu proyecto.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ nombre: '', email: '', mensaje: '' });
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-900/60 hover:bg-purple-900"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Name and Email 2-column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Tu nombre"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#0b0e1e]/80 border border-purple-900/40 focus:border-purple-500 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#0b0e1e]/80 border border-purple-900/40 focus:border-purple-500 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Cuéntame sobre tu proyecto..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e1e]/80 border border-purple-900/40 focus:border-purple-500 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Casilla obligatoria de autorización Habeas Data / Términos */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#080c1a]/90 border border-purple-900/30">
                    <input
                      type="checkbox"
                      id="accept-legal-policies"
                      checked={acceptedLegal}
                      onChange={(e) => {
                        setAcceptedLegal(e.target.checked);
                        if (e.target.checked && error.includes('Ley 1581')) {
                          setError('');
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-purple-700 text-purple-600 focus:ring-purple-500 bg-[#0e1428] cursor-pointer shrink-0"
                      required
                    />
                    <label htmlFor="accept-legal-policies" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                      Autorizo el tratamiento de mis datos personales de acuerdo con la{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal?.('privacy')}
                        className="text-purple-400 hover:text-purple-300 underline font-semibold focus:outline-none"
                      >
                        Política de Tratamiento de Datos (Ley 1581 de 2012)
                      </button>{' '}
                      y acepto los{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal?.('terms')}
                        className="text-purple-400 hover:text-purple-300 underline font-semibold focus:outline-none"
                      >
                        Términos y Condiciones de Servicio
                      </button>.
                    </label>
                  </div>

                  {/* Widget reCAPTCHA Antispam */}
                  <div className="pt-1">
                    <ReCaptcha
                      isVerified={isCaptchaVerified}
                      onVerify={(val) => {
                        setIsCaptchaVerified(val);
                        if (val && error.includes('reCAPTCHA')) {
                          setError('');
                        }
                      }}
                    />
                  </div>

                  {/* Submit Button matching screenshot bright purple */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 hover:shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-60"
                  >
                    <span>{submitting ? 'Enviando mensaje...' : 'Enviar mensaje'}</span>
                    <Send className="w-4 h-4 text-purple-200" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
