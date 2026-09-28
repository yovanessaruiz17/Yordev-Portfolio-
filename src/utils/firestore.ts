import { Project, BlogPost, FirebaseConfig } from '../types';

/**
 * Utilidades para interactuar directamente con la API REST de Google Cloud Firestore.
 * Esto permite sincronización bidireccional en Netlify sin necesidad de librerías pesadas.
 */

function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const mapFields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      mapFields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields: mapFields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ('mapValue' in val) {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      res[k] = fromFirestoreValue(v);
    }
    return res;
  }
  return null;
}

function fromFirestoreDocument(doc: any): any {
  if (!doc || !doc.fields) return null;
  const res: Record<string, any> = {};
  for (const [key, val] of Object.entries(doc.fields)) {
    res[key] = fromFirestoreValue(val);
  }
  // Extraer el ID del documento si no está en fields
  if (!res.id && doc.name) {
    const parts = doc.name.split('/');
    const docId = parts[parts.length - 1];
    const numId = parseInt(docId, 10);
    res.id = isNaN(numId) ? docId : numId;
  }
  return res;
}

/**
 * Obtiene todos los proyectos almacenados en Cloud Firestore
 */
export async function fetchProjectsFromFirestore(config: FirebaseConfig): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, error: 'Project ID no configurado.' };
  }

  const collection = config.projectsCollection.trim() || 'proyectos';
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    config.projectId.trim()
  )}/databases/(default)/documents/${encodeURIComponent(collection)}${
    config.apiKey.trim() ? `?key=${encodeURIComponent(config.apiKey.trim())}` : ''
  }`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: true, projects: [] }; // Colección vacía
      }
      return { success: false, error: `Error ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) {
      return { success: true, projects: [] };
    }

    const loadedProjects: Project[] = data.documents
      .map((doc: any) => fromFirestoreDocument(doc))
      .filter((p: any) => p && p.titulo && typeof p.id === 'number');

    // Ordenar por ID descendente
    loadedProjects.sort((a, b) => b.id - a.id);
    return { success: true, projects: loadedProjects };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red al consultar Firestore' };
  }
}

/**
 * Obtiene todos los artículos del blog almacenados en Cloud Firestore
 */
export async function fetchBlogPostsFromFirestore(config: FirebaseConfig): Promise<{ success: boolean; blogPosts?: BlogPost[]; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, error: 'Project ID no configurado.' };
  }

  const collection = config.blogCollection.trim() || 'articulos_blog';
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    config.projectId.trim()
  )}/databases/(default)/documents/${encodeURIComponent(collection)}${
    config.apiKey.trim() ? `?key=${encodeURIComponent(config.apiKey.trim())}` : ''
  }`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: true, blogPosts: [] };
      }
      return { success: false, error: `Error ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) {
      return { success: true, blogPosts: [] };
    }

    const loadedPosts: BlogPost[] = data.documents
      .map((doc: any) => fromFirestoreDocument(doc))
      .filter((b: any) => b && b.titulo && typeof b.id === 'number');

    loadedPosts.sort((a, b) => b.id - a.id);
    return { success: true, blogPosts: loadedPosts };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red al consultar Firestore' };
  }
}

/**
 * Guarda o actualiza un documento de proyecto individual en Cloud Firestore
 */
export async function saveProjectToFirestore(config: FirebaseConfig, project: Project): Promise<{ success: boolean; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, error: 'Project ID no configurado' };
  }

  const collection = config.projectsCollection.trim() || 'proyectos';
  const docId = String(project.id);
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    config.projectId.trim()
  )}/databases/(default)/documents/${encodeURIComponent(collection)}/${encodeURIComponent(docId)}${
    config.apiKey.trim() ? `?key=${encodeURIComponent(config.apiKey.trim())}` : ''
  }`;

  try {
    const fields = toFirestoreFields(project);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      return { success: false, error: `Error ${res.status}: Verifica las reglas de Firestore` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red al guardar proyecto en Firestore' };
  }
}

/**
 * Guarda o actualiza un documento de artículo de blog en Cloud Firestore
 */
export async function saveBlogPostToFirestore(config: FirebaseConfig, post: BlogPost): Promise<{ success: boolean; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, error: 'Project ID no configurado' };
  }

  const collection = config.blogCollection.trim() || 'articulos_blog';
  const docId = String(post.id);
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    config.projectId.trim()
  )}/databases/(default)/documents/${encodeURIComponent(collection)}/${encodeURIComponent(docId)}${
    config.apiKey.trim() ? `?key=${encodeURIComponent(config.apiKey.trim())}` : ''
  }`;

  try {
    const fields = toFirestoreFields(post);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      return { success: false, error: `Error ${res.status}: Verifica las reglas de Firestore` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red al guardar artículo en Firestore' };
  }
}

/**
 * Elimina un documento de Cloud Firestore
 */
export async function deleteDocumentFromFirestore(config: FirebaseConfig, collection: string, id: number): Promise<{ success: boolean; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, error: 'Project ID no configurado' };
  }

  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    config.projectId.trim()
  )}/databases/(default)/documents/${encodeURIComponent(collection)}/${encodeURIComponent(String(id))}${
    config.apiKey.trim() ? `?key=${encodeURIComponent(config.apiKey.trim())}` : ''
  }`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok && res.status !== 404) {
      return { success: false, error: `Error ${res.status} al eliminar documento` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red al eliminar en Firestore' };
  }
}

/**
 * Sube por lote (batch sync) todos los proyectos y artículos locales hacia Firestore
 */
export async function pushAllToFirestore(
  config: FirebaseConfig,
  projects: Project[],
  blogPosts: BlogPost[]
): Promise<{ success: boolean; uploadedProjects: number; uploadedBlog: number; error?: string }> {
  if (!config.projectId.trim()) {
    return { success: false, uploadedProjects: 0, uploadedBlog: 0, error: 'Project ID no configurado' };
  }

  let projCount = 0;
  let blogCount = 0;

  for (const proj of projects) {
    const res = await saveProjectToFirestore(config, proj);
    if (res.success) {
      projCount++;
    }
  }

  for (const post of blogPosts) {
    const res = await saveBlogPostToFirestore(config, post);
    if (res.success) {
      blogCount++;
    }
  }

  return {
    success: true,
    uploadedProjects: projCount,
    uploadedBlog: blogCount,
  };
}
