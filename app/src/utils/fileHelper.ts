import * as FileSystem from 'expo-file-system';
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
  await ensureDirExists();
  const filename = `${uuidv4()}.jpg`; // Gera um nome de arquivo único
  const permanentUri = `${imageDirectory}${filename}`;
  
  try {
    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri,
    });
    return permanentUri;
  } catch (error) {
    console.error("Erro ao salvar a imagem:", error);
    throw error; // Lança o erro para ser tratado no chamador
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
