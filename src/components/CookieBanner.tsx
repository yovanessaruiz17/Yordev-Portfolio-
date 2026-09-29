import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

const COOKIE_CONSENT_KEY = 'yordev_cookie_consent_v1';

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha manifestado su consentimiento previamente
    try {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!savedConsent) {
        // Pequeño retardo para no interferir con la carga inicial visual
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Si localStorage no está disponible, no mostramos el banner repetidamente
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    } catch {
      //
    }
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'necessary');
    } catch {
      //
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Aviso de privacidad y cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-[#0d1224]/95 border border-purple-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 backdrop-blur-md text-slate-200 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cookie className="w-4 h-4" />
          </div>
          <span>Privacidad y Uso de Cookies</span>
        </div>
        <button
          onClick={handleAcceptNecessary}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Cerrar aviso de cookies"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
        Utilizamos almacenamiento local y cookies técnicas para garantizar la seguridad del sitio, prevenir spam (reCAPTCHA) y ofrecer una carga ultrarrápida de proyectos conforme a la <strong>Ley 1581 de 2012</strong> y el <strong>RGPD</strong>. No realizamos rastreo publicitario invasivo.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-purple-900/30">
        <button
          type="button"
          onClick={handleAcceptAll}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/40 transition-colors text-center"
        >
          Aceptar Todas
        </button>

        <button
          type="button"
          onClick={handleAcceptNecessary}
          className="py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors text-center"
        >
          Solo Necesarias
        </button>

        <button
          type="button"
          onClick={onOpenCookiePolicy}
          className="py-2 px-2 text-xs font-medium text-purple-400 hover:text-purple-300 underline transition-colors text-center"
        >
          Ver Política
        </button>
      </div>
    </aside>
  );
};
