import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Project, BlogPost, FirebaseConfig, SocialLinks } from '../types';

export const PROJECTS_COLLECTION = 'proyectos';
export const BLOG_COLLECTION = 'articulos_blog';
export const CONFIG_COLLECTION = 'configuracion';
export const COMPANY_DOC_ID = 'empresa';

/**
 * Obtiene todos los proyectos directamente desde Firestore
 */
export async function fetchProjectsFromFirestore(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects: Project[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Project;
      if (data && data.titulo) {
        projects.push({ ...data, id: Number(data.id || docSnap.id) });
      }
    });
    projects.sort((a, b) => b.id - a.id);
    return { success: true, projects };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
    return { success: false, error: error instanceof Error ? error.message : 'Error al obtener proyectos' };
  }
}

/**
 * Obtiene todos los artículos del blog directamente desde Firestore
 */
export async function fetchBlogPostsFromFirestore(): Promise<{ success: boolean; blogPosts?: BlogPost[]; error?: string }> {
  try {
    const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
    const posts: BlogPost[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as BlogPost;
      if (data && data.titulo) {
        posts.push({ ...data, id: Number(data.id || docSnap.id) });
      }
    });
    posts.sort((a, b) => b.id - a.id);
    return { success: true, blogPosts: posts };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BLOG_COLLECTION);
    return { success: false, error: error instanceof Error ? error.message : 'Error al obtener artículos' };
  }
}

/**
 * Obtiene los datos de la empresa y redes de contacto desde Firestore
 */
export async function fetchCompanyConfigFromFirestore(): Promise<{ success: boolean; config?: Partial<SocialLinks>; error?: string }> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, COMPANY_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { success: true, config: snap.data() as Partial<SocialLinks> };
    }
    return { success: true, config: undefined };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${CONFIG_COLLECTION}/${COMPANY_DOC_ID}`);
    return { success: false, error: error instanceof Error ? error.message : 'Error al obtener configuración' };
  }
}

/**
 * Guarda o actualiza un proyecto en Firestore
 */
export async function saveProjectToFirestore(_config: FirebaseConfig, project: Project): Promise<{ success: boolean; error?: string }> {
  const path = `${PROJECTS_COLLECTION}/${project.id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, String(project.id));
    const payload = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: error instanceof Error ? error.message : 'Error al guardar proyecto' };
  }
}

/**
 * Guarda o actualiza un artículo del blog en Firestore
 */
export async function saveBlogPostToFirestore(_config: FirebaseConfig, post: BlogPost): Promise<{ success: boolean; error?: string }> {
  const path = `${BLOG_COLLECTION}/${post.id}`;
  try {
    const docRef = doc(db, BLOG_COLLECTION, String(post.id));
    const payload = {
      ...post,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: error instanceof Error ? error.message : 'Error al guardar artículo' };
  }
}

/**
 * Guarda la configuración de la empresa y redes en Firestore
 */
export async function saveCompanyConfigToFirestore(links: SocialLinks): Promise<{ success: boolean; error?: string }> {
  const path = `${CONFIG_COLLECTION}/${COMPANY_DOC_ID}`;
  try {
    const docRef = doc(db, CONFIG_COLLECTION, COMPANY_DOC_ID);
    const payload = {
      ...links,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: error instanceof Error ? error.message : 'Error al guardar datos de empresa' };
  }
}

/**
 * Elimina un documento (proyecto o blog) de Firestore
 */
export async function deleteDocumentFromFirestore(_config: FirebaseConfig, collectionName: string, id: number): Promise<{ success: boolean; error?: string }> {
  const path = `${collectionName}/${id}`;
  try {
    const docRef = doc(db, collectionName, String(id));
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: error instanceof Error ? error.message : 'Error al eliminar documento' };
  }
}

/**
 * Suscripción en tiempo real a la colección de Proyectos
 */
export function subscribeToProjects(onUpdate: (projects: Project[]) => void, onError?: (err: any) => void): Unsubscribe {
  const colRef = collection(db, PROJECTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        if (data && data.titulo) {
          items.push({ ...data, id: Number(data.id || docSnap.id) });
        }
      });
      items.sort((a, b) => b.id - a.id);
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Suscripción en tiempo real a la colección de Blog
 */
export function subscribeToBlogPosts(onUpdate: (posts: BlogPost[]) => void, onError?: (err: any) => void): Unsubscribe {
  const colRef = collection(db, BLOG_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as BlogPost;
        if (data && data.titulo) {
          items.push({ ...data, id: Number(data.id || docSnap.id) });
        }
      });
      items.sort((a, b) => b.id - a.id);
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, BLOG_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Suscripción en tiempo real a la configuración de la empresa
 */
export function subscribeToCompanyConfig(onUpdate: (links: SocialLinks) => void, onError?: (err: any) => void): Unsubscribe {
  const docRef = doc(db, CONFIG_COLLECTION, COMPANY_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SocialLinks;
        onUpdate(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${CONFIG_COLLECTION}/${COMPANY_DOC_ID}`);
      if (onError) onError(error);
    }
  );
}

/**
 * Sube todos los proyectos y artículos iniciales en lote (batch) a Cloud Firestore
 */
export async function pushAllToFirestore(
  _config: FirebaseConfig,
  projects: Project[],
  blogPosts: BlogPost[],
  socialLinks?: SocialLinks
): Promise<{ success: boolean; error?: string; projectCount?: number; blogCount?: number }> {
  try {
    const batch = writeBatch(db);
    const nowIso = new Date().toISOString();

    for (const project of projects) {
      const docRef = doc(db, PROJECTS_COLLECTION, String(project.id));
      batch.set(docRef, { ...project, updatedAt: nowIso }, { merge: true });
    }

    for (const post of blogPosts) {
      const docRef = doc(db, BLOG_COLLECTION, String(post.id));
      batch.set(docRef, { ...post, updatedAt: nowIso }, { merge: true });
    }

    if (socialLinks) {
      const docRef = doc(db, CONFIG_COLLECTION, COMPANY_DOC_ID);
      batch.set(docRef, { ...socialLinks, updatedAt: nowIso }, { merge: true });
    }

    await batch.commit();

    return {
      success: true,
      projectCount: projects.length,
      blogCount: blogPosts.length,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch/pushAll');
    return { success: false, error: error instanceof Error ? error.message : 'Error al sincronizar en lote con Firestore' };
  }
}
