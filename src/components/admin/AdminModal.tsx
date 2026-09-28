import React, { useState } from 'react';
import {
  X,
  Layers,
  FileText,
  Database,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Lock,
  LogOut,
  UserCheck,
  Share2,
} from 'lucide-react';
import { Project, BlogPost } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectFormModal } from './ProjectFormModal';
import { BlogFormModal } from './BlogFormModal';
import { FirebaseConfigView } from './FirebaseConfigView';
import { FirebaseStepByStepGuide } from './FirebaseStepByStepGuide';
import { AdminLoginView } from './AdminLoginView';
import { SecuritySettingsView } from './SecuritySettingsView';
import { SocialSettingsView } from './SocialSettingsView';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'projects' | 'blog' | 'social' | 'firebase' | 'guide' | 'security';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'projects',
}) => {
  const {
    projects,
    blogPosts,
    addProject,
    updateProject,
    deleteProject,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    firebaseConfig,
    adminAuth,
    logoutAdmin,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'projects' | 'blog' | 'social' | 'firebase' | 'guide' | 'security'>(initialTab);

  // Estados de formularios emergentes
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Confirmación de borrado
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'project' | 'blog'; id: number; title: string } | null>(
    null
  );

  // Búsqueda y filtros
  const [searchProject, setSearchProject] = useState('');
  const [searchBlog, setSearchBlog] = useState('');

  if (!isOpen) return null;

  // Si no está autenticado, mostrar la pantalla de Login con candado y credenciales maestras
  if (!adminAuth.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
        <AdminLoginView
          onCancel={onClose}
          onSuccess={() => {
            // El inicio de sesión se actualiza automáticamente en el contexto
          }}
        />
      </div>
    );
  }

  const handleSaveProject = (projectData: Omit<Project, 'id'> | Project) => {
    if ('id' in projectData && projectData.id) {
      updateProject(projectData as Project);
    } else {
      addProject(projectData as Omit<Project, 'id'>);
    }
  };

  const handleSaveBlog = (blogData: Omit<BlogPost, 'id'> | BlogPost) => {
    if ('id' in blogData && blogData.id) {
      updateBlogPost(blogData as BlogPost);
    } else {
      addBlogPost(blogData as Omit<BlogPost, 'id'>);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setDeleteConfirm(null);
    if (type === 'project') {
      await deleteProject(id);
    } else {
      await deleteBlogPost(id);
    }
  };

  const hasDemoProjects = projects.some((p) => Number(p.id) >= 1 && Number(p.id) <= 6);

  const handleDeleteAllDemoProjects = async () => {
    if (!confirm('¿Deseas eliminar permanentemente los proyectos de prueba iniciales (Hotel Paraíso, Agroconecta, etc.) de Cloud Firestore?')) {
      return;
    }
    const demoIds = projects
      .filter((p) => Number(p.id) >= 1 && Number(p.id) <= 6)
      .map((p) => p.id);
    for (const id of demoIds) {
      await deleteProject(id);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const term = searchProject.toLowerCase();
    return (
      p.titulo.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term) ||
      p.tipo.toLowerCase().includes(term) ||
      p.tecnologias.some((t) => t.toLowerCase().includes(term))
    );
  });

  const filteredBlogPosts = blogPosts.filter((b) => {
    const term = searchBlog.toLowerCase();
    return (
      b.titulo.toLowerCase().includes(term) ||
      b.categoria.toLowerCase().includes(term) ||
      b.extracto.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-6xl my-4 sm:my-8 bg-[#0b0f19] border border-purple-900/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#11162b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="admin-title" className="text-base sm:text-lg font-bold text-white">
                  Panel de Gestión & Base de Datos
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/50">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  Modo Seguro Activo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Administra proyectos, artículos de blog y sincronización con Firebase Firestore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
            {/* Indicador de Administrador Conectado */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-purple-950/80 border border-purple-800/60 text-purple-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{adminAuth.user?.email || 'admin'}</span>
            </div>

            {firebaseConfig.status === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Firebase Conectado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                Almacenamiento Local Seguro
              </span>
            )}

            {/* Botón de Cerrar Sesión */}
            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/70 border border-rose-900/50 transition-colors"
              title="Cerrar sesión de administración"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-900/30 bg-[#0d1222] px-6 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Proyectos ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'blog'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog ({blogPosts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp & Redes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'firebase'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Configuración Firebase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guía Paso a Paso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Seguridad & Acceso</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* TAB 1: PROYECTOS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    placeholder="Buscar proyectos por título, tecnología o categoría..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f1424] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {hasDemoProjects && (
                    <button
                      type="button"
                      onClick={handleDeleteAllDemoProjects}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-all hover:scale-[1.02]"
                      title="Eliminar los proyectos de prueba iniciales de la base de datos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Borrar Proyectos de Prueba</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 hover:scale-[1.02] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid / List */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-[#0f1424]/60 border border-purple-900/20">
                  <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No se encontraron proyectos</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {searchProject ? 'Intenta con otro término de búsqueda.' : 'Crea tu primer proyecto con el botón superior.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group rounded-2xl bg-[#0f1424] border border-purple-900/30 overflow-hidden flex flex-col justify-between hover:border-purple-600/50 transition-all duration-200 shadow-lg shadow-black/30"
                    >
                      <div>
                        {/* Cover Image & Badges */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                          <img
                            src={project.imagen}
                            alt={project.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0b0f19]/80 text-purple-300 border border-purple-800/40 backdrop-blur-sm">
                              {project.categoria}
                            </span>
                            {project.destacado && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-2.5 h-2.5" /> Destacado
                              </span>
                            )}
                          </div>
                          {project.estado && (
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 backdrop-blur-sm">
                                {project.estado}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                                {project.titulo}
                              </h4>
                              <p className="text-[11px] text-purple-400/90">{project.tipo}</p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {project.descripcion}
                          </p>

                          {/* Tech pills */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.tecnologias.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-purple-900/20"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tecnologias.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400">
                                +{project.tecnologias.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="px-4 py-3 border-t border-purple-900/20 bg-[#12182b] flex items-center justify-between">
                        {project.url && project.url !== '#' ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                          >
                            <span>Ver Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500">Sin URL externa</span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
                            aria-label={`Editar proyecto ${project.titulo}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'project',
                                id: project.id,
                                title: project.titulo,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            aria-label={`Eliminar proyecto ${project.titulo}`}
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
          )}

          {/* TAB 2: BLOG */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchBlog}
                    onChange={(e) => setSearchBlog(e.target.value)}
                    placeholder="Buscar artículos por título o categoría..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f1424] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setBlogModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 hover:scale-[1.02] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Artículo</span>
                </button>
              </div>

              {/* Articles List */}
              {filteredBlogPosts.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-[#0f1424]/60 border border-purple-900/20">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No se encontraron artículos</p>
                  <p className="text-xs text-slate-500 mt-1">Escribe tu primera entrada con el botón superior.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBlogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-[#0f1424] border border-purple-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-purple-600/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-purple-900/30">
                          <img
                            src={post.imagen}
                            alt={post.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/40">
                              {post.categoria}
                            </span>
                            <span className="text-[11px] text-slate-400">{post.fecha}</span>
                            <span className="text-[11px] text-indigo-400">• {post.tiempoLectura}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{post.titulo}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{post.extracto}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPost(post);
                            setBlogModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-purple-900/30 hover:border-purple-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3 h-3 text-purple-400" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'blog',
                              id: post.id,
                              title: post.titulo,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 border border-rose-900/40 hover:bg-rose-900/60 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REDES SOCIALES & WHATSAPP */}
          {activeTab === 'social' && <SocialSettingsView />}

          {/* TAB 4: FIREBASE CONFIGURATION */}
          {activeTab === 'firebase' && <FirebaseConfigView />}

          {/* TAB 5: GUÍA PASO A PASO */}
          {activeTab === 'guide' && <FirebaseStepByStepGuide />}

          {/* TAB 6: SEGURIDAD & ACCESO */}
          {activeTab === 'security' && <SecuritySettingsView />}
        </div>

        {/* Modals para formularios */}
        <ProjectFormModal
          isOpen={projectModalOpen}
          onClose={() => {
            setProjectModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
          initialProject={editingProject}
        />

        <BlogFormModal
          isOpen={blogModalOpen}
          onClose={() => {
            setBlogModalOpen(false);
            setEditingPost(null);
          }}
          onSave={handleSaveBlog}
          initialPost={editingPost}
        />

        {/* Diálogo de Confirmación de Borrado */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1424] border border-red-900/50 shadow-2xl text-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="text-base font-bold text-white">Confirmar Eliminación</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ¿Estás segura de que deseas eliminar{' '}
                <strong className="text-white">&quot;{deleteConfirm.title}&quot;</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
