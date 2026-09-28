import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Minus,
  Eye,
  Edit3,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { validateAndSanitizePlainText, validateAndSanitizeBlogContent, validateSafeUrl } from '../../utils/security';
import { BlogContentRenderer } from '../BlogContentRenderer';

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<BlogPost, 'id'> | BlogPost) => void;
  initialPost?: BlogPost | null;
}

const PRESET_IMAGES = [
  { label: 'Hotel / Velocidad Web', path: '/assets/img/proyectos/hotel_paraiso.jpg' },
  { label: 'Agroconecta / React & Arquitectura', path: '/assets/img/proyectos/agroconecta.jpg' },
  { label: 'Tienda Nativa / UX E-commerce', path: '/assets/img/proyectos/tienda_nativa.jpg' },
  { label: 'Envíos Globales / WordPress', path: '/assets/img/proyectos/envios_globales.jpg' },
  { label: 'Guayacanes / Inmobiliaria', path: '/assets/img/proyectos/guayacanes.webp' },
];

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPost,
}) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Desarrollo Web');
  const [tiempoLectura, setTiempoLectura] = useState('4 min lectura');
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  });
  const [extracto, setExtracto] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(PRESET_IMAGES[0].path);
  const [customImage, setCustomImage] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [enlace, setEnlace] = useState('#blog');

  // Modo de edición: 'editor' o 'preview'
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Submenús modales para insertar imagen o enlace entre el texto
  const [showImageModal, setShowImageModal] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [inlineImageAlt, setInlineImageAlt] = useState('');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [inlineLinkText, setInlineLinkText] = useState('');
  const [inlineLinkUrl, setInlineLinkUrl] = useState('https://');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPost) {
      setTitulo(initialPost.titulo || '');
      setCategoria(initialPost.categoria || 'Desarrollo Web');
      setTiempoLectura(initialPost.tiempoLectura || '4 min lectura');
      setFecha(initialPost.fecha || '');
      setExtracto(initialPost.extracto || '');
      setContenido(initialPost.contenido || initialPost.extracto || '');
      setEnlace(initialPost.enlace || '#blog');

      const isPreset = PRESET_IMAGES.some((p) => p.path === initialPost.imagen);
      if (isPreset) {
        setImagen(initialPost.imagen);
        setUseCustomImage(false);
        setCustomImage('');
      } else {
        setUseCustomImage(true);
        setCustomImage(initialPost.imagen || '');
      }
    } else {
      setTitulo('');
      setCategoria('Desarrollo Web');
      setTiempoLectura('4 min lectura');
      const today = new Date();
      setFecha(today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }));
      setExtracto('');
      setContenido('');
      setImagen(PRESET_IMAGES[0].path);
      setCustomImage('');
      setUseCustomImage(false);
      setEnlace('#blog');
    }
    setActiveTab('editor');
    setErrors({});
    setSecurityWarning(null);
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

  /**
   * Inserta formato en la posición actual del cursor o envuelve la selección
   */
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contenido.substring(start, end);
    const replacementText = selectedText || defaultPlaceholder;

    const newContent =
      contenido.substring(0, start) +
      prefix +
      replacementText +
      suffix +
      contenido.substring(end);

    setContenido(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + replacementText.length;
      textarea.setSelectionRange(
        start + prefix.length,
        selectedText ? newCursorPos : start + prefix.length + replacementText.length
      );
    }, 10);
  };

  /**
   * Inserta un bloque de encabezado o línea al inicio de una nueva línea
   */
  const insertBlockPrefix = (prefix: string, defaultText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = contenido.substring(0, start);
    const needsNewlineBefore = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
    const insertStr = (needsNewlineBefore ? '\n\n' : '') + prefix + defaultText + '\n\n';

    const newContent =
      contenido.substring(0, start) + insertStr + contenido.substring(start);
    setContenido(newContent);

    setTimeout(() => {
      textarea.focus();
      const pos = start + (needsNewlineBefore ? 2 : 0) + prefix.length + defaultText.length;
      textarea.setSelectionRange(pos, pos);
    }, 10);
  };

  /**
   * Confirma la inserción de una imagen entre el texto
   */
  const handleInsertInlineImage = () => {
    if (!inlineImageUrl.trim()) return;
    const alt = inlineImageAlt.trim() || 'Imagen del artículo';
    const imageMarkdown = `\n\n![${alt}](${inlineImageUrl.trim()})\n\n`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const newContent =
        contenido.substring(0, start) + imageMarkdown + contenido.substring(start);
      setContenido(newContent);
    } else {
      setContenido((prev) => prev + imageMarkdown);
    }

    setInlineImageUrl('');
    setInlineImageAlt('');
    setShowImageModal(false);
  };

  /**
   * Confirma la inserción de un enlace / redirección
   */
  const handleInsertInlineLink = () => {
    if (!inlineLinkUrl.trim()) return;
    const text = inlineLinkText.trim() || 'Visitar enlace';
    const linkMarkdown = `[${text}](${inlineLinkUrl.trim()})`;

    insertFormatting('', '', linkMarkdown);

    setInlineLinkText('');
    setInlineLinkUrl('https://');
    setShowLinkModal(false);
  };

  /**
   * Inserta una plantilla estructurada lista para rellenar
   */
  const handleInsertTemplate = () => {
    const template = `# Título Principal del Artículo

Escribe aquí una introducción cautivadora que contextualice el tema y explique qué aprenderá el lector.

## 1. Primer Concepto Clave

Explica en detalle los fundamentos técnicos o la estrategia. Puedes destacar palabras en **negrita**, términos en *cursiva* o código como \`npm install\`.

> "Una cita inspiradora o consejo profesional que resuma la idea principal de esta sección."

![Arquitectura y desarrollo web](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80)

## 2. Pasos y Recomendaciones

- **Paso 1:** Configurar el entorno de trabajo optimizado.
- **Paso 2:** Aplicar buenas prácticas de diseño responsivo.
- **Paso 3:** Medir el rendimiento y tiempos de carga.

### Enlaces de Referencia

Para conocer más detalles y recursos, [visita el repositorio oficial en GitHub](https://github.com/yovanessaruiz17) o revisa la documentación.`;

    if (contenido.trim().length > 0) {
      if (!confirm('¿Deseas reemplazar el contenido actual con la plantilla prediseñada?')) {
        return;
      }
    }
    setContenido(template);
    if (!titulo.trim()) {
      setTitulo('Guía Completa de Desarrollo y Buenas Prácticas');
    }
    if (!extracto.trim()) {
      setExtracto('Descubre las técnicas fundamentales para estructurar proyectos escalables, optimizar código y entregar experiencias de usuario de alto impacto.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityWarning(null);
    const newErrors: Record<string, string> = {};

    // 1. Título
    const valTitulo = validateAndSanitizePlainText(titulo, 'El título del artículo', {
      required: true,
      minLength: 5,
      maxLength: 150,
    });
    if (!valTitulo.isValid) newErrors.titulo = valTitulo.errorMessage!;

    // 2. Categoría
    const valCat = validateAndSanitizePlainText(categoria, 'La categoría', {
      required: true,
      minLength: 3,
      maxLength: 60,
    });
    if (!valCat.isValid) newErrors.categoria = valCat.errorMessage!;

    // 3. Tiempo de lectura
    const valTiempo = validateAndSanitizePlainText(tiempoLectura, 'El tiempo de lectura', {
      required: true,
      maxLength: 30,
    });
    if (!valTiempo.isValid) newErrors.tiempoLectura = valTiempo.errorMessage!;

    // 4. Fecha
    const valFecha = validateAndSanitizePlainText(fecha, 'La fecha', {
      required: true,
      maxLength: 40,
    });
    if (!valFecha.isValid) newErrors.fecha = valFecha.errorMessage!;

    // 5. Extracto
    const valExtracto = validateAndSanitizePlainText(extracto, 'El extracto del artículo', {
      required: true,
      minLength: 15,
      maxLength: 400,
    });
    if (!valExtracto.isValid) newErrors.extracto = valExtracto.errorMessage!;

    // 6. Contenido Enriquecido del Artículo
    const valContenido = validateAndSanitizeBlogContent(contenido, {
      required: true,
      minLength: 20,
      maxLength: 35000,
    });
    if (!valContenido.isValid) newErrors.contenido = valContenido.errorMessage!;

    // 7. Imagen de Portada
    let finalImagen = imagen;
    if (useCustomImage) {
      const valImg = validateSafeUrl(customImage, 'La URL de la imagen de portada');
      if (!valImg.isValid) {
        newErrors.imagen = valImg.errorMessage!;
      } else {
        finalImagen = valImg.sanitizedValue;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSecurityWarning('Por favor corrige los campos señalados antes de guardar.');
      return;
    }

    const blogPayload = {
      ...(initialPost ? { id: initialPost.id } : {}),
      titulo: valTitulo.sanitizedValue,
      categoria: valCat.sanitizedValue,
      fecha: valFecha.sanitizedValue,
      imagen: finalImagen,
      extracto: valExtracto.sanitizedValue,
      contenido: valContenido.sanitizedValue,
      enlace: enlace.trim() || '#blog',
      tiempoLectura: valTiempo.sanitizedValue,
    };

    onSave(blogPayload as BlogPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl my-6 bg-[#0e1322] border border-purple-900/50 rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
      >
        {/* Header con gradiente */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#12182b]/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="blog-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
                {initialPost ? 'Editar Artículo del Blog' : 'Publicar Nuevo Artículo en el Blog'}
              </h3>
              <p className="text-xs text-purple-300/70">
                Editor enriquecido con títulos, estilos, enlaces e imágenes intercaladas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {securityWarning && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{securityWarning}</span>
            </div>
          )}

          {/* Fila 1: Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Título del Artículo <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
              }}
              placeholder="Ej. Cómo optimizar la velocidad de tu sitio web para aumentar conversiones"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.titulo ? 'border-red-500 ring-red-500/20' : 'border-purple-900/40 focus:border-purple-500'
              }`}
              required
            />
            {errors.titulo && <p className="text-xs text-red-400 mt-1">{errors.titulo}</p>}
          </div>

          {/* Fila 2: Categoría, Tiempo de Lectura, Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Categoría <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej. Desarrollo Web, UX/UI, SEO"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
              {errors.categoria && <p className="text-xs text-red-400 mt-1">{errors.categoria}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tiempo de Lectura <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={tiempoLectura}
                onChange={(e) => setTiempoLectura(e.target.value)}
                placeholder="Ej. 4 min lectura"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Fecha de Publicación <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="Ej. 28 Sep 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Extracto Breve */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Extracto o Resumen Breve <span className="text-purple-400">*</span>
            </label>
            <textarea
              rows={2}
              value={extracto}
              onChange={(e) => {
                setExtracto(e.target.value);
                if (errors.extracto) setErrors((prev) => ({ ...prev, extracto: '' }));
              }}
              placeholder="Un resumen de 2 a 3 líneas que atrape el interés del lector..."
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 resize-none ${
                errors.extracto ? 'border-red-500' : 'border-purple-900/40 focus:border-purple-500'
              }`}
              required
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{errors.extracto ? <span className="text-red-400">{errors.extracto}</span> : 'Aparece en la tarjeta del blog'}</span>
              <span>{extracto.length}/400 caracteres</span>
            </div>
          </div>

          {/* SECCIÓN DEL CONTENIDO ENRIQUECIDO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span>Cuerpo del Artículo</span>
                <span className="text-purple-400">*</span>
              </label>

              {/* Selector de pestañas: Editor | Vista Previa | Plantilla */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInsertTemplate}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 flex items-center gap-1.5 transition-colors"
                  title="Cargar estructura prediseñada con títulos, listas e imagen"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Insertar Plantilla</span>
                </button>

                <div className="flex rounded-lg bg-[#080d1a] border border-purple-900/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'editor'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Vista Previa</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BARRA DE HERRAMIENTAS WYSIWYG */}
            {activeTab === 'editor' && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-t-2xl bg-[#12182b] border border-purple-900/50 border-b-0 text-slate-300">
                {/* Grupo Títulos */}
                <div className="flex items-center bg-[#080d1a] rounded-lg p-0.5 border border-purple-900/40">
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('# ', 'Título Principal')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Título H1 (# Título)"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('## ', 'Subtítulo Destacado')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Subtítulo H2 (## Subtítulo)"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('### ', 'Encabezado de Sección')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Encabezado H3 (### Encabezado)"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Separador vertical */}
                <span className="w-px h-5 bg-purple-900/40 mx-0.5" />

                {/* Grupo Estilos */}
                <div className="flex items-center bg-[#080d1a] rounded-lg p-0.5 border border-purple-900/40">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**', 'Texto en negrita')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Negrita (**texto**)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*', 'Texto en cursiva')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Cursiva (*texto*)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>', 'Texto subrayado')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Subrayado (<u>texto</u>)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('~~', '~~', 'Texto tachado')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Tachado (~~texto~~)"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>
                </div>

                {/* Separador vertical */}
                <span className="w-px h-5 bg-purple-900/40 mx-0.5" />

                {/* Inserción de Imagen entre texto */}
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/60 hover:to-indigo-800/60 text-purple-200 hover:text-white rounded-lg border border-purple-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Insertar imagen en cualquier parte del artículo"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Insertar Imagen</span>
                </button>

                {/* Inserción de Enlace / Redirección */}
                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-indigo-900/50 to-blue-900/50 hover:from-indigo-800/60 hover:to-blue-800/60 text-indigo-200 hover:text-white rounded-lg border border-indigo-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Insertar enlace o redirección web"
                >
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  <span>Insertar Enlace</span>
                </button>

                {/* Separador vertical */}
                <span className="w-px h-5 bg-purple-900/40 mx-0.5" />

                {/* Grupo Cita, Código, Listas */}
                <div className="flex items-center bg-[#080d1a] rounded-lg p-0.5 border border-purple-900/40">
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('> ', 'Frase o cita destacada')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Cita destacada (> Cita)"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('`', '`', 'código')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Código inline (`código`)"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('- ', 'Elemento de lista')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Lista con viñetas (- Item)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('1. ', 'Primer paso o elemento')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Lista numerada (1. Item)"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlockPrefix('---\n', '')}
                    className="p-1.5 hover:bg-purple-900/40 rounded text-slate-300 hover:text-white transition-colors"
                    title="Línea divisoria (---)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ÁREA DE TEXTO O VISTA PREVIA */}
            {activeTab === 'editor' ? (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={12}
                  value={contenido}
                  onChange={(e) => {
                    setContenido(e.target.value);
                    if (errors.contenido) setErrors((prev) => ({ ...prev, contenido: '' }));
                  }}
                  placeholder="Escribe el artículo utilizando la barra de herramientas superior para añadir títulos, negritas, imágenes entre párrafos y enlaces clickeables..."
                  className={`w-full px-4 py-3 rounded-b-2xl bg-[#080d1a] border font-mono text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                    errors.contenido ? 'border-red-500' : 'border-purple-900/50 focus:border-purple-500'
                  }`}
                  required
                />
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
                  <span className="flex items-center gap-1 text-purple-300/80">
                    <HelpCircle className="w-3 h-3" />
                    Usa los botones superiores para insertar imágenes entre texto o enlaces directos.
                  </span>
                  <span>{contenido.length}/35,000 caracteres</span>
                </div>
                {errors.contenido && <p className="text-xs text-red-400 mt-1">{errors.contenido}</p>}
              </div>
            ) : (
              /* PANEL DE VISTA PREVIA EN VIVO */
              <div className="p-6 rounded-2xl bg-[#080d1a] border border-purple-900/50 min-h-[300px] max-h-[480px] overflow-y-auto">
                <div className="mb-4 pb-3 border-b border-purple-900/30">
                  <span className="px-2.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-xs font-semibold border border-purple-700/40">
                    {categoria}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-1">
                    {titulo || 'Título del Artículo (Vista Previa)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {fecha} • {tiempoLectura}
                  </p>
                </div>

                <BlogContentRenderer content={contenido || 'Escribe contenido en la pestaña Editor para ver la previsualización en tiempo real aquí.'} />
              </div>
            )}
          </div>

          {/* Imagen de portada principal */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#080d1a] border border-purple-900/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Imagen de Portada Principal
              </label>
              <button
                type="button"
                onClick={() => setUseCustomImage(!useCustomImage)}
                className="text-xs text-purple-400 hover:text-purple-300 underline focus:outline-none"
              >
                {useCustomImage ? 'Elegir de galería predefinida' : 'Ingresar URL personalizada'}
              </button>
            </div>

            {!useCustomImage ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = imagen === preset.path;
                  return (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setImagen(preset.path)}
                      className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-950/30'
                          : 'border-slate-800 hover:border-purple-900/60 bg-slate-900/40'
                      }`}
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 mb-1">
                        <img
                          src={preset.path}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[10px] font-medium text-slate-300 truncate">
                        {preset.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={customImage}
                  onChange={(e) => {
                    setCustomImage(e.target.value);
                    if (errors.imagen) setErrors((prev) => ({ ...prev, imagen: '' }));
                  }}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12182b] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {errors.imagen && <p className="text-xs text-red-400 mt-1">{errors.imagen}</p>}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-purple-900/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/60 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>{initialPost ? 'Guardar Cambios' : 'Publicar Artículo en el Blog'}</span>
            </button>
          </div>
        </form>

        {/* MODAL / POPOVER: INSERTAR IMAGEN ENTRE TEXTO */}
        {showImageModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-[#0f1426] border border-purple-700/60 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Insertar Imagen en el Texto
                </h4>
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL de la Imagen <span className="text-purple-400">*</span>
                </label>
                <input
                  type="url"
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/grafico-o-foto.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080d1a] border border-purple-900/50 text-xs text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              {/* Sugerencias de imágenes predefinidas */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  O selecciona una imagen rápida:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES.slice(0, 3).map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => {
                        setInlineImageUrl(p.path);
                        setInlineImageAlt(p.label);
                      }}
                      className="text-left p-1 rounded-lg border border-purple-900/30 hover:border-purple-500 bg-[#080d1a] text-[10px] text-slate-300 truncate"
                    >
                      <div className="aspect-video w-full rounded overflow-hidden mb-1">
                        <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate block">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pie de foto o Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={inlineImageAlt}
                  onChange={(e) => setInlineImageAlt(e.target.value)}
                  placeholder="Ej. Diagrama de arquitectura de software"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080d1a] border border-purple-900/50 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInsertInlineImage}
                  disabled={!inlineImageUrl.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors"
                >
                  Insertar Imagen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL / POPOVER: INSERTAR ENLACE O REDIRECCIÓN */}
        {showLinkModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-[#0f1426] border border-indigo-700/60 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  Insertar Enlace o Redirección
                </h4>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Texto visible del enlace <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={inlineLinkText}
                  onChange={(e) => setInlineLinkText(e.target.value)}
                  placeholder="Ej. Ver repositorio en GitHub, Visitar sitio web"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080d1a] border border-purple-900/50 text-xs text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL de destino <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={inlineLinkUrl}
                  onChange={(e) => setInlineLinkUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080d1a] border border-purple-900/50 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Se abrirá automáticamente en una pestaña nueva al hacer clic.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInsertInlineLink}
                  disabled={!inlineLinkUrl.trim() || !inlineLinkText.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  Insertar Enlace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
