import React, { useState } from 'react';
import { ExternalLink, ArrowRight, X, Layers, Globe, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

export const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    'Todos',
    'Desarrollo Web',
    'E-commerce',
    'WordPress',
    'Laravel',
    'SEO',
    'UI/UX',
    'Landing Page',
    'Aplicación Web',
  ];

  const filteredProjects =
    selectedCategory === 'Todos'
      ? projects
      : projects.filter((p) => {
          if (p.categoria === selectedCategory) return true;
          if (p.tecnologias.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))) return true;
          return false;
        });

  return (
    <section id="proyectos" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row: Title on Left, Link on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 block">
              PROYECTOS DESTACADOS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Algunos proyectos{' '}
              <br className="hidden sm:inline" />
              que{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                cuentan historias
              </span>
            </h2>
          </div>

          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors shrink-0"
          >
            <span>Ver todos los proyectos</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-[#11162b] text-slate-300 hover:text-white border border-purple-900/30 hover:border-purple-600/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Projects Container */}
        <div
          id="projects-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group rounded-2xl bg-[#11162b] border border-purple-900/30 hover:border-purple-500/60 overflow-hidden shadow-lg hover:shadow-purple-950/40 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Project Image Mockup Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={project.imagen}
                  alt={`Mockup del proyecto ${project.titulo}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
                
                {/* Badge if featured */}
                {project.destacado && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-[11px] font-semibold text-purple-300 backdrop-blur-sm">
                    Destacado
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {project.titulo}
                    </h3>
                    <div className="p-1.5 rounded-lg bg-slate-900/60 text-slate-400 group-hover:text-purple-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium mb-3">
                    {project.tipo}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-900/20">
                  <p className="text-xs text-purple-300/80 font-mono tracking-tight line-clamp-1">
                    {project.tecnologias.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-[#11162b]/50 rounded-2xl border border-purple-900/30">
            <Layers className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No se encontraron proyectos en esta categoría.</p>
            <button
              onClick={() => setSelectedCategory('Todos')}
              className="mt-3 text-sm text-purple-400 hover:underline"
            >
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0e1428] border border-purple-500/40 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={selectedProject.imagen}
                alt={selectedProject.titulo}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-white bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm"
                aria-label="Cerrar modal de proyecto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  {selectedProject.tipo}
                </span>
                {selectedProject.estado && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-600/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {selectedProject.estado}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {selectedProject.titulo}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {selectedProject.descripcion}
              </p>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Tecnologías utilizadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tecnologias.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#11162b] border border-purple-800/40 text-purple-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-900/30">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60"
                >
                  Cerrar
                </button>
                <a
                  href="#contacto"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/40"
                >
                  <span>Solicitar un proyecto similar</span>
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
