import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tatuagem, Cliente } from '../types';

const TATUAGENS_KEY = 'tatuagens_data';
const CLIENTES_KEY = 'clientes_data';

export const StorageService = {
  // Funções de Tatuagem
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

  // Funções de Cliente
  async getClientes(): Promise<Cliente[]> {
    try {
      const data = await AsyncStorage.getItem(CLIENTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },

  async saveClientes(clientes: Cliente[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
    } catch (error) {
      console.error('Erro ao salvar clientes:', error);
    }
  },

  async addCliente(cliente: Cliente): Promise<void> {
    const clientes = await this.getClientes();
    clientes.push(cliente);
    await this.saveClientes(clientes);
  },


  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TATUAGENS_KEY);
      await AsyncStorage.removeItem(CLIENTES_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
};
