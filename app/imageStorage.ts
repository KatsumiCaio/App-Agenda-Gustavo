import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Diretório onde as imagens das tatuagens serão salvas permanentemente (somente nativo)
export const imagesDir = isWeb
  ? 'localstorage:tatuagens/'
  : (FileSystem.documentDirectory || FileSystem.cacheDirectory) + 'tatuagens/';

// Em web, usamos localStorage (base64). Em nativo, usamos expo-file-system.
export const ensureDirExists = async (): Promise<void> => {
  if (isWeb) return; // não aplicável
  try {
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }
  } catch (err) {
    console.warn('Falha ao garantir diretório de imagens:', err);
    throw err;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]); // retorna apenas o base64 sem o prefixo
    };
    reader.readAsDataURL(blob);
  });
};

const downloadIfRemote = async (uri: string): Promise<string> => {
  if (!uri) throw new Error('URI inválida');
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    if (isWeb) {
      // no web, retornamos a mesma URL para ser processada pelo fetch/Blob
      return uri;
    }
    const cachePath = `${FileSystem.cacheDirectory}tmp_${Date.now()}`;
    const res = await FileSystem.downloadAsync(uri, cachePath);
    return res.uri;
  }
  return uri;
};

// Salva uma imagem (opção de compress/resizing). Retorna o caminho salvo.
export const saveImage = async (uri: string): Promise<string> => {
  try {
    if (!uri) throw new Error('URI inválida');
    if (isWeb) {
      // Web fallback: busca a imagem, converte para base64 e grava no localStorage
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      const filename = `${Date.now()}.jpg`;
      const key = `tatuagens:${filename}`;
      try {
        localStorage.setItem(key, base64);
        return `localstorage:${key}`;
      } catch (err) {
        console.error('Erro ao salvar imagem no localStorage (web):', err);
        throw err;
      }
    }

    await ensureDirExists();
    // Caso venha uma URL remota, faz download primeiro (nativo)
    const localUri = await downloadIfRemote(uri);

    // Compacta / redimensiona para economizar espaço
    const manipulated = await ImageManipulator.manipulateAsync(
      localUri,
      [{ resize: { width: 1024 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    const filename = `${Date.now()}.jpg`;
    const dest = imagesDir + filename;

    // Em algumas plataformas a URI já pode ser um caminho de arquivo
    await FileSystem.copyAsync({ from: manipulated.uri, to: dest });
    return dest;
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw error;
  }
};

// Deleta uma imagem (útil se o usuário excluir o agendamento)
export const deleteImage = async (uri: string) => {
  try {
    if (!uri) return;
    if (isWeb && uri.startsWith('localstorage:')) {
      const key = uri.replace('localstorage:', '');
      localStorage.removeItem(key);
      return;
    }
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (err) {
    console.warn('Erro ao deletar imagem:', err);
  }
};

// Função de debug: tenta salvar e loga passos/erros (use para reproduzir problema)
export const debugSaveImage = async (uri: string) => {
  console.log('debugSaveImage: início', { uri, imagesDir, platform: Platform.OS });
  try {
    const result = await saveImage(uri);
    console.log('debugSaveImage: sucesso', result);
    return result;
  } catch (err) {
    console.error('debugSaveImage: erro', err);
    throw err;
  }
};

// Deleta todas as imagens do localStorage (apenas para web)
export const clearAllImages = async (): Promise<void> => {
  if (!isWeb) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tatuagens:')) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('Erro ao limpar imagens do localStorage:', err);
  }
};

// Retorna uma URI utilizável em <Image /> (converte localstorage:... para data:base64)
export const getDisplayUri = async (uri: string): Promise<string> => {
  if (!uri) return '';
  if (isWeb && uri.startsWith('localstorage:')) {
    const key = uri.replace('localstorage:', '');
    const base64 = localStorage.getItem(key);
    if (!base64) throw new Error('Imagem não encontrada no localStorage');
    return `data:image/jpeg;base64,${base64}`;
  }
  return uri;
};