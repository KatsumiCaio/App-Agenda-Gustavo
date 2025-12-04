import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tatuagem } from '../types';

const TATUAGENS_KEY = 'tatuagens_data';

export const StorageService = {
  async getTatuagens(): Promise<Tatuagem[]> {
    try {
      const data = await AsyncStorage.getItem(TATUAGENS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar tatuagens:', error);
      return [];
    }
  },

  async saveTatuagens(tatuagens: Tatuagem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TATUAGENS_KEY, JSON.stringify(tatuagens));
    } catch (error) {
      console.error('Erro ao salvar tatuagens:', error);
    }
  },

  async addTatuagem(tatuagem: Tatuagem): Promise<void> {
    const tatuagens = await this.getTatuagens();
    tatuagens.push(tatuagem);
    await this.saveTatuagens(tatuagens);
  },

  async updateTatuagem(id: string, updates: Partial<Tatuagem>): Promise<void> {
    const tatuagens = await this.getTatuagens();
    const index = tatuagens.findIndex(t => t.id === id);
    if (index !== -1) {
      tatuagens[index] = { ...tatuagens[index], ...updates };
      await this.saveTatuagens(tatuagens);
    }
  },

  async deleteTatuagem(id: string): Promise<void> {
    const tatuagens = await this.getTatuagens();
    const filtered = tatuagens.filter(t => t.id !== id);
    await this.saveTatuagens(filtered);
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TATUAGENS_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
};
