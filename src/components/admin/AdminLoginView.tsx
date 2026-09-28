import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  X,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  getLockoutStatus,
  verify2FACode,
} from '../../utils/auth';
import { AdminUser } from '../../types';

interface AdminLoginViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const { loginAdmin, completeTwoFactorLogin, twoFactorConfig } = usePortfolio();

  // Paso 1: Identificador y Contraseña (campos limpios sin autocompletar credenciales públicas)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Paso 2: Autenticación de Dos Factores (2FA)
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Estado de bloqueo por fuerza bruta
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    const status = getLockoutStatus();
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  }, []);

  // Temporizador de cuenta regresiva si está bloqueado
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Ingresa tu correo y contraseña para continuar.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginAdmin(identifier, password, rememberMe);
      if (result.success && result.user) {
        if (twoFactorConfig.enabled) {
          // Avanzar a la verificación de dos factores
          setPendingUser(result.user);
          setStep('2fa');
          setErrorMessage(null);
        } else {
          // 2FA desactivado, acceder directamente
          if (onSuccess) onSuccess();
        }
      } else {
        setErrorMessage(result.error || 'Credenciales inválidas');
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
        if (result.lockedUntilSeconds) {
          setLockoutSeconds(result.lockedUntilSeconds);
        }
      }
    } catch {
      setErrorMessage('Ocurrió un error al procesar el inicio de sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setErrorMessage('Ingresa el código de 6 dígitos para completar el acceso.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const validation = verify2FACode(twoFactorCode);
    if (validation.valid && pendingUser) {
      completeTwoFactorLogin(pendingUser);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(validation.reason || 'Código 2FA incorrecto o expirado.');
      setIsLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#101524] border border-purple-900/50 rounded-2xl shadow-2xl shadow-purple-950/60 relative animate-in fade-in zoom-in-95 duration-200">
      {/* Botón de cerrar / cancelar */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header con icono según el paso */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-900/50 mb-3 border border-purple-400/30">
          {step === 'credentials' ? <Lock className="w-7 h-7" /> : <Smartphone className="w-7 h-7 text-emerald-300" />}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {step === 'credentials' ? 'Acceso de Administración' : 'Autenticación en Dos Pasos (2FA)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          {step === 'credentials'
            ? 'Panel protegido exclusivamente para la gestión de proyectos, blog, redes y configuración.'
            : 'Introduce el código temporal generado por tu autenticador o un código de respaldo.'}
        </p>

        {/* Indicador de pasos 1 de 2 */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span
            className={`w-8 h-1 rounded-full transition-all ${
              step === 'credentials' ? 'bg-purple-500' : 'bg-emerald-500'
            }`}
          />
          <span
            className={`w-8 h-1 rounded-full transition-all ${
              step === '2fa' ? 'bg-purple-500' : 'bg-purple-900/40'
            }`}
          />
        </div>
      </div>

      {/* Alerta de bloqueo por intentos fallidos */}
      {isLocked && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-pulse">
          <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Acceso bloqueado por protección anti-fuerza bruta</p>
            <p className="mt-0.5 text-rose-300">
              Espera <span className="font-bold text-white font-mono text-sm">{lockoutSeconds}s</span> para volver a intentar.
            </p>
          </div>
        </div>
      )}

      {/* Alerta de error */}
      {errorMessage && !isLocked && (
        <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            {remainingAttempts !== null && remainingAttempts > 0 && (
              <p className="mt-1 text-[11px] text-rose-300">
                Intentos restantes antes de bloqueo: <strong className="text-white">{remainingAttempts}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* PASO 1: FORMULARIO DE CREDENCIALES (CONFIDENCIAL) */}
      {step === 'credentials' && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Usuario o Correo Electrónico</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLocked || isLoading}
                placeholder="Ingresa tu correo o usuario"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span>Contraseña</span>
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || isLoading}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#090d16] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked || isLoading}
                className="w-4 h-4 rounded bg-[#090d16] border-purple-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-400">Mantener sesión iniciada</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLocked || isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-950/60 hover:shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Continuar a Validación</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* PASO 2: FORMULARIO 2FA (TWO-FACTOR AUTHENTICATION) */}
      {step === '2fa' && (
        <div className="space-y-4 text-left">
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Verificación de Seguridad</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ingresa el código temporal de 6 dígitos generado por tu autenticador o uno de tus códigos de respaldo registrados en el panel de seguridad.
            </p>
          </div>

          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                Código de verificación (6 dígitos):
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-purple-800 focus:border-purple-400 text-center font-mono text-2xl font-bold tracking-widest text-white outline-none placeholder-slate-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMessage(null);
                }}
                className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Volver
              </button>

              <button
                type="submit"
                disabled={isLoading || twoFactorCode.length < 6}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verificar & Acceder</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
