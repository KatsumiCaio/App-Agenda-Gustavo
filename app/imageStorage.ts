import * as FileSystem from 'expo-file-system/legacy';

// Diretório onde as imagens das tatuagens serão salvas permanentemente
export const imagesDir = FileSystem.documentDirectory + 'tatuagens/';

// Garante que o diretório de imagens exista
export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imagesDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
  }
};

// Salva uma imagem (copia do cache temporário para nossa pasta permanente)
export const saveImage = async (uri: string): Promise<string> => {
  try {
    await ensureDirExists();
    // Gera um nome único baseado no timestamp
    const filename = new Date().getTime() + '.jpg';
    const dest = imagesDir + filename;
    
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw error;
  }
};

// Deleta uma imagem (útil se o usuário excluir o agendamento)
export const deleteImage = async (uri: string) => {
  await FileSystem.deleteAsync(uri, { idempotent: true });
};