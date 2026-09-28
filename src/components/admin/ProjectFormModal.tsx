import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Project } from '../../types';
import { validateAndSanitizePlainText, validateSafeUrl } from '../../utils/security';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'> | Project) => void;
  initialProject?: Project | null;
}

const PRESET_IMAGES = [
  { label: 'Hotel Paraíso (Caribe)', path: '/assets/img/proyectos/hotel_paraiso.jpg' },
  { label: 'Agroconecta (Agro/Tech)', path: '/assets/img/proyectos/agroconecta.jpg' },
  { label: 'Envíos Globales (Logística)', path: '/assets/img/proyectos/envios_globales.jpg' },
  { label: 'Tienda Nativa (E-commerce)', path: '/assets/img/proyectos/tienda_nativa.jpg' },
  { label: 'Guayacanes (Inmobiliaria)', path: '/assets/img/proyectos/guayacanes.webp' },
];

const CATEGORIES: Project['categoria'][] = [
  'Desarrollo Web',
  'E-commerce',
  'WordPress',
  'Laravel',
  'SEO',
  'UI/UX',
  'Landing Page',
  'Aplicación Web',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
}) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState<Project['categoria']>('Desarrollo Web');
  const [descripcion, setDescripcion] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [url, setUrl] = useState('');
  const [imagen, setImagen] = useState(PRESET_IMAGES[0].path);
  const [customImage, setCustomImage] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [destacado, setDestacado] = useState(false);
  const [estado, setEstado] = useState('En línea');
  const [cliente, setCliente] = useState('');

  // Estados de errores de validación de seguridad
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  useEffect(() => {
    if (initialProject) {
      setTitulo(initialProject.titulo || '');
      setTipo(initialProject.tipo || '');
      setCategoria(initialProject.categoria || 'Desarrollo Web');
      setDescripcion(initialProject.descripcion || '');
      setTecnologias(initialProject.tecnologias ? initialProject.tecnologias.join(', ') : '');
      setUrl(initialProject.url || '');
      
      const isPreset = PRESET_IMAGES.some((p) => p.path === initialProject.imagen);
      if (isPreset) {
        setImagen(initialProject.imagen);
        setUseCustomImage(false);
        setCustomImage('');
      } else {
        setUseCustomImage(true);
        setCustomImage(initialProject.imagen || '');
      }

      setDestacado(!!initialProject.destacado);
      setEstado(initialProject.estado || 'En línea');
      setCliente(initialProject.cliente || '');
    } else {
      setTitulo('');
      setTipo('');
      setCategoria('Desarrollo Web');
      setDescripcion('');
      setTecnologias('');
      setUrl('https://');
      setImagen(PRESET_IMAGES[0].path);
      setCustomImage('');
      setUseCustomImage(false);
      setDestacado(false);
      setEstado('En línea');
      setCliente('');
    }
    setErrors({});
    setSecurityWarning(null);
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityWarning(null);
    const newErrors: Record<string, string> = {};

    // 1. Validar Título (solo texto plano)
    const valTitulo = validateAndSanitizePlainText(titulo, 'El título del proyecto', {
      required: true,
      minLength: 3,
      maxLength: 120,
    });
    if (!valTitulo.isValid) newErrors.titulo = valTitulo.errorMessage!;

    // 2. Validar Tipo (solo texto plano)
    const valTipo = validateAndSanitizePlainText(tipo, 'El tipo de proyecto', {
      required: true,
      minLength: 3,
      maxLength: 100,
    });
    if (!valTipo.isValid) newErrors.tipo = valTipo.errorMessage!;

    // 3. Validar Descripción (solo texto plano, multilínea permitido)
    const valDesc = validateAndSanitizePlainText(descripcion, 'La descripción', {
      required: true,
      minLength: 15,
      maxLength: 1000,
      allowMultiline: true,
    });
    if (!valDesc.isValid) newErrors.descripcion = valDesc.errorMessage!;

    // 4. Validar Tecnologías (lista de texto)
    const valTecs = validateAndSanitizePlainText(tecnologias, 'Las tecnologías', {
      required: true,
      maxLength: 300,
    });
    if (!valTecs.isValid) newErrors.tecnologias = valTecs.errorMessage!;

    // 5. Validar Cliente (opcional, solo texto)
    if (cliente.trim()) {
      const valCliente = validateAndSanitizePlainText(cliente, 'El cliente', {
        maxLength: 100,
      });
      if (!valCliente.isValid) newErrors.cliente = valCliente.errorMessage!;
    }

    // 6. Validar Estado (solo texto)
    if (estado.trim()) {
      const valEstado = validateAndSanitizePlainText(estado, 'El estado', {
        maxLength: 50,
      });
      if (!valEstado.isValid) newErrors.estado = valEstado.errorMessage!;
    }

    // 7. Validar URL del proyecto
    if (url.trim()) {
      const valUrl = validateSafeUrl(url, 'La URL del proyecto');
      if (!valUrl.isValid) newErrors.url = valUrl.errorMessage!;
    }

    // 8. Validar imagen
    let finalImagen = imagen;
    if (useCustomImage) {
      const valImg = validateSafeUrl(customImage, 'La URL de la imagen');
      if (!valImg.isValid) {
        newErrors.imagen = valImg.errorMessage!;
      } else {
        finalImagen = valImg.sanitizedValue;
      }
    }

    // Si hay errores de seguridad o formato
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSecurityWarning('Por favor corrige los campos señalados. Recuerda que no se admite código, scripts ni JSON.');
      return;
    }

    // Procesar lista de tecnologías
    const parsedTecs = valTecs.sanitizedValue
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectPayload = {
      ...(initialProject ? { id: initialProject.id } : {}),
      titulo: valTitulo.sanitizedValue,
      tipo: valTipo.sanitizedValue,
      categoria,
      descripcion: valDesc.sanitizedValue,
      tecnologias: parsedTecs.length > 0 ? parsedTecs : ['Web'],
      url: url.trim() ? url.trim() : '#',
      imagen: finalImagen,
      destacado,
      estado: estado.trim() || 'En línea',
      cliente: cliente.trim() || '',
    };

    onSave(projectPayload as Project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl my-8 bg-[#0f1424] border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#12182b]">
          <div>
            <h3 id="project-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              {initialProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h3>
            <p className="text-xs text-slate-400">
              Todos los campos admiten únicamente texto plano y seguro.
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

        {/* Security Alert Banner if any violation */}
        {securityWarning && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 flex items-start gap-3 text-xs text-red-200">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Validación de Seguridad Estricta</p>
              <p>{securityWarning}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Título & Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Título del Proyecto <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
                }}
                placeholder="Ej. Hotel Paraíso Escondido"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.titulo
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
                required
              />
              {errors.titulo ? (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.titulo}
                </p>
              ) : (
                <span className="text-[11px] text-slate-500">Solo texto plano descriptivo</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Categoría <span className="text-purple-400">*</span>
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as Project['categoria'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0f1424] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Tipo & Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tipo de Trabajo <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  if (errors.tipo) setErrors((prev) => ({ ...prev, tipo: '' }));
                }}
                placeholder="Ej. Sitio Web Corporativo, E-commerce, App Web"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.tipo
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
                required
              />
              {errors.tipo && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.tipo}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Cliente o Empresa (Opcional)
              </label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => {
                  setCliente(e.target.value);
                  if (errors.cliente) setErrors((prev) => ({ ...prev, cliente: '' }));
                }}
                placeholder="Ej. Grupo Hotelero Paraíso"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.cliente
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
              />
              {errors.cliente && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.cliente}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Descripción */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Descripción del Proyecto <span className="text-purple-400">*</span>
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: '' }));
              }}
              placeholder="Describe los objetivos, desafíos y resultados alcanzados con este proyecto..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.descripcion
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              required
            />
            {errors.descripcion ? (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.descripcion}
              </p>
            ) : (
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-0.5">
                <span>Solo texto plano. Etiquetas HTML y scripts serán bloqueados.</span>
                <span>{descripcion.length}/1000 caracteres</span>
              </div>
            )}
          </div>

          {/* Row 4: Tecnologías & Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tecnologías Usadas (separadas por comas) <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={tecnologias}
                onChange={(e) => {
                  setTecnologias(e.target.value);
                  if (errors.tecnologias) setErrors((prev) => ({ ...prev, tecnologias: '' }));
                }}
                placeholder="Ej. React, Tailwind CSS, Node.js, PostgreSQL"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.tecnologias
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
                required
              />
              {errors.tecnologias && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.tecnologias}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Estado del Proyecto
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="En línea">En línea</option>
                <option value="En producción">En producción</option>
                <option value="En desarrollo">En desarrollo</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          {/* Row 5: URL del Proyecto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Enlace / URL del Proyecto
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: '' }));
              }}
              placeholder="https://tudominio.com"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.url
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
            {errors.url && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.url}
              </p>
            )}
          </div>

          {/* Row 6: Imagen de portada */}
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
                {useCustomImage ? 'Elegir de galería predeterminada' : 'Usar URL personalizada'}
              </button>
            </div>

            {!useCustomImage ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
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
                  placeholder="https://ejemplo.com/mi-imagen.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-[#12182b] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {errors.imagen && (
                  <p className="text-xs text-red-400 mt-1">{errors.imagen}</p>
                )}
              </div>
            )}
          </div>

          {/* Row 7: Destacado switch */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-900/30">
            <input
              type="checkbox"
              id="destacado-checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 bg-slate-900 border-purple-900/60"
            />
            <label htmlFor="destacado-checkbox" className="text-xs text-slate-200 cursor-pointer">
              <span className="font-semibold text-white">Destacar en portada:</span> Mostrar este proyecto con insignia de destacado en la sección principal.
            </label>
          </div>

          {/* Actions */}
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
              <span>{initialProject ? 'Guardar Cambios' : 'Crear Proyecto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
