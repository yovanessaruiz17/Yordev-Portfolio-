import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  TwoFactorConfig,
} from '../utils/auth';
import {
  fetchProjectsFromFirestore,
  fetchBlogPostsFromFirestore,
  fetchCompanyConfigFromFirestore,
  saveProjectToFirestore,
  saveBlogPostToFirestore,
  saveCompanyConfigToFirestore,
  deleteDocumentFromFirestore,
  subscribeToProjects,
  subscribeToBlogPosts,
  subscribeToCompanyConfig,
  pushAllToFirestore,
  PROJECTS_COLLECTION,
  BLOG_COLLECTION,
} from '../utils/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const CACHE_PROJECTS_KEY = 'yordev_cache_projects_v2';
const CACHE_BLOG_KEY = 'yordev_cache_blog_v2';
const CACHE_SOCIAL_KEY = 'yordev_cache_social_links_v2';

// Configuración oficial de Firebase aprovisionada
const officialFirebaseConfig: FirebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || '',
  authDomain: firebaseAppletConfig.authDomain || '',
  projectId: firebaseAppletConfig.projectId || '',
  storageBucket: firebaseAppletConfig.storageBucket || '',
  messagingSenderId: firebaseAppletConfig.messagingSenderId || '',
  appId: firebaseAppletConfig.appId || '',
  measurementId: firebaseAppletConfig.measurementId || '',
  projectsCollection: 'proyectos',
  blogCollection: 'articulos_blog',
  status: 'connected',
  lastTested: 'Conectado a Cloud Firestore',
};

