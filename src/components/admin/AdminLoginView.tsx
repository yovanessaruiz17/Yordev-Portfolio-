import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
  QrCode,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Zap,
  HelpCircle,
  ShieldOff,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  getLockoutStatus,
  verify2FACode,
  getAuthenticatorUri,
  generateCurrentTotpCode,
  saveTwoFactorConfig,
  DEFAULT_2FA_SECRET,
} from '../../utils/auth';
import { AdminUser } from '../../types';

interface AdminLoginViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const { loginAdmin, completeTwoFactorLogin, twoFactorConfig, updateTwoFactorConfig } = usePortfolio();

  // Paso 1: Identificador y Contraseña
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Paso 2: Autenticación de Dos Factores (2FA)
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Modal de vinculación QR
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Código TOTP en vivo y temporizador de 30 segundos
  const [liveCode, setLiveCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);

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

  // Generar código QR offline localmente con qrcode
  useEffect(() => {
    const secret = twoFactorConfig.secret || DEFAULT_2FA_SECRET;
    const uri = getAuthenticatorUri(secret, identifier || 'yorle170203@gmail.com');
    QRCode.toDataURL(uri, {
      width: 250,
      margin: 1,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error QR:', err));
  }, [twoFactorConfig.secret, identifier]);

  // Actualizar código en vivo y contador de tiempo
  useEffect(() => {
    const tick = () => {
      const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
      setSecondsLeft(sec);
      setLiveCode(generateCurrentTotpCode(twoFactorConfig.secret || DEFAULT_2FA_SECRET));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [twoFactorConfig.secret]);

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
          setPendingUser(result.user);
          setStep('2fa');
          setErrorMessage(null);
        } else {
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

  const handle2FASubmit = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToValidate = customCode || twoFactorCode;

    if (!codeToValidate.trim()) {
      setErrorMessage('Ingresa el código o pulsa uno de los accesos directos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const validation = verify2FACode(codeToValidate);
    if (validation.valid && pendingUser) {
      completeTwoFactorLogin(pendingUser);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(validation.reason || 'Código inválido. Usa el PIN maestro: 170203');
      setIsLoading(false);
    }
  };

  // Botón para acceder directamente desactivando el 2FA con 1 clic
  const handleDisable2FAAndLogin = () => {
    const updated = { ...twoFactorConfig, enabled: false };
    updateTwoFactorConfig(updated);
    saveTwoFactorConfig(updated);
    if (pendingUser) {
      completeTwoFactorLogin(pendingUser);
      if (onSuccess) onSuccess();
    } else {
      setShowSetupModal(false);
      setErrorMessage('Autenticador 2FA desactivado. Ahora puedes ingresar directamente con tu contraseña.');
    }
  };

  const isLocked = lockoutSeconds > 0;
  const secretKey = twoFactorConfig.secret || DEFAULT_2FA_SECRET;

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-[#101524] border border-purple-900/50 rounded-2xl shadow-2xl shadow-purple-950/60 relative animate-in fade-in zoom-in-95 duration-200">
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

      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-900/50 mb-3 border border-purple-400/30">
          {showSetupModal ? (
            <QrCode className="w-7 h-7 text-purple-200" />
          ) : step === 'credentials' ? (
            <Lock className="w-7 h-7" />
          ) : (
            <Smartphone className="w-7 h-7 text-emerald-300" />
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {showSetupModal
            ? 'Vincular Google Authenticator'
            : step === 'credentials'
            ? 'Acceso de Administración'
            : 'Código de Autenticación (2FA)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          {showSetupModal
            ? 'Escanea el código QR desde tu app o copia la clave manual.'
            : step === 'credentials'
            ? 'Ingresa tus credenciales para acceder a la gestión de tu portafolio.'
            : 'Introduce el código de 6 dígitos o usa el acceso directo de emergencia.'}
        </p>

        {!showSetupModal && (
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
        )}
      </div>

      {/* Alerta de bloqueo por intentos fallidos */}
      {isLocked && !showSetupModal && (
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

      {/* ============================================================== */}
      {/* VISTA 1: MODAL DE VINCULACIÓN CON QR OFFLINE Y CLAVE MANUAL    */}
      {/* ============================================================== */}
      {showSetupModal ? (
        <div className="space-y-4 text-left animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Para ver códigos en tu Google Authenticator:</span>
            </p>
            <p className="text-[11px] text-slate-300">
              1. En tu celular abre <strong>Google Authenticator</strong> y pulsa el botón <strong>+</strong>.
            </p>
            <p className="text-[11px] text-slate-300">
              2. Elige <strong>&quot;Escanear código QR&quot;</strong> y apunta a la imagen de abajo.
            </p>
          </div>

          {/* Imagen QR generada localmente sin servidores externos */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#090d16] border border-purple-900/60">
            {qrDataUrl ? (
              <div className="p-2 bg-white rounded-xl shadow-lg border border-purple-500">
                <img src={qrDataUrl} alt="Código QR Authenticator" className="w-44 h-44 object-contain rounded" />
              </div>
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                Generando QR...
              </div>
            )}
            <p className="text-[11px] text-slate-400 font-mono mt-2">
              Clave manual: <strong className="text-purple-300">{secretKey}</strong>
            </p>
          </div>

          {/* Botón de acceso directo para saltar el autenticador */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
            <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>¿No quieres usar la app o no te genera código?</span>
            </p>
            <p className="text-[11px] text-slate-300">
              Puedes entrar directamente sin necesidad de Google Authenticator haciendo clic aquí:
            </p>
            <button
              type="button"
              onClick={handleDisable2FAAndLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldOff className="w-4 h-4" />
              <span>Desactivar 2FA y Entrar Directamente</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSetupModal(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Volver a la pantalla de Acceso
          </button>
        </div>
      ) : step === 'credentials' ? (
        /* ============================================================== */
        /* VISTA 2: FORMULARIO DE USUARIO Y CONTRASEÑA                    */
        /* ============================================================== */
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Usuario o Correo Electrónico</span>
            </label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

          {/* Botones de ayuda al pie del login */}
          <div className="pt-3 border-t border-purple-900/30 flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="text-purple-300 hover:text-white underline cursor-pointer"
            >
              📱 Ver Código QR de Google Authenticator
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={handleDisable2FAAndLogin}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              🔓 Desactivar 2FA y Entrar Directo
            </button>
          </div>
        </form>
      ) : (
        /* ============================================================== */
        /* VISTA 3: PASO 2 - CÓDIGO DE AUTENTICACIÓN (2FA)                 */
        /* ============================================================== */
        <div className="space-y-4 text-left">
          {/* BANNER 1: CÓDIGO DE ACCESO INMEDIATO EN PANTALLA */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-purple-950/40 to-[#0f1424] border border-emerald-700/50 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Código Actual Generado por el Sistema:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> {secondsLeft}s
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="px-4 py-2 rounded-xl bg-[#070a14] border border-emerald-500/60 font-mono text-2xl font-black tracking-widest text-emerald-300">
                {liveCode}
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorCode(liveCode);
                  handle2FASubmit(undefined, liveCode);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Entrar con este código</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              * Haz clic en el botón verde para entrar de inmediato sin tener que copiar nada.
            </p>
          </div>

          {/* BANNER 2: PIN MAESTRO DE RESCATE (170203) */}
          <div className="p-3 rounded-xl bg-[#090d16] border border-purple-900/50 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              <span className="text-slate-400 block text-[10px]">PIN Maestro de Emergencia:</span>
              <code className="text-purple-300 font-mono font-bold text-sm">170203</code>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorCode('170203');
                handle2FASubmit(undefined, '170203');
              }}
              className="py-1.5 px-3 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold border border-purple-700/50 transition-colors cursor-pointer"
            >
              Usar PIN 170203
            </button>
          </div>

          {/* FORMULARIO MANUAL SI QUIERE INTRODUCIR SU CÓDIGO */}
          <form onSubmit={(e) => handle2FASubmit(e)} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 text-center">
                O escribe aquí cualquier código de 6 dígitos:
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="170203"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-purple-800 focus:border-purple-400 text-center font-mono text-2xl font-bold tracking-widest text-white outline-none placeholder-slate-600"
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
                disabled={isLoading}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verificar y Entrar</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* OPCIÓN PARA DESACTIVAR 2FA COMPLETAMENTE */}
          <div className="pt-2 border-t border-purple-900/30 text-center space-y-1.5">
            <button
              type="button"
              onClick={handleDisable2FAAndLogin}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer block mx-auto"
            >
              🔓 Desactivar 2FA para siempre y entrar sin códigos
            </button>
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer block mx-auto"
            >
              📱 Ver Código QR de Google Authenticator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
