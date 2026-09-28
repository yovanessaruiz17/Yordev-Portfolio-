import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RotateCcw,
  User,
  Shield,
  Clock,
  Sparkles,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { resetPasswordToDefault, DEFAULT_ADMIN_PASSWORD } from '../../utils/auth';

export const SecuritySettingsView: React.FC = () => {
  const { adminAuth, changePassword, logoutAdmin, twoFactorConfig, updateTwoFactorConfig } = usePortfolio();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [copiedBackup, setCopiedBackup] = useState(false);

  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [confirmReset, setConfirmReset] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Todos los campos son obligatorios.' });
      return;
    }

    if (newPassword.length < 8) {
      setStatusMessage({
        type: 'error',
        text: 'La nueva contraseña debe tener al menos 8 caracteres para ser segura.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: '¡Contraseña actualizada exitosamente! Recuerda guardarla en un lugar seguro.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Error al actualizar contraseña.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Ocurrió un fallo inesperado al cambiar la contraseña.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    await resetPasswordToDefault();
    setConfirmReset(false);
    setStatusMessage({
      type: 'success',
      text: `Contraseña restablecida al valor de fábrica: ${DEFAULT_ADMIN_PASSWORD}`,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Tarjeta de Perfil de Administrador */}
      <div className="p-5 rounded-2xl bg-[#12182b] border border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-950/60 font-bold text-lg">
            YR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Yorleidys Ruiz</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Superadmin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{adminAuth.user?.email || 'yorle170203@gmail.com'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutAdmin}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 hover:border-rose-700 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Tarjeta de Autenticación en Dos Pasos (2FA) */}
      <div className="p-5 rounded-2xl bg-[#12182b] border border-purple-900/40 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">Autenticación de Dos Factores (2FA)</h4>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                    twoFactorConfig.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {twoFactorConfig.enabled ? 'Activado' : 'Desactivado'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exige un código numérico temporal de 6 dígitos además de la contraseña maestra en cada login.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const updated = { ...twoFactorConfig, enabled: !twoFactorConfig.enabled };
              updateTwoFactorConfig(updated);
              setStatusMessage({
                type: 'success',
                text: updated.enabled
                  ? 'Autenticación de Dos Factores (2FA) activada correctamente.'
                  : 'Autenticación de Dos Factores (2FA) desactivada.',
              });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              twoFactorConfig.enabled
                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50'
            }`}
          >
            {twoFactorConfig.enabled ? 'Desactivar 2FA' : 'Activar 2FA'}
          </button>
        </div>

        {twoFactorConfig.enabled && (
          <div className="pt-3 border-t border-purple-900/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Códigos de Respaldo de Emergencia:</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(twoFactorConfig.backupCodes.join(', '));
                  setCopiedBackup(true);
                  setTimeout(() => setCopiedBackup(false), 2000);
                }}
                className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedBackup ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBackup ? '¡Copiados!' : 'Copiar códigos'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {twoFactorConfig.backupCodes.map((code, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#070a14] border border-purple-900/60 font-mono text-xs text-purple-200"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta con Mecanismos de Seguridad Activos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0e1322] border border-purple-900/30 text-left">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Cifrado SHA-256</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Contraseñas procesadas mediante hash criptográfico salado, nunca almacenadas en texto plano.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e1322] border border-purple-900/30 text-left">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Anti-Fuerza Bruta</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Bloqueo automático tras 5 intentos fallidos consecutivos para prevenir ataques automatizados.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e1322] border border-purple-900/30 text-left">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Filtro Anti-Inyección</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Rechazo automático de scripts, payloads JSON maliciosos y etiquetas ejecutables en formularios.
          </p>
        </div>
      </div>

      {/* Formulario de Cambio de Contraseña */}
      <div className="p-6 rounded-2xl bg-[#101524] border border-purple-900/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Cambiar Contraseña Maestra</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Actualiza tu clave de acceso. Recuerda no compartirla con personas externas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswords ? 'Ocultar' : 'Mostrar'} claves</span>
          </button>
        </div>

        {/* Mensaje de estado */}
        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-800/80 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{statusMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contraseña Actual
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu clave actual"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nueva Contraseña (mínimo 8 caracteres)
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva clave segura"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva clave"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Guardar Nueva Contraseña</span>
                </>
              )}
            </button>

            {/* Restablecer por defecto si es necesario */}
            <div>
              {confirmReset ? (
                <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/80 p-1.5 rounded-xl">
                  <span className="text-[11px] text-rose-200">¿Restablecer a clave de fábrica?</span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold rounded-lg"
                  >
                    Sí, restablecer
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer a contraseña de fábrica</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
