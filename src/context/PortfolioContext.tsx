import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, BlogPost, FirebaseConfig, AdminAuthState, AdminUser, SocialLinks } from '../types';
import { projectsData, blogPostsData, defaultSocialLinks } from '../data/portfolioData';
import {
  checkActiveSession,
  verifyAdminCredentials,
  clearSession,
  changeAdminPassword,
  ensureAdminInitialized,
  getTwoFactorConfig,
  saveTwoFactorConfig,
  verify2FACode,
  TwoFactorConfig,
} from '../utils/auth';

const LOCAL_STORAGE_PROJECTS_KEY = 'yordev_portfolio_projects';
const LOCAL_STORAGE_BLOG_KEY = 'yordev_portfolio_blog';
const LOCAL_STORAGE_FIREBASE_KEY = 'yordev_portfolio_firebase';
const LOCAL_STORAGE_SOCIAL_KEY = 'yordev_portfolio_social_links';

const defaultFirebaseConfig: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
  projectsCollection: 'proyectos',
  blogCollection: 'articulos_blog',
  status: 'disconnected',
};

interface PortfolioContextType {
  projects: Project[];
  blogPosts: BlogPost[];
  firebaseConfig: FirebaseConfig;
  adminAuth: AdminAuthState;
  twoFactorConfig: TwoFactorConfig;
  socialLinks: SocialLinks;
  updateSocialLinks: (links: Partial<SocialLinks>) => void;
  loginAdmin: (identifier: string, passwordAttempt: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; remainingAttempts?: number; lockedUntilSeconds?: number; user?: AdminUser }>;
  completeTwoFactorLogin: (user: AdminUser) => void;
  updateTwoFactorConfig: (cfg: TwoFactorConfig) => void;
  logoutAdmin: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  addProject: (project: Omit<Project, 'id'>) => { success: boolean; error?: string };
  updateProject: (project: Project) => { success: boolean; error?: string };
  deleteProject: (id: number) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => { success: boolean; error?: string };
  updateBlogPost: (post: BlogPost) => { success: boolean; error?: string };
  deleteBlogPost: (id: number) => void;
  saveFirebaseConfig: (config: FirebaseConfig) => void;
  testFirebaseConnection: () => Promise<{ success: boolean; message: string }>;
  resetToDefaults: () => void;
  isSyncing: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Si falla, usar datos base
    }
    return projectsData;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_BLOG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Si falla, usar datos base
    }
    return blogPostsData;
  });

  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FIREBASE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultFirebaseConfig, ...parsed };
      }
    } catch {
      // Usar por defecto
    }
    return defaultFirebaseConfig;
  });

  // Estado de autenticación del administrador
  const [adminAuth, setAdminAuth] = useState<AdminAuthState>(() => {
    return checkActiveSession();
  });

  // Configuración de Autenticación de Dos Factores (2FA)
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>(() => {
    return getTwoFactorConfig();
  });

  // Configuración de Enlaces de Contacto y Redes (WhatsApp, GitHub, LinkedIn, Instagram, Email)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SOCIAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSocialLinks, ...parsed };
      }
    } catch {
      // Usar por defecto
    }
    return defaultSocialLinks;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Inicializar credenciales maestras si aún no existen
  useEffect(() => {
    ensureAdminInitialized();
    const session = checkActiveSession();
    if (session.isAuthenticated !== adminAuth.isAuthenticated) {
      setAdminAuth(session);
    }
  }, []);

  const loginAdmin = async (
    identifier: string,
    passwordAttempt: string,
    rememberMe: boolean = true
  ) => {
    const result = await verifyAdminCredentials(identifier, passwordAttempt, rememberMe);
    if (result.success && result.user) {
      // Si el 2FA está activo, el LoginView solicitará el paso 2 de verificación antes de finalizar la sesión
      if (!twoFactorConfig.enabled) {
        setAdminAuth({
          isAuthenticated: true,
          user: result.user,
        });
      }
      return { success: true, user: result.user };
    }
    return {
      success: false,
      error: result.error || 'Credenciales inválidas',
      remainingAttempts: result.remainingAttempts,
      lockedUntilSeconds: result.lockedUntilSeconds,
    };
  };

  const completeTwoFactorLogin = (user: AdminUser) => {
    setAdminAuth({
      isAuthenticated: true,
      user,
    });
  };

  const updateTwoFactorConfig = (cfg: TwoFactorConfig) => {
    saveTwoFactorConfig(cfg);
    setTwoFactorConfig(cfg);
  };

  const updateSocialLinks = (newLinks: Partial<SocialLinks>) => {
    setSocialLinks((prev) => {
      const updated = { ...prev, ...newLinks };
      // Si se actualizó el número o el mensaje, recalcula la URL completa de WhatsApp
      if (newLinks.whatsappNumber !== undefined || newLinks.whatsappMessage !== undefined) {
        const rawNum = (newLinks.whatsappNumber !== undefined ? newLinks.whatsappNumber : prev.whatsappNumber) || '';
        const msg = (newLinks.whatsappMessage !== undefined ? newLinks.whatsappMessage : prev.whatsappMessage) || '';
        const cleanDigits = rawNum.replace(/\D/g, '');
        if (cleanDigits) {
          updated.whatsapp = `https://wa.me/${cleanDigits}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
        }
      }
      return updated;
    });
  };

  const logoutAdmin = () => {
    clearSession();
    setAdminAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    const res = await changeAdminPassword(currentPass, newPass);
    return res;
  };

  // Guardar en localStorage cuando cambian los proyectos
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('No se pudo guardar proyectos en localStorage:', e);
    }
  }, [projects]);

  // Guardar en localStorage cuando cambian los posts
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(blogPosts));
    } catch (e) {
      console.warn('No se pudo guardar blog en localStorage:', e);
    }
  }, [blogPosts]);

  // Guardar en localStorage cuando cambia la configuración de Firebase
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FIREBASE_KEY, JSON.stringify(firebaseConfig));
    } catch (e) {
      console.warn('No se pudo guardar Firebase config:', e);
    }
  }, [firebaseConfig]);

  // Guardar en localStorage cuando cambian las redes y contacto
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SOCIAL_KEY, JSON.stringify(socialLinks));
    } catch (e) {
      console.warn('No se pudo guardar redes y contacto en localStorage:', e);
    }
  }, [socialLinks]);

  const addProject = (newProjectData: Omit<Project, 'id'>) => {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const projectWithId: Project = {
      ...newProjectData,
      id: nextId,
    };

    setProjects((prev) => [projectWithId, ...prev]);
    return { success: true };
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    return { success: true };
  };

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addBlogPost = (newPostData: Omit<BlogPost, 'id'>) => {
    const nextId = blogPosts.length > 0 ? Math.max(...blogPosts.map((b) => b.id)) + 1 : 1;
    const postWithId: BlogPost = {
      ...newPostData,
      id: nextId,
    };

    setBlogPosts((prev) => [postWithId, ...prev]);
    return { success: true };
  };

  const updateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === updatedPost.id ? updatedPost : b))
    );
    return { success: true };
  };

  const deleteBlogPost = (id: number) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
  };

  const saveFirebaseConfig = (config: FirebaseConfig) => {
    setFirebaseConfig(config);
  };

  const testFirebaseConnection = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    if (!firebaseConfig.projectId.trim()) {
      setIsSyncing(false);
      const updated = { ...firebaseConfig, status: 'error' as const, lastTested: new Date().toLocaleTimeString() };
      setFirebaseConfig(updated);
      return {
        success: false,
        message: 'Por favor ingresa al menos el Project ID de Firebase.',
      };
    }

    try {
      // Verificación contra la API REST de Firestore de Google Cloud
      const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
        firebaseConfig.projectId.trim()
      )}/databases/(default)/documents?pageSize=1${
        firebaseConfig.apiKey.trim() ? `&key=${encodeURIComponent(firebaseConfig.apiKey.trim())}` : ''
      }`;

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const now = new Date().toLocaleTimeString();

      if (res.status === 200) {
        const updated = { ...firebaseConfig, status: 'connected' as const, lastTested: now };
        setFirebaseConfig(updated);
        setIsSyncing(false);
        return {
          success: true,
          message: `¡Conexión exitosa con Firestore! Proyecto '${firebaseConfig.projectId}' verificado y respondiendo correctamente.`,
        };
      } else if (res.status === 403 || res.status === 401) {
        // En Firestore, 403 a menudo indica que las reglas de seguridad restringen lectura pública sin token de usuario,
        // pero confirma que el proyecto existe y la API de Firestore está activa.
        const updated = { ...firebaseConfig, status: 'configured' as const, lastTested: now };
        setFirebaseConfig(updated);
        setIsSyncing(false);
        return {
          success: true,
          message: `Proyecto '${firebaseConfig.projectId}' detectado en Firebase. Nota: Las reglas de seguridad de Firestore requieren configuración de lectura/escritura en la consola.`,
        };
      } else if (res.status === 404) {
        const updated = { ...firebaseConfig, status: 'error' as const, lastTested: now };
        setFirebaseConfig(updated);
        setIsSyncing(false);
        return {
          success: false,
          message: `El proyecto '${firebaseConfig.projectId}' no se encontró en Firebase o la base de datos Firestore (default) aún no ha sido creada.`,
        };
      } else {
        const updated = { ...firebaseConfig, status: 'configured' as const, lastTested: now };
        setFirebaseConfig(updated);
        setIsSyncing(false);
        return {
          success: true,
          message: `Configuración registrada. Estado de respuesta de Firestore: ${res.status}.`,
        };
      }
    } catch (error) {
      setIsSyncing(false);
      const updated = { ...firebaseConfig, status: 'error' as const, lastTested: new Date().toLocaleTimeString() };
      setFirebaseConfig(updated);
      return {
        success: false,
        message: 'No fue posible conectar con el servidor de Firestore. Verifica tu conexión a internet o los datos ingresados.',
      };
    }
  };

  const resetToDefaults = () => {
    setProjects(projectsData);
    setBlogPosts(blogPostsData);
    setFirebaseConfig(defaultFirebaseConfig);
    setSocialLinks(defaultSocialLinks);
    localStorage.removeItem(LOCAL_STORAGE_PROJECTS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BLOG_KEY);
    localStorage.removeItem(LOCAL_STORAGE_FIREBASE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SOCIAL_KEY);
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        blogPosts,
        firebaseConfig,
        adminAuth,
        twoFactorConfig,
        socialLinks,
        updateSocialLinks,
        loginAdmin,
        completeTwoFactorLogin,
        updateTwoFactorConfig,
        logoutAdmin,
        changePassword,
        addProject,
        updateProject,
        deleteProject,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        saveFirebaseConfig,
        testFirebaseConnection,
        resetToDefaults,
        isSyncing,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio debe usarse dentro de un PortfolioProvider');
  }
  return context;
};
