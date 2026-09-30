import {
  Project,
  Service,
  Technology,
  ValueProp,
  Testimonial,
  BlogPost,
  StatItem,
  SocialLinks,
} from '../types';

export const personalInfo = {
  nombre: 'Yorleidys Ruiz',
  marca: 'YorDev',
  titulo: 'Desarrolladora Web & Diseñadora Digital',
  profesion: 'Desarrolladora Web y de Software',
  ubicacion: 'Cartagena, Colombia',
  disponibilidad: 'Disponible para proyectos freelance y colaboraciones',
  heroEyebrow: 'DESARROLLADORA WEB & DISEÑADORA DIGITAL',
  heroTituloPrincipal: 'Transformo ideas en',
  heroTituloDestacado: 'experiencias digitales que conectan y convierten.',
  heroDescripcion:
    'Desarrollo sitios y aplicaciones web modernas, funcionales y optimizadas para brindar valor real a tu negocio.',
  ctaPrincipal: 'Ver proyectos',
  ctaSecundario: 'Hablemos de tu proyecto',
  aboutTexto:
    'Soy Yorleidys Ruiz, desarrolladora web y de software apasionada por transformar ideas en productos digitales funcionales, modernos y fáciles de usar. Mi experiencia combina desarrollo web, ecommerce, herramientas digitales y diseño de interfaces para crear soluciones adaptadas a las necesidades reales de cada proyecto.',
};

export const statsData: StatItem[] = [
  {
    id: 'proyectos',
    valor: '+10',
    label: 'Proyectos completados',
    descripcion: 'Sitios web y aplicaciones entregadas con éxito',
  },
  {
    id: 'clientes',
    valor: '100%',
    label: 'Clientes satisfechos',
    descripcion: 'Garantía de calidad y soporte cercano',
  },
  {
    id: 'experiencia',
    valor: '+2',
    label: 'Años de experiencia',
    descripcion: 'En desarrollo full-stack y diseño web',
  },
  {
    id: 'soporte',
    valor: '24/7',
    label: 'Comprometida con tus objetivos',
    descripcion: 'Atención y comunicación continua',
  },
];

export const servicesData: Service[] = [
  {
    id: 1,
    titulo: 'Desarrollo Web',
    descripcion:
      'Sitios y aplicaciones web a medida, rápidos, seguros y escalables.',
    icono: 'monitor',
    caracteristicas: [
      'Single Page Apps (SPA) y portales',
      'Arquitectura moderna y optimizada',
      'Código limpio y escalable',
      'Totalmente responsive',
    ],
  },
  {
    id: 2,
    titulo: 'Diseño UI/UX',
    descripcion:
      'Diseños modernos, intuitivos y enfocados en la mejor experiencia de usuario.',
    icono: 'layout',
    caracteristicas: [
      'Prototipado en Figma',
      'Sistemas de diseño consistentes',
      'Wireframing y flujos de usuario',
      'Enfoque en accesibilidad (WCAG)',
    ],
  },
  {
    id: 3,
    titulo: 'Tiendas Online',
    descripcion:
      'E-commerce funcionales con pasarelas de pago y gestión de productos.',
    icono: 'shopping-bag',
    caracteristicas: [
      'WooCommerce y Shopify',
      'Integración de pagos (Wompi, MercadoPago, Stripe)',
      'Optimización del embudo de compra',
      'Gestión de inventario y pedidos',
    ],
  },
  {
    id: 4,
    titulo: 'Mantenimiento Web',
    descripcion:
      'Actualizaciones, mejoras de rendimiento y soporte continuo para tu web.',
    icono: 'settings',
    caracteristicas: [
      'Copias de seguridad y seguridad activa',
      'Actualización de plugins y dependencias',
      'Monitoreo de disponibilidad 99.9%',
      'Soporte técnico preferente',
    ],
  },
  {
    id: 5,
    titulo: 'Optimización Web',
    descripcion:
      'Mejoras de rendimiento, estructura, SEO técnico y experiencia.',
    icono: 'zap',
    caracteristicas: [
      'Optimización Core Web Vitals',
      'Reducción drástica del tiempo de carga',
      'SEO on-page y datos estructurados',
      'Compresión y lazy loading de recursos',
    ],
  },
  {
    id: 6,
    titulo: 'Soluciones Digitales',
    descripcion:
      'Aplicaciones y herramientas adaptadas a procesos específicos.',
    icono: 'layers',
    caracteristicas: [
      'Sistemas de gestión interna',
      'Automatización de procesos',
      'Conexión e integración con APIs REST',
      'Desarrollo a la medida de tu flujo de trabajo',
    ],
  },
];

