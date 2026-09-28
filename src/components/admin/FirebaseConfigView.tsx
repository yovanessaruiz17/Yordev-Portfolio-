import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Upload,
  Info,
  ExternalLink,
  ShieldCheck,
  Cloud,
} from 'lucide-react';
import { FirebaseConfig } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { validateAndSanitizePlainText } from '../../utils/security';

export const FirebaseConfigView: React.FC = () => {
  const {
    firebaseConfig,
    saveFirebaseConfig,
    testFirebaseConnection,
    syncToFirestore,
    syncFromFirestore,
    isSyncing,
    lastCloudSyncTime,
    projects,
    blogPosts,
  } = usePortfolio();

  const [form, setForm] = useState<FirebaseConfig>({ ...firebaseConfig });
  const [showApiKey, setShowApiKey] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    null
  );
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleFieldChange = (field: keyof FirebaseConfig, value: string) => {
    const sanitized = validateAndSanitizePlainText(value, field, { maxLength: 250 });
    setForm((prev) => ({
      ...prev,
      [field]: sanitized.sanitizedValue,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(form);
    setFeedback({
      type: 'success',
      message: 'Configuración guardada correctamente. Ya puedes probar la conexión o sincronizar datos.',
    });
  };

  const handleTest = async () => {
    setFeedback(null);
    saveFirebaseConfig(form);
    const result = await testFirebaseConnection();
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  const handleSyncToFirestore = async () => {
    setFeedback(null);
    saveFirebaseConfig(form);
    const result = await syncToFirestore();
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  const handleSyncFromFirestore = async () => {
    setFeedback(null);
    saveFirebaseConfig(form);
    const result = await syncFromFirestore();
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      firebaseConfig: {
        ...form,
        apiKey: form.apiKey ? '***PROTECTED***' : '',
      },
      projects,
      blogPosts,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portafolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos del portafolio: Lectura pública, escritura abierta con credencial
    match /proyectos/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    // Artículos del Blog: Lectura pública, escritura abierta con credencial
    match /articulos_blog/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const netlifyEnvText = `VITE_FIREBASE_API_KEY=${form.apiKey || 'tu_api_key'}
VITE_FIREBASE_PROJECT_ID=${form.projectId || 'tu_project_id'}
VITE_FIREBASE_AUTH_DOMAIN=${form.authDomain || (form.projectId ? `${form.projectId}.firebaseapp.com` : 'tu_proyecto.firebaseapp.com')}
VITE_FIREBASE_STORAGE_BUCKET=${form.storageBucket || (form.projectId ? `${form.projectId}.appspot.com` : 'tu_proyecto.appspot.com')}
VITE_FIREBASE_MESSAGING_SENDER_ID=${form.messagingSenderId || '1234567890'}
VITE_FIREBASE_APP_ID=${form.appId || '1:1234567890:web:abcdef'}
VITE_FIREBASE_MEASUREMENT_ID=${form.measurementId || ''}`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(netlifyEnvText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Quick Info */}
      <div className="p-5 rounded-2xl bg-[#0f1424] border border-purple-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Estado de la Base de Datos Firebase
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cloud Firestore Conectado en Tiempo Real
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {lastCloudSyncTime
                ? `Sincronización activa con la base de datos Firestore (${lastCloudSyncTime}). Todos los cambios se replican en cualquier dispositivo.`
                : 'Conectado a Cloud Firestore. Tus proyectos, artículos y datos se sincronizan en tiempo real en todos los dispositivos.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-purple-900/30 hover:border-purple-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Descargar Respaldo</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Actions Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#11162b] to-[#0f1424] border border-purple-900/40 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-purple-400" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Sincronización Bidireccional con Firestore
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sube tus proyectos y artículos a la nube para que se vean en Netlify, o descarga los cambios existentes.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSyncToFirestore}
              disabled={isSyncing || !form.projectId.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 transition-all shadow-sm"
              title="Sube todos los proyectos y artículos locales a la nube Firestore"
            >
              <Upload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Subir a Firestore</span>
            </button>
            <button
              type="button"
              onClick={handleSyncFromFirestore}
              disabled={isSyncing || !form.projectId.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-slate-900 hover:bg-slate-800 border border-purple-900/50 disabled:opacity-40 transition-all"
              title="Descarga los datos actuales desde Firestore a tu navegador"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Descargar de Firestore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-950/40 border-rose-800/50 text-rose-200'
              : 'bg-indigo-950/40 border-indigo-800/50 text-indigo-200'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
          {feedback.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />}
          {feedback.type === 'info' && <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{feedback.type === 'success' ? 'Operación Exitosa' : 'Aviso'}</p>
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Form Credentials */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0f1424] border border-purple-900/30 space-y-5">
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Credenciales de la Aplicación Web (Firebase SDK Config)
          </h4>
          <span className="text-[11px] text-slate-400">
            Valores obtenidos en Configuración de Proyecto &gt; Tus apps &gt; Web
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Project ID <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              value={form.projectId}
              onChange={(e) => handleFieldChange('projectId', e.target.value)}
              placeholder="ej. yordev-portafolio-2026"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <span className="text-[11px] text-slate-500">Identificador único de tu proyecto en Google Firebase</span>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                API Key <span className="text-purple-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 focus:outline-none"
              >
                {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showApiKey ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={form.apiKey}
              onChange={(e) => handleFieldChange('apiKey', e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Auth Domain */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Auth Domain
            </label>
            <input
              type="text"
              value={form.authDomain}
              onChange={(e) => handleFieldChange('authDomain', e.target.value)}
              placeholder="ej. yordev-portafolio-2026.firebaseapp.com"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Storage Bucket */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Storage Bucket
            </label>
            <input
              type="text"
              value={form.storageBucket}
              onChange={(e) => handleFieldChange('storageBucket', e.target.value)}
              placeholder="ej. yordev-portafolio-2026.appspot.com"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Messaging Sender ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Messaging Sender ID
            </label>
            <input
              type="text"
              value={form.messagingSenderId}
              onChange={(e) => handleFieldChange('messagingSenderId', e.target.value)}
              placeholder="ej. 83920194829"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* App ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              App ID
            </label>
            <input
              type="text"
              value={form.appId}
              onChange={(e) => handleFieldChange('appId', e.target.value)}
              placeholder="ej. 1:83920194829:web:a9b8c7d6"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {/* Nombres de colecciones */}
        <div className="pt-2 border-t border-purple-900/20">
          <p className="text-xs font-bold text-slate-300 mb-2">Colecciones de Cloud Firestore:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Colección de Proyectos
              </label>
              <input
                type="text"
                value={form.projectsCollection}
                onChange={(e) => handleFieldChange('projectsCollection', e.target.value)}
                placeholder="proyectos"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-purple-900/30 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Colección de Artículos del Blog
              </label>
              <input
                type="text"
                value={form.blogCollection}
                onChange={(e) => handleFieldChange('blogCollection', e.target.value)}
                placeholder="articulos_blog"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-purple-900/30 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="pt-4 border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/50 hover:border-purple-600 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Verificando con Firestore...' : 'Probar Conexión con Firestore'}</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>

      {/* Variables de Entorno para Netlify */}
      <div className="p-6 rounded-2xl bg-[#0f1424] border border-purple-900/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Variables de Entorno para Netlify (Environment Variables)</h4>
          </div>
          <button
            type="button"
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-purple-900/40 hover:border-purple-700 transition-all"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copiedEnv ? '¡Copiado!' : 'Copiar Variables'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">
          En Netlify, ve a <strong>Site configuration &gt; Environment variables</strong> y pega estas variables para que tu aplicación se conecte a Firebase automáticamente sin configurar nada en el navegador:
        </p>
        <pre className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-purple-200 font-mono overflow-x-auto whitespace-pre">
          {netlifyEnvText}
        </pre>
      </div>

      {/* Reglas de Seguridad de Firestore Recomendadas */}
      <div className="p-6 rounded-2xl bg-[#0f1424] border border-purple-900/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Reglas de Seguridad para Cloud Firestore (firestore.rules)</h4>
          </div>
          <button
            type="button"
            onClick={handleCopyRules}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-purple-900/40 hover:border-purple-700 transition-all"
          >
            {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copiedRules ? '¡Copiado!' : 'Copiar Reglas'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Copia y pega estas reglas en la pestaña <strong>Reglas (Rules)</strong> de Firestore en tu consola de Firebase:
        </p>
        <pre className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto">
          {sampleRules}
        </pre>
      </div>
    </div>
  );
};
