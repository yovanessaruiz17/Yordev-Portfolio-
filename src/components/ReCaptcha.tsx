import React, { useState, useEffect } from 'react';
import { ShieldCheck, RotateCw, Check, AlertCircle } from 'lucide-react';

interface ReCaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified: boolean;
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify, isVerified }) => {
  const [checking, setChecking] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeError, setChallengeError] = useState(false);

  const generateNewChallenge = () => {
    const n1 = Math.floor(Math.random() * 7) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setChallengeAnswer('');
    setChallengeError(false);
  };

  useEffect(() => {
    if (!isVerified) {
      generateNewChallenge();
    }
  }, [isVerified]);

  const handleCheckboxClick = () => {
    if (isVerified || checking) return;
    setChecking(true);

    // Simula comprobación heurística del navegador (reCAPTCHA v2 / v3 score)
    setTimeout(() => {
      setChecking(false);
      // Despliega desafío interactivo de verificación humana
      setShowChallenge(true);
      generateNewChallenge();
    }, 400);
  };

  const handleVerifyAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const expected = num1 + num2;
    if (parseInt(challengeAnswer.trim(), 10) === expected) {
      onVerify(true);
      setShowChallenge(false);
      setChallengeError(false);
    } else {
      setChallengeError(true);
      generateNewChallenge();
    }
  };

  return (
    <div className="w-full">
      {/* Widget principal estilo reCAPTCHA v2 / v3 Security */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090d1a] border border-purple-900/50 hover:border-purple-600/60 shadow-md transition-all">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="recaptcha-anchor-btn"
            onClick={handleCheckboxClick}
            disabled={isVerified || checking}
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              isVerified
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : checking
                ? 'border-purple-400 bg-purple-950/40'
                : 'border-slate-600 hover:border-purple-400 bg-[#0d1222]'
            }`}
            aria-label="Casilla de verificación reCAPTCHA No soy un robot"
          >
            {checking ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : isVerified ? (
              <Check className="w-5 h-5 text-white stroke-[2.5]" />
            ) : null}
          </button>

          <label
            onClick={handleCheckboxClick}
            className="text-xs sm:text-sm font-medium text-slate-200 select-none cursor-pointer"
          >
            {isVerified ? 'Verificación humana completada' : 'No soy un robot'}
          </label>
        </div>

        {/* Logo oficial y términos de reCAPTCHA */}
        <div className="flex flex-col items-end pl-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
            <svg viewBox="0 0 48 48" className="w-6 h-6 text-purple-400">
              <path
                fill="currentColor"
                d="M24 4C12.95 4 4 12.95 4 24c0 4.7 1.63 9.03 4.36 12.46l4.24-4.24C10.96 29.83 10 27.04 10 24c0-7.73 6.27-14 14-14 3.04 0 5.83.96 8.22 2.6l4.24-4.24C33.03 5.63 28.7 4 24 4zm15.64 7.54l-4.24 4.24C37.04 18.17 38 20.96 38 24c0 7.73-6.27 14-14 14-3.04 0-5.83-.96-8.22-2.6l-4.24 4.24C14.97 42.37 19.3 44 24 44c11.05 0 20-8.95 20-20 0-4.7-1.63-9.03-4.36-12.46z"
              />
            </svg>
            <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
              reCAPTCHA
            </span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-slate-400">
            <span>Privacidad</span>
            <span>-</span>
            <span>Términos</span>
          </div>
        </div>
      </div>

      {/* Desafío modal / popup cuando se solicita confirmación */}
      {showChallenge && !isVerified && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-purple-950/70 border border-purple-600/60 shadow-lg text-left animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Desafío de seguridad reCAPTCHA</span>
            </span>
            <button
              type="button"
              onClick={generateNewChallenge}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Generar otro desafío"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-2.5">
            Por favor resuelve la siguiente operación aritmética para confirmar que eres una persona real:
          </p>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#070a14] border border-purple-800/80 font-mono text-sm font-bold text-white tracking-widest select-none">
              {num1} + {num2} = ?
            </div>

            <input
              type="number"
              value={challengeAnswer}
              onChange={(e) => setChallengeAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleVerifyAnswer();
                }
              }}
              placeholder="Respuesta"
              autoFocus
              className="w-24 px-3 py-1.5 rounded-lg bg-[#070a14] border border-purple-700/60 focus:border-purple-400 text-sm text-white text-center font-mono outline-none"
            />

            <button
              type="button"
              onClick={() => handleVerifyAnswer()}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow transition-all cursor-pointer"
            >
              Verificar
            </button>
          </div>

          {challengeError && (
            <p className="mt-2 text-[11px] text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Resultado incorrecto. Intenta con este nuevo desafío.</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
