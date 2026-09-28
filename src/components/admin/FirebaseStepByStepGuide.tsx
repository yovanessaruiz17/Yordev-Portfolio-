import React, { useState } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Copy,
  Check,
  Terminal,
  Database,
  Key,
  Globe,
  Lock,
  Cloud,
  Layers,
  ArrowRight,
  GitBranch,
  Settings,
} from 'lucide-react';

export const FirebaseStepByStepGuide: React.FC = () => {
  const [guideType, setGuideType] = useState<'firebase' | 'netlify'>('netlify');
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleStep = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const netlifySteps = [
    {
      id: 1,
      title: 'Paso 1: Subir tu Repositorio a GitHub (o GitLab/Bitbucket)',
      icon: <GitBranch className="w-5 h-5 text-purple-400" />,
      desc: 'Tener el código fuente de tu portafolio en tu cuenta de GitHub.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. Abre tu terminal o cliente Git en la raíz de tu proyecto e inicializa el repositorio (si aún no lo está):
          </p>
          <div className="relative p-3 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-[11px] text-purple-200">
            <button
              type="button"
              onClick={() => copyToClipboard('git init\ngit add .\ngit commit -m "feat: portfolio Yorleidys Ruiz"\ngit branch -M main\ngit remote add origin https://github.com/TU_USUARIO/mi-portafolio.git\ngit push -u origin main', 'git-cmd')}
              className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200"
            >
              {copiedSection === 'git-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'git-cmd' ? 'Copiado' : 'Copiar'}
            </button>
            <pre className="overflow-x-auto whitespace-pre">
{`git init
git add .
git commit -m "feat: portfolio Yorleidys Ruiz"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-portafolio.git
git push -u origin main`}
            </pre>
          </div>
          <p>
            2. Tu repositorio ya estará alojado en GitHub listo para conectarse con Netlify.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Paso 2: Conectar el Proyecto en Netlify',
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
      desc: 'Vincular Netlify con tu repositorio de GitHub para despliegue continuo.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. Inicia sesión en tu cuenta de{' '}
            <a
              href="https://app.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline font-semibold inline-flex items-center gap-1"
            >
              app.netlify.com <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p>
            2. Haz clic en el botón <strong>&quot;Add new site&quot;</strong> &gt; <strong>&quot;Import an existing project&quot;</strong>.
          </p>
          <p>
            3. Selecciona <strong>GitHub</strong> y autoriza el acceso a tu repositorio.
          </p>
          <p>
            4. Elige el repositorio de tu portafolio en la lista.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Paso 3: Parámetros de Compilación (Build Settings)',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      desc: 'Configurar los comandos de compilación de Vite y directorio de publicación.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Netlify detectará automáticamente el archivo <code>netlify.toml</code> que ya hemos configurado en este proyecto, pero asegúrate de verificar los siguientes valores:
          </p>
          <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="text-slate-400 font-semibold">Build command:</span>
              <code className="text-purple-300 bg-slate-900 px-2 py-0.5 rounded">npm run build</code>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="text-slate-400 font-semibold">Publish directory:</span>
              <code className="text-purple-300 bg-slate-900 px-2 py-0.5 rounded">dist</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Base directory:</span>
              <code className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">(dejar vacío / raíz)</code>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            * El archivo <code>_redirects</code> y <code>netlify.toml</code> incluidos garantizan que las rutas de React nunca arrojen error 404 al recargar.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Paso 4: Configurar Variables de Entorno en Netlify',
      icon: <Settings className="w-5 h-5 text-pink-400" />,
      desc: 'Inyectar las credenciales de Firebase en Netlify para que se sincronicen en vivo.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En Netlify, dentro de la pantalla de tu sitio, ve a <strong>Site configuration</strong> (o <em>Site settings</em>) &gt; <strong>Environment variables</strong>.
          </p>
          <p>
            2. Haz clic en <strong>&quot;Add a variable&quot;</strong> (puedes agregarlas una por una o usar <em>Import from .env</em>).
          </p>
          <p>
            3. Agrega las siguientes variables obtenidas de tu consola de Firebase:
          </p>
          <div className="relative p-3.5 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-[11px] text-purple-200">
            <button
              type="button"
              onClick={() => copyToClipboard('VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\nVITE_FIREBASE_APP_ID=', 'netlify-env')}
              className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-[10px] text-slate-200"
            >
              {copiedSection === 'netlify-env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'netlify-env' ? 'Copiado' : 'Copiar Nombres'}
            </button>
            <pre className="overflow-x-auto whitespace-pre">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto-id.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef`}
            </pre>
          </div>
          <p>
            4. Haz clic en <strong>&quot;Save&quot;</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Paso 5: Desplegar y Sincronizar Datos',
      icon: <Cloud className="w-5 h-5 text-emerald-400" />,
      desc: 'Publicar el sitio y sincronizar tus proyectos y artículos a Firestore.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En Netlify, haz clic en <strong>&quot;Deploy site&quot;</strong> (o ve a <em>Deploys</em> &gt; <em>Trigger deploy</em> &gt; <em>Clear cache and deploy site</em>).
          </p>
          <p>
            2. En menos de 1 minuto tu portafolio estará en línea con su URL propia (por ejemplo:{' '}
            <code className="text-purple-300">https://yordevctg17.netlify.app</code>).
          </p>
          <p>
            3. Entra a tu sitio publicado, inicia sesión en el panel con tus credenciales y ve a la pestaña <strong>&quot;Configuración Firebase&quot;</strong>.
          </p>
          <p>
            4. Haz clic en el botón <strong>&quot;Subir a Firestore&quot;</strong>: tus proyectos y artículos locales se cargarán automáticamente a la nube y quedarán sincronizados permanentemente para cualquier visitante.
          </p>
        </div>
      ),
    },
  ];

  const firebaseSteps = [
    {
      id: 1,
      title: 'Paso 1: Crear tu Proyecto en la Consola de Firebase',
      icon: <Globe className="w-5 h-5 text-purple-400" />,
      desc: 'Configuración inicial de la cuenta y creación de tu entorno en la nube de Google Firebase.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. Abre tu navegador e ingresa a la consola oficial de Google Firebase:{' '}
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline font-semibold inline-flex items-center gap-1"
            >
              console.firebase.google.com <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p>2. Inicia sesión con tu cuenta de Google.</p>
          <p>3. Haz clic en el botón <strong>&quot;Agregar proyecto&quot;</strong> (o &quot;Crear un proyecto&quot;).</p>
          <p>
            4. Asigna un nombre descriptivo a tu proyecto (por ejemplo:{' '}
            <code className="px-1.5 py-0.5 rounded bg-[#090d16] text-purple-300 border border-purple-900/40">
              yorleidys-portafolio
            </code>
            ).
          </p>
          <p>
            5. Haz clic en <strong>&quot;Continuar&quot;</strong> y luego en <strong>&quot;Crear proyecto&quot;</strong>. Espera unos segundos a que finalice la preparación.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Paso 2: Crear la Base de Datos Cloud Firestore',
      icon: <Database className="w-5 h-5 text-indigo-400" />,
      desc: 'Habilitar la base de datos NoSQL para almacenar tus proyectos y artículos de blog.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En el panel lateral izquierdo de tu proyecto en Firebase, ve a la sección <strong>Compilación (Build)</strong> y selecciona <strong>Firestore Database</strong>.
          </p>
          <p>2. Haz clic en el botón <strong>&quot;Crear base de datos&quot;</strong>.</p>
          <p>
            3. Elige la ubicación del servidor más cercana (por ejemplo, <code className="text-purple-300">us-central1</code> o la que prefieras).
          </p>
          <p>
            4. Selecciona <strong>Modo de prueba</strong> o <strong>Modo de producción</strong>.
          </p>
          <p>5. Haz clic en <strong>&quot;Habilitar&quot;</strong>. ¡Tu base de datos Firestore ya estará activa!</p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Paso 3: Obtener las Credenciales de tu Aplicación Web',
      icon: <Key className="w-5 h-5 text-pink-400" />,
      desc: 'Registrar tu app web en Firebase para generar el apiKey, projectId y demás claves.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En la página principal de tu proyecto en Firebase, haz clic en la rueda de engranaje ⚙️ &gt; <strong>Configuración del proyecto</strong>.
          </p>
          <p>
            2. En la sección <strong>&quot;Tus apps&quot;</strong>, haz clic en el ícono Web <code>&lt;/&gt;</code>.
          </p>
          <p>
            3. Escribe un apodo (ejemplo: <code>Portafolio Yorleidys Web</code>) y haz clic en <strong>&quot;Registrar app&quot;</strong>.
          </p>
          <p>
            4. Firebase te mostrará el objeto <code>firebaseConfig</code> con tu <code>apiKey</code>, <code>projectId</code>, <code>authDomain</code>, etc.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Paso 4: Configurar las Reglas de Seguridad en Firestore',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      desc: 'Garantizar que tu base de datos permita lectura pública a los visitantes de tu portafolio.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En la consola de Firebase, dentro de <strong>Firestore Database</strong>, haz clic en la pestaña <strong>Reglas (Rules)</strong>.
          </p>
          <p>2. Reemplaza las reglas existentes por estas:</p>
          <div className="relative p-3.5 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-[11px] text-emerald-300">
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /proyectos/{document=**} {\n      allow read, write: if true;\n    }\n    match /articulos_blog/{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`,
                  'rules'
                )
              }
              className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition-colors"
            >
              {copiedSection === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'rules' ? 'Copiado' : 'Copiar'}
            </button>
            <pre>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /proyectos/{document=**} {
      allow read, write: if true;
    }
    match /articulos_blog/{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>
          <p>3. Haz clic en <strong>&quot;Publicar&quot; (Publish)</strong>.</p>
        </div>
      ),
    },
  ];

  const currentSteps = guideType === 'netlify' ? netlifySteps : firebaseSteps;

  return (
    <div className="space-y-6">
      {/* Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0d18] border border-purple-900/30">
        <button
          type="button"
          onClick={() => {
            setGuideType('netlify');
            setOpenStep(1);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
            guideType === 'netlify'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>1. Despliegue en Netlify</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setGuideType('firebase');
            setOpenStep(1);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
            guideType === 'firebase'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>2. Configuración Firebase Firestore</span>
        </button>
      </div>

      {/* Introduction */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#11162b] to-[#0f1424] border border-purple-900/30">
        <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>{guideType === 'netlify' ? 'Guía Completa: Montar el Portafolio en Netlify' : 'Guía Completa: Conectar Google Firebase Firestore'}</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {guideType === 'netlify'
            ? 'Sigue estos 5 pasos para desplegar tu portafolio en Netlify con sincronización continua a tu base de datos en la nube.'
            : 'Configura tu base de datos gratuita en Google Cloud Firebase para almacenar tus proyectos y artículos de manera persistente.'}
        </p>
      </div>

      {/* Accordion Steps */}
      <div className="space-y-3">
        {currentSteps.map((step) => {
          const isOpen = openStep === step.id;
          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#0f1424] border-purple-800/50 shadow-lg shadow-purple-950/30'
                  : 'bg-[#0b0f19]/70 border-purple-900/20 hover:border-purple-900/40'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-900/30">
                    {step.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
                <div className="text-purple-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-purple-900/20 animate-in fade-in duration-150">
                  {step.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Architecture Box */}
      <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
        <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Compatibilidad y Seguridad Garantizada
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tu aplicación cuenta con archivos de enrutamiento <code>netlify.toml</code> y <code>_redirects</code> preconfigurados para evitar errores 404 al recargar páginas o secciones en Netlify, además de soporte para variables de entorno <code>VITE_FIREBASE_*</code>.
        </p>
      </div>
    </div>
  );
};