interface PortfolioContextType {
  projects: Project[];
  blogPosts: BlogPost[];
  firebaseConfig: FirebaseConfig;
  adminAuth: AdminAuthState;
  twoFactorConfig: TwoFactorConfig;
  socialLinks: SocialLinks;
  updateSocialLinks: (links: Partial<SocialLinks>) => Promise<void>;
  loginAdmin: (identifier: string, passwordAttempt: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; remainingAttempts?: number; lockedUntilSeconds?: number; user?: AdminUser }>;
  completeTwoFactorLogin: (user: AdminUser) => void;
  updateTwoFactorConfig: (cfg: TwoFactorConfig) => void;
  logoutAdmin: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  addProject: (project: Omit<Project, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateProject: (project: Project) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: number) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateBlogPost: (post: BlogPost) => Promise<{ success: boolean; error?: string }>;
  deleteBlogPost: (id: number) => Promise<void>;
  saveFirebaseConfig: (config: FirebaseConfig) => void;
  testFirebaseConnection: () => Promise<{ success: boolean; message: string }>;
  syncToFirestore: () => Promise<{ success: boolean; message: string; projectCount?: number; blogCount?: number }>;
  syncFromFirestore: () => Promise<{ success: boolean; message: string; projectCount?: number; blogCount?: number }>;
  resetToDefaults: () => Promise<void>;
  isSyncing: boolean;
  lastCloudSyncTime: string | null;
  isFirestoreConnected: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado de proyectos con caché de inicio rápido
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return projectsData;
  });

  // Estado de artículos de blog con caché de inicio rápido
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_BLOG_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return blogPostsData;
  });

  // Configuración de la empresa y redes sociales
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    try {
      const cached = localStorage.getItem(CACHE_SOCIAL_KEY);
      if (cached) {
        return { ...defaultSocialLinks, ...JSON.parse(cached) };
      }
    } catch {
      //
    }
    return defaultSocialLinks;
  });

  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(officialFirebaseConfig);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Estado de autenticación del administrador
  const [adminAuth, setAdminAuth] = useState<AdminAuthState>(() => checkActiveSession());

  // Configuración de Autenticación de Dos Factores (2FA)
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>(() => getTwoFactorConfig());

  // =========================================================================
  // SINCRONIZACIÓN EN TIEMPO REAL CON FIRESTORE (MULTI-DISPOSITIVO)
  // =========================================================================
  useEffect(() => {
    let isInitialMount = true;

    // 1. Suscripción en tiempo real a la colección de PROYECTOS
    const unsubProjects = subscribeToProjects(
      (loadedProjects) => {
        setIsFirestoreConnected(true);
        setLastCloudSyncTime(new Date().toLocaleTimeString());
        if (loadedProjects && loadedProjects.length > 0) {
          setProjects((prevLocalProjects) => {
            const firestoreIds = new Set(loadedProjects.map((p) => Number(p.id)));
            // Detectar si en este dispositivo existían proyectos creados localmente aún no guardados en Firestore
            const unsaved = prevLocalProjects.filter((p) => !firestoreIds.has(Number(p.id)));

            if (unsaved.length > 0) {
              console.log(`Detectados ${unsaved.length} proyectos locales pendientes. Sincronizando con Cloud Firestore...`);
              unsaved.forEach((p) => {
                saveProjectToFirestore(officialFirebaseConfig, p).catch((err) =>
                  console.error('Error auto-sincronizando proyecto con Firestore:', err)
                );
              });
              const merged = [...loadedProjects, ...unsaved].sort((a, b) => b.id - a.id);
              try {
                localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(merged));
              } catch {
                //
              }
              return merged;
            }

            try {
              localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(loadedProjects));
            } catch {
              //
            }
            return loadedProjects;
          });
        } else if (isInitialMount) {
          // Si la base de datos está vacía por ser la primera vez, sembrar automáticamente
          pushAllToFirestore(officialFirebaseConfig, projectsData, blogPostsData, defaultSocialLinks)
            .then(() => console.log('Base de datos inicializada en Firestore con éxito'))
            .catch((err) => console.warn('Error inicializando Firestore:', err));
        }
      },
      (error) => {
        console.warn('Alerta conexión Firestore proyectos:', error);
      }
    );

    // 2. Suscripción en tiempo real a la colección de BLOG
    const unsubBlog = subscribeToBlogPosts(
      (loadedPosts) => {
        setIsFirestoreConnected(true);
        setLastCloudSyncTime(new Date().toLocaleTimeString());
        if (loadedPosts && loadedPosts.length > 0) {
          setBlogPosts((prevLocalPosts) => {
            const firestoreIds = new Set(loadedPosts.map((b) => Number(b.id)));
            const unsaved = prevLocalPosts.filter((b) => !firestoreIds.has(Number(b.id)));

            if (unsaved.length > 0) {
              unsaved.forEach((b) => {
                saveBlogPostToFirestore(officialFirebaseConfig, b).catch((err) =>
                  console.error('Error auto-sincronizando artículo con Firestore:', err)
                );
              });
              const merged = [...loadedPosts, ...unsaved].sort((a, b) => b.id - a.id);
              try {
                localStorage.setItem(CACHE_BLOG_KEY, JSON.stringify(merged));
              } catch {
                //
              }
              return merged;
            }

            try {
              localStorage.setItem(CACHE_BLOG_KEY, JSON.stringify(loadedPosts));
            } catch {
              //
            }
            return loadedPosts;
          });
        }
      },
      (error) => {
        console.warn('Alerta conexión Firestore blog:', error);
      }
    );

    // 3. Suscripción en tiempo real a la CONFIGURACIÓN DE EMPRESA / REDES
    const unsubCompany = subscribeToCompanyConfig(
      (loadedSocial) => {
        setIsFirestoreConnected(true);
        if (loadedSocial) {
          setSocialLinks((prev) => {
            const merged = { ...prev, ...loadedSocial };
            try {
              localStorage.setItem(CACHE_SOCIAL_KEY, JSON.stringify(merged));
            } catch {
              //
            }
            return merged;
          });
        }
      },
      (error) => {
        console.warn('Alerta conexión Firestore empresa:', error);
      }
    );

    isInitialMount = false;

    return () => {
      unsubProjects();
      unsubBlog();
      unsubCompany();
    };
  }, []);

  // Asegurar admin inicializado en primer montaje
  useEffect(() => {
    ensureAdminInitialized();
  }, []);

  // Login de Administrador
  const loginAdmin = async (
    identifier: string,
    passwordAttempt: string,
    rememberMe: boolean = true
  ) => {
    const result = await verifyAdminCredentials(identifier, passwordAttempt, rememberMe);
    if (result.success && result.user) {
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

  const logoutAdmin = () => {
    clearSession();
    setAdminAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    return await changeAdminPassword(currentPass, newPass);
  };

  // =========================================================================
  // OPERACIONES DE ESCRITURA DIRECTAS EN CLOUD FIRESTORE
  // =========================================================================

  // Guardar datos de la empresa y redes directamente en Firestore
  const updateSocialLinks = async (newLinks: Partial<SocialLinks>) => {
    let updated: SocialLinks = { ...socialLinks, ...newLinks };
    if (newLinks.whatsappNumber !== undefined || newLinks.whatsappMessage !== undefined) {
      const rawNum = (newLinks.whatsappNumber !== undefined ? newLinks.whatsappNumber : socialLinks.whatsappNumber) || '';
      const msg = (newLinks.whatsappMessage !== undefined ? newLinks.whatsappMessage : socialLinks.whatsappMessage) || '';
      const cleanDigits = rawNum.replace(/\D/g, '');
      if (cleanDigits) {
        updated.whatsapp = `https://wa.me/${cleanDigits}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
      }
    }

    setSocialLinks(updated);
    try {
      localStorage.setItem(CACHE_SOCIAL_KEY, JSON.stringify(updated));
    } catch {
      //
    }

    // Escritura directa en Firestore
    await saveCompanyConfigToFirestore(updated);
  };

  // Agregar nuevo proyecto a Cloud Firestore
  const addProject = async (newProjectData: Omit<Project, 'id'>) => {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => Number(p.id))) + 1 : 1;
    const projectWithId: Project = {
      ...newProjectData,
      id: nextId,
      cliente: newProjectData.cliente?.trim() || '',
      estado: newProjectData.estado?.trim() || 'En línea',
      url: newProjectData.url?.trim() || '#',
    };

    // Actualización inmediata en UI
    setProjects((prev) => [projectWithId, ...prev.filter((p) => p.id !== nextId)]);

    // Escritura en Firestore (se transmitirá automáticamente a todos los dispositivos)
    const result = await saveProjectToFirestore(officialFirebaseConfig, projectWithId);
    if (result.success) {
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } else {
      console.error('Error guardando proyecto en Firestore:', result.error);
    }
    return result;
  };

  // Actualizar proyecto en Cloud Firestore
  const updateProject = async (updatedProject: Project) => {
    const sanitizedProject: Project = {
      ...updatedProject,
      id: Number(updatedProject.id),
      cliente: updatedProject.cliente?.trim() || '',
      estado: updatedProject.estado?.trim() || 'En línea',
      url: updatedProject.url?.trim() || '#',
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === sanitizedProject.id ? sanitizedProject : p))
    );

    const result = await saveProjectToFirestore(officialFirebaseConfig, sanitizedProject);
    if (result.success) {
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } else {
      console.error('Error actualizando proyecto en Firestore:', result.error);
    }
    return result;
  };

  // Eliminar proyecto en Cloud Firestore
  const deleteProject = async (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteDocumentFromFirestore(officialFirebaseConfig, PROJECTS_COLLECTION, id);
    setLastCloudSyncTime(new Date().toLocaleTimeString());
  };

  // Agregar artículo de blog en Cloud Firestore
  const addBlogPost = async (newPostData: Omit<BlogPost, 'id'>) => {
    const nextId = blogPosts.length > 0 ? Math.max(...blogPosts.map((b) => b.id)) + 1 : 1;
    const postWithId: BlogPost = {
      ...newPostData,
      id: nextId,
    };

    setBlogPosts((prev) => [postWithId, ...prev.filter((b) => b.id !== nextId)]);

    const result = await saveBlogPostToFirestore(officialFirebaseConfig, postWithId);
    if (result.success) {
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    }
    return result;
  };

  // Actualizar artículo de blog en Cloud Firestore
  const updateBlogPost = async (updatedPost: BlogPost) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === updatedPost.id ? updatedPost : b))
    );

    const result = await saveBlogPostToFirestore(officialFirebaseConfig, updatedPost);
    if (result.success) {
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    }
    return result;
  };

  // Eliminar artículo de blog en Cloud Firestore
  const deleteBlogPost = async (id: number) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    await deleteDocumentFromFirestore(officialFirebaseConfig, BLOG_COLLECTION, id);
    setLastCloudSyncTime(new Date().toLocaleTimeString());
  };

  const saveFirebaseConfig = (config: FirebaseConfig) => {
    setFirebaseConfig(config);
  };

  // Test de conexión con Firestore usando el SDK oficial
  const testFirebaseConnection = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    try {
      const res = await fetchProjectsFromFirestore();
      setIsSyncing(false);
      const now = new Date().toLocaleTimeString();
      if (res.success) {
        setIsFirestoreConnected(true);
        setLastCloudSyncTime(now);
        return {
          success: true,
          message: `¡Conexión verificada con Cloud Firestore! Base de datos activa y sincronizando en tiempo real (${res.projects?.length || 0} proyectos sincronizados).`,
        };
      } else {
        return {
          success: false,
          message: res.error || 'No se pudo conectar con Firestore.',
        };
      }
    } catch (err: any) {
      setIsSyncing(false);
      return {
        success: false,
        message: err.message || 'Error al conectar con Cloud Firestore.',
      };
    }
  };

  // Subir manualmente todos los proyectos y artículos en lote a Firestore
  const syncToFirestore = async (): Promise<{ success: boolean; message: string; projectCount?: number; blogCount?: number }> => {
    setIsSyncing(true);
    try {
      const result = await pushAllToFirestore(officialFirebaseConfig, projects, blogPosts, socialLinks);
      setIsSyncing(false);
      if (result.success) {
        const now = new Date().toLocaleTimeString();
        setLastCloudSyncTime(now);
        setIsFirestoreConnected(true);
        return {
          success: true,
          message: `¡Base de datos Firestore sincronizada con éxito! ${result.projectCount} proyectos y ${result.blogCount} artículos guardados en la nube.`,
          projectCount: result.projectCount,
          blogCount: result.blogCount,
        };
      } else {
        return {
          success: false,
          message: result.error || 'Error al sincronizar con Firestore.',
        };
      }
    } catch (err: any) {
      setIsSyncing(false);
      return {
        success: false,
        message: err.message || 'Error de conexión con Firestore.',
      };
    }
  };

  // Descargar proyectos y artículos desde Firestore
  const syncFromFirestore = async (): Promise<{ success: boolean; message: string; projectCount?: number; blogCount?: number }> => {
    setIsSyncing(true);
    try {
      const [projRes, blogRes, compRes] = await Promise.all([
        fetchProjectsFromFirestore(),
        fetchBlogPostsFromFirestore(),
        fetchCompanyConfigFromFirestore(),
      ]);
      setIsSyncing(false);

      if (!projRes.success && !blogRes.success) {
        return {
          success: false,
          message: projRes.error || blogRes.error || 'No se pudieron descargar los datos de Firestore.',
        };
      }

      let pCount = 0;
      let bCount = 0;

      if (projRes.success && projRes.projects && projRes.projects.length > 0) {
        setProjects(projRes.projects);
        pCount = projRes.projects.length;
      }

      if (blogRes.success && blogRes.blogPosts && blogRes.blogPosts.length > 0) {
        setBlogPosts(blogRes.blogPosts);
        bCount = blogRes.blogPosts.length;
      }

      if (compRes.success && compRes.config) {
        setSocialLinks((prev) => ({ ...prev, ...compRes.config }));
      }

      const now = new Date().toLocaleTimeString();
      setLastCloudSyncTime(now);
      setIsFirestoreConnected(true);

      return {
        success: true,
        message: `¡Datos actualizados desde Cloud Firestore! ${pCount} proyectos y ${bCount} artículos descargados.`,
        projectCount: pCount,
        blogCount: bCount,
      };
    } catch (err: any) {
      setIsSyncing(false);
      return {
        success: false,
        message: err.message || 'Error al descargar de Firestore.',
      };
    }
  };

  const resetToDefaults = async () => {
    setProjects(projectsData);
    setBlogPosts(blogPostsData);
    setSocialLinks(defaultSocialLinks);
    setLastCloudSyncTime(null);
    localStorage.removeItem(CACHE_PROJECTS_KEY);
    localStorage.removeItem(CACHE_BLOG_KEY);
    localStorage.removeItem(CACHE_SOCIAL_KEY);

    // Sobrescribir Firestore con los datos por defecto
    await pushAllToFirestore(officialFirebaseConfig, projectsData, blogPostsData, defaultSocialLinks);
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
        syncToFirestore,
        syncFromFirestore,
        resetToDefaults,
        isSyncing,
        lastCloudSyncTime,
        isFirestoreConnected,
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
