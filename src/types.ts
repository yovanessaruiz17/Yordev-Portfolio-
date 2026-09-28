export interface Project {
  id: number;
  titulo: string;
  tipo: string;
  categoria: 'Todos' | 'Desarrollo Web' | 'E-commerce' | 'WordPress' | 'Laravel' | 'SEO' | 'UI/UX' | 'Landing Page' | 'Aplicación Web';
  descripcion: string;
  imagen: string;
  tecnologias: string[];
  url: string;
  destacado: boolean;
  estado?: string;
  cliente?: string;
}

export interface Service {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  caracteristicas?: string[];
}

export interface Technology {
  id: string;
  nombre: string;
  categoria: 'frontend' | 'backend' | 'cms' | 'tools' | 'database';
  color: string;
  iconoSvg?: string;
}

export interface ValueProp {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface Testimonial {
  id: number;
  nombre: string;
  cargo: string;
  empresa?: string;
  comentario: string;
  imagen: string;
  estrellas: number;
}

export interface BlogPost {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  imagen: string;
  extracto: string;
  contenido?: string;
  enlace: string;
  tiempoLectura: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  projectsCollection: string;
  blogCollection: string;
  status: 'disconnected' | 'configured' | 'connected' | 'error';
  lastTested?: string;
}

export interface StatItem {
  id: string;
  valor: string;
  label: string;
  descripcion?: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  instagram: string;
  email: string;
  whatsapp: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export interface AdminUser {
  email: string;
  nombre: string;
  rol: 'superadmin' | 'editor';
  ultimoAcceso?: string;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
}
