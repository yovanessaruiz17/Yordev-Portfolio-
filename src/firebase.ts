import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Suprimir logs ruidosos de reintentos internos de la biblioteca Firebase
setLogLevel('error');

// Inicializar la app de Firebase garantizando singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Conectar con la base de datos de Firestore aprovisionada en Firebase ignorando propiedades undefined
let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      ignoreUndefinedProperties: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreDb;
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errCode = (error as any)?.code;
  const errMsg = error instanceof Error ? error.message : String(error);

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };

  // Si es un error transitorio de red o estado offline, permitir que Firestore use su caché local sin abortar la aplicación
  if (
    errCode === 'unavailable' ||
    errMsg.includes('The operation could not be completed') ||
    errMsg.includes('the client is offline')
  ) {
    console.warn('Firestore offline / reconexión en curso:', JSON.stringify(errInfo));
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validación inicial de conexión requerida por la directiva de Firebase
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
    }
  }
}

// Ejecutar prueba de conexión al arrancar
testConnection();
