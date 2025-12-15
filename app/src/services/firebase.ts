import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { v4 as uuidv4 } from 'uuid';
import { Tatuagem } from '../types';

// Substitua os valores abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Use initializeApp from the compat namespace
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// Habilita persistência IndexedDB no web (não aplicável em react-native)
if (typeof window !== 'undefined') {
  db.enablePersistence().catch((err) => {
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
  const storageRef = storage.ref(`users/${userId}/images/${filename}`);

  await storageRef.put(blob);
  const url = await storageRef.getDownloadURL();
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
  const storageRef = storage.ref(`shared/${syncKey}/images/${filename}`);
  await storageRef.put(blob);
  return await storageRef.getDownloadURL();
}

/**
 * Salva um documento de tatuagem na coleção compartilhada `shared/{syncKey}/tatuagens`.
 */
export async function saveTatuagemShared(syncKey: string, tatuagem: Partial<Tatuagem>): Promise<string> {
  const col = db.collection('shared').doc(syncKey).collection('tatuagens');
  const docRef = await col.add({ ...tatuagem, createdAt: new Date().toISOString() });
  return docRef.id;
}

/**
 * Busca todas as tatuagens compartilhadas para uma syncKey.
 */
export async function getTatuagensShared(syncKey: string): Promise<any[]> {
  const col = db.collection('shared').doc(syncKey).collection('tatuagens');
  const snap = await col.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Salva clientes na coleção compartilhada `shared/{syncKey}/clientes`.
 */
export async function saveClientesShared(syncKey: string, clientes: any[]): Promise<void> {
  const batch = db.batch();
  const col = db.collection('shared').doc(syncKey).collection('clientes');
  for (const c of clientes) {
    const id = c.id || uuidv4();
    const docRef = col.doc(id);
    batch.set(docRef, { ...c, createdAt: new Date().toISOString() });
  }
  await batch.commit();
}

/**
 * Busca clientes compartilhados
 */
export async function getClientesShared(syncKey: string): Promise<any[]> {
  const col = db.collection('shared').doc(syncKey).collection('clientes');
  const snap = await col.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Salva um documento de tatuagem na coleção do usuário.
 * Retorna o id do documento criado.
 */
export async function saveTatuagemDoc(uid: string, tatuagem: Partial<Tatuagem>): Promise<string> {
  const col = db.collection('users').doc(uid).collection('tatuagens');
  const docRef = await col.add({
    ...tatuagem,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Combina o upload de imagem e a criação de um documento de tatuagem no Firestore.
 * A imagem (se existir) é enviada para o Storage e a URL é salva no documento.
 * Retorna o ID do novo documento.
 */
export async function saveTatuagemCloud(tatuagem: Partial<Tatuagem>): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('Usuário não autenticado. Não é possível salvar a tatuagem.');
  }

  // Se uma nova imagem de modelo foi fornecida como uma URI local, faça o upload.
  let uploadedImageUrl = tatuagem.imagemModelo || null;
  if (tatuagem.imagemModelo && !tatuagem.imagemModelo.startsWith('http')) {
    uploadedImageUrl = await uploadImageForUser(tatuagem.imagemModelo, auth.currentUser.uid);
  }

  const tatuagemData = {
    ...tatuagem,
    imagemModelo: uploadedImageUrl,
    createdAt: new Date().toISOString(),
  };

  const collectionRef = db.collection('users').doc(auth.currentUser.uid).collection('tatuagens');
  const docRef = await collectionRef.add(tatuagemData);
  return docRef.id;
}

// NOTA: preencha `firebaseConfig` com suas credenciais (Console Firebase -> Configurações do projeto).
// Em apps Expo bare/native, siga as instruções do Firebase para Android/iOS (google-services.json / GoogleService-Info.plist).
