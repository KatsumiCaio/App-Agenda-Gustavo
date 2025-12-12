import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { saveImage as saveImageStorage } from '../../imageStorage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const imageDirectory = `${FileSystem.documentDirectory}images/`;

// Função para garantir que o diretório de imagens exista
const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imageDirectory);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imageDirectory, { intermediates: true });
  }
};

/**
 * Salva uma imagem de um URI temporário para um local permanente no sistema de arquivos do aplicativo.
 * @param tempUri O URI temporário da imagem selecionada.
 * @returns O URI permanente do arquivo salvo.
 */
export const saveImagePermanently = async (tempUri: string): Promise<string> => {
  // No web, delegamos para imageStorage.saveImage que grava em localStorage e retorna uma URI do tipo localstorage:...
  if (Platform.OS === 'web') {
    try {
      const saved = await saveImageStorage(tempUri);
      return saved;
    } catch (err) {
      console.error('Erro ao salvar imagem no web via imageStorage:', err);
      throw err;
    }
  }

  await ensureDirExists();
  const filename = `${uuidv4()}.jpg`;
  const permanentUri = `${imageDirectory}${filename}`;

  try {
    await FileSystem.copyAsync({ from: tempUri, to: permanentUri });
    return permanentUri;
  } catch (error) {
    console.error('Erro ao salvar a imagem:', error);
    throw error;
  }
};

/**
 * Deleta uma imagem do sistema de arquivos.
 * @param uri O URI da imagem a ser deletada.
 */
export const deleteImage = async (uri: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error("Erro ao deletar a imagem:", error);
    // Não lançamos o erro para não impedir a continuação da execução
  }
};

/**
 * Deleta todas as imagens salvas no diretório de imagens.
 */
export const deleteAllImages = async (): Promise<void> => {
  try {
    await FileSystem.deleteAsync(imageDirectory, { idempotent: true });
    await ensureDirExists(); // Recria o diretório para uso futuro
  } catch (error) {
    console.error("Erro ao deletar o diretório de imagens:", error);
  }
};