export const projectsData: Project[] = [];

export const technologiesData: Technology[] = [
  {
    id: 'html5',
    nombre: 'HTML5',
    categoria: 'frontend',
    color: '#E34F26',
  },
  {
    id: 'css3',
    nombre: 'CSS3',
    categoria: 'frontend',
    color: '#1572B6',
  },
  {
    id: 'javascript',
    nombre: 'JavaScript',
    categoria: 'frontend',
    color: '#F7DF1E',
  },
  {
    id: 'react',
    nombre: 'React',
    categoria: 'frontend',
    color: '#61DAFB',
  },
  {
    id: 'nodejs',
    nombre: 'Node.js',
    categoria: 'backend',
    color: '#339933',
  },
  {
    id: 'php',
    nombre: 'PHP',
    categoria: 'backend',
    color: '#777BB4',
  },
  {
    id: 'mysql',
    nombre: 'MySQL',
    categoria: 'database',
    color: '#4479A1',
  },
  {
    id: 'wordpress',
    nombre: 'WordPress',
    categoria: 'cms',
    color: '#21759B',
  },
  {
    id: 'git',
    nombre: 'Git',
    categoria: 'tools',
    color: '#F05032',
  },
  {
    id: 'figma',
    nombre: 'Figma',
    categoria: 'tools',
    color: '#F24E1E',
  },
  {
    id: 'laravel',
    nombre: 'Laravel',
    categoria: 'backend',
    color: '#FF2D20',
  },
  {
    id: 'woocommerce',
    nombre: 'WooCommerce',
    categoria: 'cms',
    color: '#96588A',
  },
  {
    id: 'vue',
    nombre: 'Vue.js',
    categoria: 'frontend',
    color: '#4FC08D',
  },
  {
    id: 'bootstrap',
    nombre: 'Bootstrap',
    categoria: 'frontend',
    color: '#7952B3',
  },
  {
    id: 'github',
    nombre: 'GitHub',
    categoria: 'tools',
    color: '#FFFFFF',
  },
];

