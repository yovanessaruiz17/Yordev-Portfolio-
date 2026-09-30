import React, { useState } from 'react';
import {
  Star,
  Trash2,
  Edit2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Send,
  Info,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Testimonial } from '../../types';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const GoogleReviewsManager: React.FC = () => {
  const {
    testimonials,
    socialLinks,
    updateSocialLinks,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    deleteAllDemoTestimonials,
  } = usePortfolio();

  // Estados de configuración de URL de Google
  const [googleUrl, setGoogleUrl] = useState(socialLinks.googleReviewUrl || '');
  const [savingUrl, setSavingUrl] = useState(false);
  const [urlSavedSuccess, setUrlSavedSuccess] = useState(false);

  // Estados para generador de invitaciones
  const [clientName, setClientName] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Estados para modal de formulario de testimonio
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<{
    nombre: string;
    cargo: string;
    empresa: string;
    comentario: string;
    estrellas: number;
    fecha: string;
    imagen: string;
    googleReviewUrl: string;
    isDemo: boolean;
  }>({
    nombre: '',
    cargo: '',
    empresa: '',
    comentario: '',
    estrellas: 5,
    fecha: 'Reciente',
    imagen: '',
    googleReviewUrl: '',
    isDemo: false,
  });

  const [savingReview, setSavingReview] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);

  const demoCount = testimonials.filter((t) => t.isDemo).length;
  const activeGoogleUrl = socialLinks.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJyordev-cartagena';

  const defaultInviteMessage = `¡Hola${clientName ? ' ' + clientName.trim() : ''}! 👋 Espero que estés muy bien. Fue un placer trabajar en el desarrollo de tu proyecto web con YorDev.\n\n¿Podrías regalarme 1 minuto para calificar mi trabajo en mi perfil de Google? Me ayuda muchísimo a que más personas conozcan mi trabajo:\n👉 ${activeGoogleUrl}\n\n¡Mil gracias por tu apoyo! ✨`;

  const handleSaveGoogleUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUrl(true);
    await updateSocialLinks({ googleReviewUrl: googleUrl.trim() });
    setSavingUrl(false);
    setUrlSavedSuccess(true);
    setTimeout(() => setUrlSavedSuccess(false), 3000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(defaultInviteMessage);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      cargo: 'Cliente Verificado',
      empresa: '',
      comentario: '',
      estrellas: 5,
      fecha: 'Hace poco',
      imagen: '',
      googleReviewUrl: activeGoogleUrl,
      isDemo: false,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      cargo: item.cargo || '',
      empresa: item.empresa || '',
      comentario: item.comentario,
      estrellas: item.estrellas || 5,
      fecha: item.fecha || 'Reciente',
      imagen: item.imagen || '',
      googleReviewUrl: item.googleReviewUrl || '',
      isDemo: Boolean(item.isDemo),
    });
    setModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.comentario.trim()) return;

    setSavingReview(true);
    if (editingItem) {
      await updateTestimonial({
        ...editingItem,
        ...formData,
      });
    } else {
      await addTestimonial({
        ...formData,
        origen: 'google',
        verificado: true,
      });
    }
    setSavingReview(false);
    setModalOpen(false);
  };

  const handleDeleteReview = async (id: string | number) => {
    await deleteTestimonial(id);
    setDeleteConfirmId(null);
  };

  const handleDeleteAllDemos = async () => {
    if (
      confirm(
        `¿Confirmas eliminar todos los ${demoCount} comentarios de prueba de Google de la base de datos Firestore? Esta acción no se puede deshacer.`
      )
    ) {
      await deleteAllDemoTestimonials();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Overview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#121633] via-[#0f142a] to-[#141938] border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-2.5 shrink-0 shadow-lg">
            <GoogleIcon className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Reseñas de Clientes en Google
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                5.0 ⭐ Google Business
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Pide a tus clientes que te califiquen en Google y publica sus comentarios en tu sitio web para generar máxima confianza con futuros clientes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 hover:scale-[1.02] transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Reseña de Google</span>
        </button>
      </div>

      {/* Grid: 2 Columns (Google Link Setup & Invite Generator) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Configurar Link de Google */}
        <div className="p-5 rounded-2xl bg-[#0f1424] border border-purple-900/40 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GoogleIcon className="w-4 h-4" />
            <span>1. Tu Enlace Oficial de Reseñas en Google</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Ingresa el enlace directo donde tus clientes pueden hacer clic para dejar una calificación de 5 estrellas en tu perfil de Google Maps o Google Perfil de Negocio.
          </p>

          <form onSubmit={handleSaveGoogleUrl} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                URL para dejar reseñas en Google:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={googleUrl}
                  onChange={(e) => setGoogleUrl(e.target.value)}
                  placeholder="https://g.page/r/.../review o https://search.google.com/..."
                  required
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={savingUrl}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50 shrink-0"
                >
                  {savingUrl ? 'Guardando...' : urlSavedSuccess ? '¡Guardado!' : 'Guardar Link'}
                </button>
              </div>
            </div>

            {/* Test Link Button */}
            {googleUrl && (
              <div className="flex items-center justify-between pt-1">
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Probar enlace de Google en nueva pestaña</span>
                </a>
                <span className="text-[10px] text-slate-500">Sincronizado con Cloud Firestore</span>
              </div>
            )}
          </form>

          {/* Quick guide how to get the Google Review link */}
          <div className="p-3 rounded-xl bg-[#090d1a] border border-purple-900/30 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Cómo obtener este enlace en Google?</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-400">
              <li>Abre tu perfil de negocio en Google buscando el nombre de tu empresa en Google Search o Maps.</li>
              <li>Busca el botón azul <strong>&quot;Pedir opiniones&quot;</strong> o <strong>&quot;Solicitar reseñas&quot;</strong>.</li>
              <li>Copia el enlace corto generado (ej: <code className="text-purple-300">https://g.page/r/.../review</code>) y pégalo arriba.</li>
            </ol>
          </div>
        </div>

        {/* Panel 2: Generador de Invitación para Clientes */}
        <div className="p-5 rounded-2xl bg-[#0f1424] border border-purple-900/40 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>2. Pedir Reseña a un Cliente (Plantilla Directa)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                1 Clic para WhatsApp
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Personaliza el mensaje con el nombre de tu cliente y cópialo listo para enviar por WhatsApp o correo electrónico.
            </p>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Nombre del cliente (opcional):
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Carlos / Laura"
                className="w-full px-3.5 py-1.5 rounded-xl bg-[#080c1a] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#080c1a] border border-purple-900/30 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {defaultInviteMessage}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyInvite}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-colors"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>¡Mensaje Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Mensaje para Enviar</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(defaultInviteMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir en WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Demo Testimonials Notice & Quick Cleanup Action */}
      {demoCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-white">
                Tienes {demoCount} comentarios de prueba activos en la página
              </p>
              <p className="text-amber-200/90 mt-0.5">
                Estos testimonios de ejemplo te permiten mostrar cómo luce la sección antes de que tus clientes reales publiquen en tu perfil de Google. Puedes eliminarlos todos cuando quieras con un solo clic.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteAllDemos}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/50 transition-all shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Todos los Comentarios Demo ({demoCount})</span>
          </button>
        </div>
      )}

      {/* Reviews List Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">
              Comentarios Publicados en la Página ({testimonials.length})
            </h4>
            <span className="text-xs text-slate-400">• Sincronizados en Cloud Firestore</span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar otra reseña</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#0f1424]/60 border border-purple-900/30">
            <Star className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No hay comentarios publicados</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Utiliza el botón superior para agregar reseñas recibidas en Google o envía tu enlace de invitación a tus clientes.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
            >
              Publicar primera reseña
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-[#0f1424] border transition-all flex flex-col justify-between ${
                  item.isDemo
                    ? 'border-amber-900/40 hover:border-amber-500/50'
                    : 'border-purple-900/40 hover:border-purple-500/50'
                }`}
              >
                <div>
                  {/* Card Header: Google logo + Badge + Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center p-1">
                        <GoogleIcon className="w-full h-full" />
                      </div>
                      <span className="text-[11px] font-semibold text-white">Google Review</span>
                    </div>

                    {item.isDemo ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Comentario Demo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2.5">
                    {[...Array(item.estrellas || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">
                      {item.fecha || 'Reciente'}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-4 line-clamp-4">
                    &quot;{item.comentario}&quot;
                  </p>
                </div>

                {/* Footer: Author Info & Actions */}
                <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        {item.nombre.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-white leading-tight">{item.nombre}</h5>
                      <p className="text-[10px] text-purple-400/90">{item.cargo || item.empresa || 'Cliente'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Editar comentario"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Eliminar comentario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Crear o Editar Reseña */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e1326] border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  {editingItem ? 'Editar Reseña de Google' : 'Publicar Nueva Reseña de Google'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cargo o Rol</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ej. CEO / Fundador"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Empresa / Negocio</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Ej. Agroconecta S.A.S."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Calificación (Estrellas)</label>
                  <select
                    value={formData.estrellas}
                    onChange={(e) => setFormData({ ...formData, estrellas: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Estrellas - Excelente)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Estrellas - Muy Bueno)</option>
                    <option value={3}>⭐⭐⭐ (3 Estrellas - Bueno)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha de Publicación</label>
                  <input
                    type="text"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    placeholder="Ej. Hace 2 semanas / Sep 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Texto del Comentario / Opinión *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  placeholder="Copia el comentario exacto que tu cliente te dejó en Google Reviews..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL de Foto de Perfil o Avatar (opcional)</label>
                <input
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="https://... (si se deja vacío, se mostrarán las iniciales del cliente)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080c1a] border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDemoReview"
                  checked={formData.isDemo}
                  onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                  className="w-4 h-4 rounded border-purple-800 text-purple-600 bg-[#080c1a]"
                />
                <label htmlFor="isDemoReview" className="text-slate-300 cursor-pointer">
                  Marcar como comentario de prueba / demo (permite eliminarlo en lote más adelante)
                </label>
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
                >
                  {savingReview ? 'Guardando en Firestore...' : 'Guardar y Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar comentario individual */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#0e1326] border border-rose-500/40 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">¿Eliminar este comentario?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Esta reseña se eliminará permanentemente de tu página y de Cloud Firestore.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReview(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
