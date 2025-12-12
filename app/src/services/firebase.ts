import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { query, where, getDocs, collection as collectionRef, setDoc, doc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Substitua os valores abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Habilita persistência IndexedDB no web (não aplicável em react-native)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    // Falhas de persistência podem ocorrer (multi-tab ou navegador incompatível)
    console.warn('IndexedDB persistence não habilitada:', err?.code || err);
  });
}

/**
 * Faz upload de uma URI (file/blob/http/data) para o Storage do Firebase
 * e retorna a URL pública.
 * @param uri URI da imagem (pode ser data:, blob:, http(s) ou file://)
 * @param uid opcional - id do usuário (se não informado, usa auth.currentUser.uid)
 */
export async function uploadImageForUser(uri: string, uid?: string): Promise<string> {
  const userId = uid || (auth.currentUser && auth.currentUser.uid);
  if (!userId) throw new Error('Usuário não autenticado');

  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `${uuidv4()}.jpg`;
  const storageRef = ref(storage, `users/${userId}/images/${filename}`);

  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);
  return url;
}

/**
 * Faz upload para uma área compartilhada baseada em `syncKey`.
 * Retorna a URL pública.
 */
export async function uploadImageForShared(uri: string, syncKey: string): Promise<string> {
  if (!syncKey) throw new Error('Sync key requerida');
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `${uuidv4()}.jpg`;
  const storageRef = ref(storage, `shared/${syncKey}/images/${filename}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

/**
 * Salva um documento de tatuagem na coleção compartilhada `shared/{syncKey}/tatuagens`.
 */
export async function saveTatuagemShared(syncKey: string, tatuagem: any): Promise<string> {
  const col = collectionRef(db, 'shared', syncKey, 'tatuagens');
  const docRef = await addDoc(col, { ...tatuagem, createdAt: new Date().toISOString() });
  return docRef.id;
}

/**
 * Busca todas as tatuagens compartilhadas para uma syncKey.
 */
export async function getTatuagensShared(syncKey: string): Promise<any[]> {
  const col = collectionRef(db, 'shared', syncKey, 'tatuagens');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Salva clientes na coleção compartilhada `shared/{syncKey}/clientes`.
 */
export async function saveClientesShared(syncKey: string, clientes: any[]): Promise<void> {
  const col = collectionRef(db, 'shared', syncKey, 'clientes');
  // Escreve cada cliente como doc com id próprio (se tiver) ou gerado
  for (const c of clientes) {
    const id = c.id || uuidv4();
    await setDoc(doc(col, id), { ...c, createdAt: new Date().toISOString() });
  }
}

/**
 * Busca clientes compartilhados
 */
export async function getClientesShared(syncKey: string): Promise<any[]> {
  const col = collectionRef(db, 'shared', syncKey, 'clientes');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Salva um documento de tatuagem na coleção do usuário.
 * Retorna o id do documento criado.
 */
export async function saveTatuagemDoc(uid: string, tatuagem: any): Promise<string> {
  const col = collection(db, 'users', uid, 'tatuagens');
  const docRef = await addDoc(col, {
    ...tatuagem,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// NOTA: preencha `firebaseConfig` com suas credenciais (Console Firebase -> Configurações do projeto).
// Em apps Expo bare/native, siga as instruções do Firebase para Android/iOS (google-services.json / GoogleService-Info.plist).