export const valuePropsData: ValueProp[] = [
  {
    id: 1,
    titulo: 'Enfoque en resultados',
    descripcion: 'Diseño y desarrollo pensando en los objetivos de tu negocio.',
    icono: 'target',
  },
  {
    id: 2,
    titulo: 'Comunicación clara',
    descripcion: 'Te acompaño en todo el proceso con transparencia y cercanía.',
    icono: 'message-square',
  },
  {
    id: 3,
    titulo: 'Diseño + Funcionalidad',
    descripcion: 'Creo experiencias atractivas, útiles y que convierten.',
    icono: 'check-circle-2',
  },
  {
    id: 4,
    titulo: 'Entrega a tiempo',
    descripcion: 'Cumplo plazos y me adapto a tus necesidades.',
    icono: 'clock',
  },
  {
    id: 5,
    titulo: 'Código limpio',
    descripcion: 'Desarrollo escalable, ordenado y fácil de mantener.',
    icono: 'code-2',
  },
  {
    id: 6,
    titulo: 'Compromiso total',
    descripcion: 'Tu proyecto es mi prioridad, me involucro al 100%.',
    icono: 'heart-handshake',
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    nombre: 'Carlos Ramírez',
    cargo: 'CEO & Fundador',
    empresa: 'Agroconecta S.A.S.',
    comentario:
      'Excelente trabajo y compromiso profesional. Desarrolló la plataforma web integral conectando a productores agrícolas con distribuidores en tiempo real. La velocidad y la experiencia de usuario superaron todas las expectativas. 100% recomendada.',
    imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    estrellas: 5,
    fecha: 'Hace 2 semanas',
    origen: 'google',
    isDemo: true,
    verificado: true,
  },
  {
    id: 2,
    nombre: 'Laura Camila C.',
    cargo: 'Fundadora & Directora Creativa',
    empresa: 'Tienda Nativa Botánica',
    comentario:
      'Nuestra tienda virtual boutique quedó hermosa, moderna y ultra rápida en smartphones. Las ventas aumentaron notablemente desde el primer mes de lanzamiento. Comunicación impecable y entrega exacta en la fecha pactada.',
    imagen: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    estrellas: 5,
    fecha: 'Hace 1 mes',
    origen: 'google',
    isDemo: true,
    verificado: true,
  },
  {
    id: 3,
    nombre: 'Ing. David Martínez',
    cargo: 'Director de Operaciones',
    empresa: 'Envíos Globales Express',
    comentario:
      'Puntualidad, código limpio y asesoría técnica de primer nivel. El sistema de cotización y rastreo que implementó resolvió por completo la gestión logística internacional de nuestra compañía.',
    imagen: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    estrellas: 5,
    fecha: 'Hace 2 meses',
    origen: 'google',
    isDemo: true,
    verificado: true,
  },
  {
    id: 4,
    nombre: 'Valentina Restrepo',
    cargo: 'Gerente General',
    empresa: 'Grupo Hotelero Paraíso',
    comentario:
      'Rediseñó el sitio web corporativo de lujo con motor de reservas y optimización para turismo internacional. Recibimos constantes felicitaciones de huéspedes extranjeros por lo fácil e intuitivo que es reservar.',
    imagen: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    estrellas: 5,
    fecha: 'Hace 3 meses',
    origen: 'google',
    isDemo: true,
    verificado: true,
  },
];

export const blogPostsData: BlogPost[] = [
  {
    id: 1,
    titulo: 'Cómo optimizar la velocidad de tu sitio web para aumentar conversiones',
    categoria: 'Optimización Web',
    fecha: '12 Sep 2026',
    imagen: '/assets/img/proyectos/hotel_paraiso.jpg',
    extracto:
      'Descubre las técnicas fundamentales para reducir los tiempos de carga y mejorar los Core Web Vitals en tu tienda o sitio corporativo.',
    enlace: '#blog-1',
    tiempoLectura: '4 min lectura',
  },
  {
    id: 2,
    titulo: 'De la idea al código: Buenas prácticas en desarrollo con React y Laravel',
    categoria: 'Desarrollo de Software',
    fecha: '28 Ago 2026',
    imagen: '/assets/img/proyectos/agroconecta.jpg',
    extracto:
      'Arquitectura desacoplada, seguridad en APIs REST y estrategias para mantener tu código ordenado y escalable a largo plazo.',
    enlace: '#blog-2',
    tiempoLectura: '6 min lectura',
  },
  {
    id: 3,
    titulo: 'Diseño UX enfocado en ecommerce: Errores comunes que ahuyentan clientes',
    categoria: 'Diseño UI/UX',
    fecha: '15 Ago 2026',
    imagen: '/assets/img/proyectos/tienda_nativa.jpg',
    extracto:
      'Puntos clave en el checkout, claridad en el catálogo móvil y elementos de confianza indispensables para vender en internet.',
    enlace: '#blog-3',
    tiempoLectura: '5 min lectura',
  },
];

export const defaultSocialLinks: SocialLinks = {
  linkedin: 'https://www.linkedin.com/in/ing-yorleidys-ruiz/',
  github: 'https://github.com/yovanessaruiz17',
  instagram: 'https://www.instagram.com/yor.dev_ctg17/',
  email: 'hola@yorleidysruiz.com',
  whatsapp: 'https://wa.me/573000000000?text=Hola%20Yorleidys,%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto%20web.',
  whatsappNumber: '+57 300 000 0000',
  whatsappMessage: 'Hola Yorleidys, me gustaría conversar sobre un proyecto web.',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJyordev-cartagena',
};

export const socialLinks: SocialLinks = defaultSocialLinks;
