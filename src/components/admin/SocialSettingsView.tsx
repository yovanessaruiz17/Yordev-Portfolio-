import React, { useState } from 'react';
import {
  Share2,
  MessageCircle,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Check,
  Copy,
  Info,
  Smartphone,
  Send,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { defaultSocialLinks } from '../../data/portfolioData';

export const SocialSettingsView: React.FC = () => {
  const { socialLinks, updateSocialLinks } = usePortfolio();

  // Estados locales para editar antes de guardar
  const [whatsappNumber, setWhatsappNumber] = useState(
    socialLinks.whatsappNumber || '+57 300 000 0000'
  );
  const [whatsappMessage, setWhatsappMessage] = useState(
    socialLinks.whatsappMessage || 'Hola Yorleidys, me gustaría conversar sobre un proyecto web.'
  );
  const [githubUrl, setGithubUrl] = useState(socialLinks.github || '');
  const [linkedinUrl, setLinkedinUrl] = useState(socialLinks.linkedin || '');
  const [instagramUrl, setInstagramUrl] = useState(socialLinks.instagram || '');
  const [email, setEmail] = useState(socialLinks.email || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Calcula en tiempo real el enlace generado para WhatsApp
  const cleanDigits = whatsappNumber.replace(/\D/g, '');
  const computedWhatsAppUrl = cleanDigits
    ? `https://wa.me/${cleanDigits}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`
    : socialLinks.whatsapp || '#';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSocialLinks({
      whatsappNumber: whatsappNumber.trim(),
      whatsappMessage: whatsappMessage.trim(),
      whatsapp: computedWhatsAppUrl,
      github: githubUrl.trim(),
      linkedin: linkedinUrl.trim(),
      instagram: instagramUrl.trim(),
      email: email.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleReset = () => {
    setWhatsappNumber(defaultSocialLinks.whatsappNumber || '+57 300 000 0000');
    setWhatsappMessage(defaultSocialLinks.whatsappMessage || '');
    setGithubUrl(defaultSocialLinks.github);
    setLinkedinUrl(defaultSocialLinks.linkedin);
    setInstagramUrl(defaultSocialLinks.instagram);
    setEmail(defaultSocialLinks.email);
  };

  const handleCopyWhatsAppLink = () => {
    navigator.clipboard?.writeText(computedWhatsAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header explicativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1424] border border-purple-900/40">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50 shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Configuración de Redes & WhatsApp</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Enlace Directo
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Personaliza el número de WhatsApp conectado a los botones del sitio, junto a tus perfiles de GitHub, LinkedIn e Instagram.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">¡Cambios guardados correctamente!</p>
            <p className="text-emerald-300 text-xs mt-0.5">
              Los 2 botones de WhatsApp del sitio, los enlaces de GitHub, LinkedIn e Instagram ahora usan tu nueva configuración.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECCIÓN 1: CONFIGURACIÓN DESTACADA DE WHATSAPP */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0d1326] to-[#0d1120] border border-emerald-800/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-purple-900/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Número de WhatsApp para los Botones del Sitio</span>
                </h4>
                <p className="text-xs text-emerald-300/80">
                  Alimenta dinámicamente los 2 botones principales de llamada a la acción y el pie de página.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={computedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/60 cursor-pointer"
                title="Abrir chat en WhatsApp Web o móvil"
              >
                <span>Probar Enlace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Dónde se usa este número */}
          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-purple-900/40 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Lugares del sitio donde se aplica este número de WhatsApp:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-semibold text-white">Botón en Sección de Contacto</p>
                  <p className="text-slate-400">&quot;Hablemos de tu proyecto&quot; (tarjeta verde/morada)</p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-semibold text-white">Botón en Modal &quot;Sobre Mí&quot;</p>
                  <p className="text-slate-400">&quot;Hablemos por WhatsApp&quot; (acción rápida)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Número de Teléfono */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Número de Teléfono (con código de país)</span>
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+57 300 123 4567 o 573001234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-purple-900/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 font-mono outline-none transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Ejemplo para Colombia: <strong className="text-emerald-300 font-mono">+57 300 000 0000</strong> o <strong className="text-emerald-300 font-mono">573000000000</strong>.
              </p>
            </div>

            {/* Campo: Mensaje predeterminado */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mensaje Inicial Automático</span>
              </label>
              <input
                type="text"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Hola Yorleidys, me gustaría conversar sobre un proyecto web."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-purple-900/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Texto que aparecerá precargado cuando un visitante inicie el chat.
              </p>
            </div>
          </div>

          {/* Enlace generado en tiempo real */}
          <div className="p-3 rounded-xl bg-[#080c18] border border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-1 overflow-hidden">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Enlace generado en tiempo real:</span>
              <p className="text-xs font-mono text-emerald-300 truncate select-all">{computedWhatsAppUrl}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyWhatsAppLink}
              className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Copiar enlace de WhatsApp"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? '¡Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: REDES SOCIALES (GITHUB, LINKEDIN, INSTAGRAM, EMAIL) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1424] border border-purple-900/40 shadow-xl space-y-5">
          <div className="pb-3 border-b border-purple-900/30">
            <h4 className="text-sm sm:text-base font-bold text-white">Perfiles de Redes Sociales & Contacto</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Enlaces que se muestran en el pie de página (Footer) y en la sección de Contacto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* GITHUB */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Perfil de GitHub (git)</span>
                </span>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/tu-usuario"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>

            {/* LINKEDIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Perfil de LinkedIn</span>
                </span>
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/tu-perfil/"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>

            {/* INSTAGRAM */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Perfil de Instagram</span>
                </span>
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/tu-cuenta/"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-purple-400 text-sm">@</span>
                  <span>Correo Electrónico de Contacto</span>
                </span>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Enviar correo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@yorleidysruiz.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Valores Iniciales</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración de Redes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
