import React, { useState } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Database,
  Key,
  Globe,
  Lock,
} from 'lucide-react';

export const FirebaseStepByStepGuide: React.FC = () => {
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

  const steps = [
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
          <p>
            2. Inicia sesión con tu cuenta de Google.
          </p>
          <p>
            3. Haz clic en el botón <strong>&quot;Agregar proyecto&quot;</strong> (o &quot;Crear un proyecto&quot;).
          </p>
          <p>
            4. Asigna un nombre descriptivo a tu proyecto (por ejemplo:{' '}
            <code className="px-1.5 py-0.5 rounded bg-[#090d16] text-purple-300 border border-purple-900/40">
              yorleidys-portafolio
            </code>
            ).
          </p>
          <p>
            5. Firebase te preguntará si deseas habilitar Google Analytics. Puedes habilitarlo o deshabilitarlo según tu preferencia y luego hacer clic en <strong>&quot;Crear proyecto&quot;</strong>. Espera unos segundos a que finalice la preparación.
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
          <p>
            2. Haz clic en el botón <strong>&quot;Crear base de datos&quot;</strong>.
          </p>
          <p>
            3. Elige la ubicación del servidor más cercana (por ejemplo, <code className="text-purple-300">us-central1</code> o la región de tu preferencia).
          </p>
          <p>
            4. Cuando te pregunte por el modo de inicio, selecciona <strong>Modo de producción</strong> o <strong>Modo de prueba</strong>. En el siguiente paso configuraremos las reglas de seguridad personalizadas.
          </p>
          <p>
            5. Haz clic en <strong>&quot;Habilitar&quot;</strong>. ¡Tu base de datos Firestore ya estará activa!
          </p>
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
            1. En la página principal de tu proyecto en Firebase (haciendo clic en la rueda de engranaje ⚙️ junto a &quot;Descripción general del proyecto&quot; &gt; <strong>Configuración del proyecto</strong>).
          </p>
          <p>
            2. En la sección <strong>&quot;Tus apps&quot;</strong>, haz clic en el ícono de aplicación Web (el ícono que tiene el símbolo de código <code>&lt;/&gt;</code>).
          </p>
          <p>
            3. Escribe un apodo para tu aplicación (ejemplo: <code>Portafolio Yorleidys Web</code>) y haz clic en <strong>&quot;Registrar app&quot;</strong>.
          </p>
          <p>
            4. Firebase te mostrará un bloque de código con el objeto <code>firebaseConfig</code> similar a este:
          </p>
          <div className="relative p-3.5 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-[11px] text-purple-200">
            <pre>
{`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "yorleidys-portafolio.firebaseapp.com",
  projectId: "yorleidys-portafolio",
  storageBucket: "yorleidys-portafolio.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:...",
  measurementId: "G-..."
};`}
            </pre>
          </div>
          <p>
            5. Copia esos valores individuales en la pestaña <strong>&quot;Configuración Firebase&quot;</strong> de este mismo panel de administración.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Paso 4: Configurar las Reglas de Seguridad en Firestore',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      desc: 'Garantizar que tu base de datos sea segura, con lectura pública y protección contra modificaciones no autorizadas.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. En la consola de Firebase, dentro de <strong>Firestore Database</strong>, haz clic en la pestaña <strong>Reglas (Rules)</strong>.
          </p>
          <p>
            2. Reemplaza las reglas existentes por estas reglas seguras optimizadas para tu portafolio:
          </p>
          <div className="relative p-3.5 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-[11px] text-emerald-300">
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /proyectos/{document=**} {\n      allow read: if true;\n      allow write: if request.auth != null;\n    }\n    match /articulos_blog/{document=**} {\n      allow read: if true;\n      allow write: if request.auth != null;\n    }\n  }\n}`,
                  'rules'
                )
              }
              className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition-colors"
            >
              {copiedSection === 'rules' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copiar
                </>
              )}
            </button>
            <pre>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /proyectos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /articulos_blog/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
            </pre>
          </div>
          <p>
            3. Haz clic en el botón <strong>&quot;Publicar&quot; (Publish)</strong> para activar las reglas.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Paso 5: Guardar y Probar la Conexión en este Panel',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      desc: 'Validar la conexión desde tu panel de gestión sin exponer claves privadas.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. Regresa a la pestaña <strong>&quot;Configuración Firebase&quot;</strong> de este panel.
          </p>
          <p>
            2. Pega tu <code>Project ID</code> y tu <code>API Key</code>.
          </p>
          <p>
            3. Haz clic en <strong>&quot;Guardar Configuración&quot;</strong>.
          </p>
          <p>
            4. Haz clic en el botón <strong>&quot;Probar Conexión con Firestore&quot;</strong>. El sistema realizará una verificación segura sin bloquear ni recargar la página.
          </p>
          <p>
            5. Si todo está correcto, el indicador pasará a color verde con la etiqueta <strong>&quot;Conectado a Firestore&quot;</strong> o <strong>&quot;Configuración Guardada&quot;</strong>.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#11162b] to-[#0f1424] border border-purple-900/30">
        <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>Manual Paso a Paso para Conectar Firebase Firestore</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sigue estas instrucciones detalladas para aprovisionar tu propia base de datos gratuita en Google Firebase y conectarla a tu panel. Ningún servicio externo tiene acceso a tus credenciales; todo se almacena de forma segura y privada en tu propio navegador.
        </p>
      </div>

      {/* Accordion Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
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
          Protección de Formularios y Sanitización Activa
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tanto el formulario de <strong>Proyectos</strong> como el de <strong>Artículos del Blog</strong> cuentan con un filtro estricto de seguridad que:
        </p>
        <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
          <li>Rechaza de forma inmediata cualquier intento de inyección de objetos o arrays en formato <code>JSON</code>.</li>
          <li>Bloquea etiquetas HTML/XML como <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code> o atributos peligrosos como <code>onerror</code> u <code>onload</code>.</li>
          <li>Impide la inyección de fragmentos de código JavaScript o sentencias SQL.</li>
          <li>Valida que los enlaces utilicen exclusivamente protocolos seguros (<code className="text-emerald-400">https://</code> o anclas relativas).</li>
        </ul>
      </div>
    </div>
  );
};
