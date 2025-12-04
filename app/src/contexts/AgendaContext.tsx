import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tatuagem } from '../types';
import { StorageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface AgendaContextType {
  tatuagens: Tatuagem[];
  addTatuagem: (tatuagem: Omit<Tatuagem, 'id'>) => Promise<void>;
  updateTatuagem: (id: string, updates: Partial<Tatuagem>) => Promise<void>;
  deleteTatuagem: (id: string) => Promise<void>;
  loadTatuagens: () => Promise<void>;
  getTatuagensForDate: (date: Date) => Tatuagem[];
  getTatuagensForWeek: (date: Date) => Tatuagem[];
  getTatuagensForMonth: (date: Date) => Tatuagem[];
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export const AgendaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tatuagens, setTatuagens] = useState<Tatuagem[]>([]);

  const loadTatuagens = async () => {
    const data = await StorageService.getTatuagens();
    setTatuagens(data);
  };

  const addTatuagem = async (tatuagem: Omit<Tatuagem, 'id'>) => {
    const newTatuagem: Tatuagem = {
      ...tatuagem,
      id: uuidv4(),
    };
    await StorageService.addTatuagem(newTatuagem);
    setTatuagens([...tatuagens, newTatuagem]);
  };

  const updateTatuagem = async (id: string, updates: Partial<Tatuagem>) => {
    await StorageService.updateTatuagem(id, updates);
    setTatuagens(
      tatuagens.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTatuagem = async (id: string) => {
    await StorageService.deleteTatuagem(id);
    setTatuagens(tatuagens.filter(t => t.id !== id));
  };

  const getTatuagensForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tatuagens.filter(t => t.data === dateStr && t.status === 'agendado');
  };

  const getTatuagensForWeek = (date: Date) => {
    const currentDate = new Date(date);
    const firstDay = new Date(currentDate);
    firstDay.setDate(currentDate.getDate() - currentDate.getDay());
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);

    return tatuagens.filter(t => {
      const tatuagemDate = new Date(t.data);
      return tatuagemDate >= firstDay && tatuagemDate <= lastDay && t.status === 'agendado';
    });
  };

  const getTatuagensForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return tatuagens.filter(t => {
      const tatuagemDate = new Date(t.data);
      return tatuagemDate.getFullYear() === year && tatuagemDate.getMonth() === month && t.status === 'agendado';
    });
  };

  return (
    <AgendaContext.Provider
      value={{
        tatuagens,
        addTatuagem,
        updateTatuagem,
        deleteTatuagem,
        loadTatuagens,
        getTatuagensForDate,
        getTatuagensForWeek,
        getTatuagensForMonth,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};

export const useAgenda = () => {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda deve ser usado dentro de AgendaProvider');
  }
  return context;
};
