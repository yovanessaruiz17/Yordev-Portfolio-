/**
 * Portafolio Profesional - Yorleidys Ruiz
 * Arquitectura modular guiada por datos (Data-driven JavaScript)
 */

// ==========================================
// 1. DATA SOURCES
// ==========================================
const proyectos = [
  {
    id: 1,
    titulo: 'Hotel Paraíso Escondido',
    tipo: 'Sitio Web Corporativo',
    categoria: 'Desarrollo Web',
    descripcion: 'Sitio web corporativo de lujo con motor de reservas y experiencia interactiva.',
    imagen: 'assets/img/proyectos/hotel_paraiso.jpg',
    tecnologias: ['HTML', 'CSS', 'JS', 'PHP'],
    url: '#',
    destacado: true
  },
  {
    id: 2,
    titulo: 'Agroconecta',
    tipo: 'Plataforma Agrícola',
    categoria: 'Aplicación Web',
    descripcion: 'Plataforma digital para productores agropecuarios con monitoreo en tiempo real.',
    imagen: 'assets/img/proyectos/agroconecta.jpg',
    tecnologias: ['React', 'Node.js', 'MongoDB'],
    url: '#',
    destacado: true
  },
  {
    id: 3,
    titulo: 'Envíos Globales',
    tipo: 'Web Corporativa',
    categoria: 'WordPress',
    descripcion: 'Portal logístico de transporte internacional con cotizador dinámico de carga.',
    imagen: 'assets/img/proyectos/envios_globales.jpg',
    tecnologias: ['WordPress', 'PHP', 'MySQL'],
    url: '#',
    destacado: true
  },
  {
    id: 4,
    titulo: 'Tienda Nativa',
    tipo: 'E-commerce',
    categoria: 'E-commerce',
    descripcion: 'Tienda virtual boutique de botánica y productos orgánicos con pasarela de pagos.',
    imagen: 'assets/img/proyectos/tienda_nativa.jpg',
    tecnologias: ['WooCommerce', 'WordPress'],
    url: '#',
    destacado: true
  },
  {
    id: 5,
    titulo: 'Guayacanes Lakes',
    tipo: 'Landing Inmobiliaria',
    categoria: 'Laravel',
    descripcion: 'Landing inmobiliaria desarrollada con Laravel para proyecto campestre exclusivo.',
    imagen: 'assets/img/proyectos/guayacanes.webp',
    tecnologias: ['Laravel', 'PHP', 'MySQL'],
    url: '#',
    destacado: false
  }
];

const servicios = [
  {
    id: 1,
    titulo: 'Desarrollo Web',
    descripcion: 'Sitios y aplicaciones web a medida, rápidos, seguros y escalables.',
    icono: 'monitor'
  },
  {
    id: 2,
    titulo: 'Diseño UI/UX',
    descripcion: 'Diseños modernos, intuitivos y enfocados en la mejor experiencia de usuario.',
    icono: 'layout'
  },
  {
    id: 3,
    titulo: 'Tiendas Online',
    descripcion: 'E-commerce funcionales con pasarelas de pago y gestión de productos.',
    icono: 'shopping'
  },
  {
    id: 4,
    titulo: 'Mantenimiento Web',
    descripcion: 'Actualizaciones, mejoras de rendimiento y soporte continuo para tu web.',
    icono: 'settings'
  }
];

const tecnologias = [
  { nombre: 'HTML5', icono: 'html5' },
  { nombre: 'CSS3', icono: 'css3' },
  { nombre: 'JavaScript', icono: 'javascript' },
  { nombre: 'React', icono: 'react' },
  { nombre: 'Node.js', icono: 'nodejs' },
  { nombre: 'PHP', icono: 'php' },
  { nombre: 'MySQL', icono: 'mysql' },
  { nombre: 'WordPress', icono: 'wordpress' },
  { nombre: 'Git', icono: 'git' },
  { nombre: 'Figma', icono: 'figma' }
];

const testimonios = [
  {
    id: 1,
    nombre: 'María Gómez',
    cargo: 'Emprendedora',
    comentario: 'Yorleidys entendió perfecto lo que necesitaba y llevó mi idea a otro nivel. Profesional, creativa y muy comprometida.',
    imagen: 'assets/img/testimonios/maria_gomez.jpg',
    estrellas: 5
  },
  {
    id: 2,
    nombre: 'Carlos Ramírez',
    cargo: 'CEO, Agroconecta',
    comentario: 'Excelente trabajo, comunicación constante y entregas siempre a tiempo. 100% recomendada.',
    imagen: 'assets/img/testimonios/carlos_ramirez.jpg',
    estrellas: 5
  },
  {
    id: 3,
    nombre: 'Laura C.',
    cargo: 'Dueña, Tienda Nativa',
    comentario: 'Mi tienda online quedó hermosa y funciona perfecto. Desde que la lanzamos, las ventas han aumentado.',
    imagen: 'assets/img/testimonios/laura_c.jpg',
    estrellas: 5
  }
];

const articulos = [
  {
    id: 1,
    titulo: 'Cómo optimizar la velocidad de tu sitio web para aumentar conversiones',
    categoria: 'Optimización Web',
    fecha: '12 Sep 2026',
    extracto: 'Estrategias técnicas para reducir tiempos de carga y mejorar Core Web Vitals.'
  }
];

// ==========================================
// 2. RENDER FUNCTIONS
// ==========================================
function renderProjects(categoriaFiltro = 'Todos') {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const filtrados = categoriaFiltro === 'Todos'
    ? proyectos
    : proyectos.filter(p => p.categoria === categoriaFiltro || p.tecnologias.includes(categoriaFiltro));

  container.innerHTML = filtrados.map(p => `
    <article class="project-card">
      <div class="project-image-box">
        <img src="${p.imagen}" alt="${p.titulo}" loading="lazy" />
      </div>
      <div class="project-info">
        <div>
          <h3>${p.titulo}</h3>
          <p class="project-type">${p.tipo}</p>
        </div>
        <div class="project-techs">
          <small>${p.tecnologias.join(', ')}</small>
        </div>
      </div>
    </article>
  `).join('');
}

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.innerHTML = servicios.map(s => `
    <div class="service-card">
      <div>
        <div class="service-icon-box"></div>
        <h3>${s.titulo}</h3>
        <p>${s.descripcion}</p>
      </div>
    </div>
  `).join('');
}

function renderTechnologies() {
  const container = document.getElementById('tech-container');
  if (!container) return;

  container.innerHTML = tecnologias.map(t => `
    <div class="tech-card">
      <span class="tech-name">${t.nombre}</span>
    </div>
  `).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = testimonios.map(t => `
    <div class="testimonial-card">
      <div class="rating-stars">${'★'.repeat(t.estrellas)}</div>
      <p class="testimonial-quote">"${t.comentario}"</p>
      <div class="testimonial-author">
        <img src="${t.imagen}" alt="${t.nombre}" />
        <div>
          <h4>${t.nombre}</h4>
          <small>${t.cargo}</small>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBlog() {
  const container = document.getElementById('blog-container');
  if (!container) return;

  container.innerHTML = articulos.map(a => `
    <article class="blog-card">
      <span class="blog-cat">${a.categoria}</span>
      <h3>${a.titulo}</h3>
      <p>${a.extracto}</p>
    </article>
  `).join('');
}

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderServices();
  renderTechnologies();
  renderTestimonials();
  renderBlog();
});
