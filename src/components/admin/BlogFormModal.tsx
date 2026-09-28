import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { BlogPost } from '../../types';
import { validateAndSanitizePlainText, validateSafeUrl } from '../../utils/security';

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
];

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPost,
}) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Optimización Web');
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  useEffect(() => {
    if (initialPost) {
      setTitulo(initialPost.titulo || '');
      setCategoria(initialPost.categoria || 'Optimización Web');
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
      setCategoria('Optimización Web');
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
    setErrors({});
    setSecurityWarning(null);
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

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
      minLength: 20,
      maxLength: 400,
    });
    if (!valExtracto.isValid) newErrors.extracto = valExtracto.errorMessage!;

    // 6. Contenido Completo (párrafos de texto plano, sin código ni HTML ni JSON)
    const valContenido = validateAndSanitizePlainText(contenido, 'El contenido del artículo', {
      required: true,
      minLength: 30,
      maxLength: 5000,
      allowMultiline: true,
    });
    if (!valContenido.isValid) newErrors.contenido = valContenido.errorMessage!;

    // 7. Imagen
    let finalImagen = imagen;
    if (useCustomImage) {
      const valImg = validateSafeUrl(customImage, 'La URL de imagen');
      if (!valImg.isValid) {
        newErrors.imagen = valImg.errorMessage!;
      } else {
        finalImagen = valImg.sanitizedValue;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSecurityWarning('Se detectaron datos no válidos. Asegúrate de ingresar texto plano sin código HTML, JavaScript o estructuras JSON.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl my-8 bg-[#0f1424] border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#12182b]">
          <div>
            <h3 id="blog-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              {initialPost ? 'Editar Artículo del Blog' : 'Escribir Nuevo Artículo'}
            </h3>
            <p className="text-xs text-slate-400">
              Formularios con validación estricta de texto plano para protección contra inyección de código.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning */}
        {securityWarning && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 flex items-start gap-3 text-xs text-red-200">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Validación de Seguridad Estricta</p>
              <p>{securityWarning}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
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
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.titulo
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              required
            />
            {errors.titulo && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.titulo}
              </p>
            )}
          </div>

          {/* Fila 2: Categoría, Tiempo de Lectura, Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Categoría <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: '' }));
                }}
                placeholder="Ej. Optimización Web"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
              {errors.categoria && <p className="text-xs text-red-400 mt-1">{errors.categoria}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tiempo de Lectura <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={tiempoLectura}
                onChange={(e) => setTiempoLectura(e.target.value)}
                placeholder="Ej. 4 min lectura"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Fecha de Publicación <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="Ej. 17 Sep 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Extracto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
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
              className={`w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 resize-none ${
                errors.extracto
                  ? 'border-red-500'
                  : 'border-purple-900/40 focus:border-purple-500'
              }`}
              required
            />
            {errors.extracto ? (
              <p className="text-xs text-red-400 mt-1">{errors.extracto}</p>
            ) : (
              <span className="text-[11px] text-slate-500">{extracto.length}/400 caracteres</span>
            )}
          </div>

          {/* Contenido Completo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Contenido Completo del Artículo <span className="text-purple-400">*</span>
            </label>
            <textarea
              rows={5}
              value={contenido}
              onChange={(e) => {
                setContenido(e.target.value);
                if (errors.contenido) setErrors((prev) => ({ ...prev, contenido: '' }));
              }}
              placeholder="Escribe aquí los párrafos explicativos de tu artículo. Puedes separar ideas con saltos de línea..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.contenido
                  ? 'border-red-500'
                  : 'border-purple-900/40 focus:border-purple-500'
              }`}
              required
            />
            {errors.contenido ? (
              <p className="text-xs text-red-400 mt-1">{errors.contenido}</p>
            ) : (
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Solo texto plano por párrafos. No se admiten scripts ni HTML.</span>
                <span>{contenido.length}/5000 caracteres</span>
              </div>
            )}
          </div>

          {/* Imagen de portada */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[#0b0f19] border border-purple-900/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Imagen de Portada
              </label>
              <button
                type="button"
                onClick={() => setUseCustomImage(!useCustomImage)}
                className="text-xs text-purple-400 hover:text-purple-300 underline focus:outline-none"
              >
                {useCustomImage ? 'Elegir de galería' : 'Ingresar URL personalizada'}
              </button>
            </div>

            {!useCustomImage ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = imagen === preset.path;
                  return (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setImagen(preset.path)}
                      className={`group relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-950/20'
                          : 'border-slate-800 hover:border-purple-900/60 bg-slate-900/60'
                      }`}
                    >
                      <div className="aspect-video w-full rounded overflow-hidden bg-slate-950 mb-1">
                        <img
                          src={preset.path}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-slate-300 truncate">
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
                  placeholder="https://ejemplo.com/articulo.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-[#12182b] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {errors.imagen && (
                  <p className="text-xs text-red-400 mt-1">{errors.imagen}</p>
                )}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-purple-900/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialPost ? 'Guardar Artículo' : 'Publicar Artículo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
