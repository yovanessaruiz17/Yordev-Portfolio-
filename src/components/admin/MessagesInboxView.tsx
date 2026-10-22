import React, { useState } from 'react';
import {
  Inbox,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessage } from '../../types';

export const MessagesInboxView: React.FC = () => {
  const { messages, markMessageAsRead, deleteContactMessage, socialLinks } = usePortfolio();
  const [filter, setFilter] = useState<'todos' | 'nuevos' | 'leidos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'nuevos' && msg.leido) return false;
    if (filter === 'leidos' && !msg.leido) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = msg.nombre.toLowerCase().includes(term);
      const matchEmail = msg.email.toLowerCase().includes(term);
      const matchContent = msg.mensaje.toLowerCase().includes(term);
      return matchName || matchEmail || matchContent;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.leido).length;

  const handleCopyMessage = (msg: ContactMessage) => {
    const text = `De: ${msg.nombre} (${msg.email})\nFecha: ${msg.fecha}\n\nMensaje:\n${msg.mensaje}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este mensaje de tu base de datos?')) {
      setDeletingId(id);
      await deleteContactMessage(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header explicativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1424] border border-purple-900/40">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50 shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Bandeja de Mensajes de Contacto</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Al día
                </span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Todos los mensajes enviados a través del formulario web se almacenan en tiempo real en tu base de datos Cloud Firestore.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-purple-900/30">
          <button
            type="button"
            onClick={() => setFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'todos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('nuevos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filter === 'nuevos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>No leídos</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            )}
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
              {unreadCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('leidos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'leidos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Leídos ({messages.length - unreadCount})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o texto..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-purple-900/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Mensajes */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0c1020] border border-purple-900/30 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 mx-auto">
            <Inbox className="w-7 h-7 opacity-80" />
          </div>
          <h4 className="text-base font-bold text-white">No hay mensajes para mostrar</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No se encontraron mensajes que coincidan con tu búsqueda.'
              : filter === 'nuevos'
              ? '¡Excelente! No tienes mensajes pendientes de leer.'
              : 'Cuando un cliente o empresa te envíe un mensaje desde el formulario web, aparecerá aquí en tiempo real.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                !msg.leido
                  ? 'bg-gradient-to-br from-[#121735] to-[#0d1228] border-purple-500/50 shadow-lg shadow-purple-950/30'
                  : 'bg-[#0c1020]/90 border-purple-900/20 hover:border-purple-800/40 opacity-90'
              }`}
            >
              {/* Encabezado del Mensaje */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
                    {msg.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {msg.nombre}
                      </h4>
                      {!msg.leido ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Nuevo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-400">
                          Leído
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-0.5 underline-offset-2 hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{msg.email}</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{msg.fecha}</span>
                </div>
              </div>

              {/* Contenido del Mensaje */}
              <div className="py-4">
                <div className="p-4 rounded-xl bg-[#080c18] border border-purple-950/80 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-normal">
                  {msg.mensaje}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Responder por correo */}
                  <a
                    href={`mailto:${msg.email}?subject=Respuesta%20a%20tu%20mensaje%20en%20YorDev&body=Hola%20${encodeURIComponent(
                      msg.nombre
                    )},%0A%0AGracias%20por%20contactarme%20a%20trav%C3%A9s%20de%20mi%20portafolio%20web%20YorDev.%0A%0ACon%20gusto%20te%20escribo%20respecto%20a%20tu%20consulta:%0A%0ASaludos%20cordiales,%0AYorleidys%20Ruiz%0ADesarrolladora%20Web%20y%20de%20Software`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Responder por Correo</span>
                  </a>

                  {/* Responder por WhatsApp */}
                  {socialLinks.whatsapp && (
                    <a
                      href={`${socialLinks.whatsapp}&text=${encodeURIComponent(
                        `Hola ${msg.nombre}, te escribe Yorleidys Ruiz de YorDev respecto al mensaje que me enviaste a través de mi portafolio web.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/50 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Abrir en WhatsApp</span>
                    </a>
                  )}

                  {/* Copiar texto */}
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(msg)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 flex items-center gap-1 transition-colors"
                    title="Copiar contenido del mensaje al portapapeles"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Marcar como leído / no leído */}
                  <button
                    type="button"
                    onClick={() => markMessageAsRead(msg.id, !msg.leido)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                  >
                    {msg.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                  </button>

                  {/* Eliminar mensaje */}
                  <button
                    type="button"
                    disabled={deletingId === msg.id}
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    title="Eliminar mensaje"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
