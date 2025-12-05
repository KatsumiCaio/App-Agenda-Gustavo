import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tatuagem, Cliente } from '../types';
import { StorageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface AgendaContextType {
  tatuagens: Tatuagem[];
  clientes: Cliente[];
  addTatuagem: (tatuagem: Omit<Tatuagem, 'id'>) => Promise<void>;
  updateTatuagem: (id: string, updates: Partial<Tatuagem>) => Promise<void>;
  deleteTatuagem: (id: string) => Promise<void>;
  loadTatuagens: () => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  clearAllData: () => Promise<void>;
  getTatuagensForDate: (date: Date) => Tatuagem[];
  getTatuagensForWeek: (date: Date) => Tatuagem[];
  getTatuagensForMonth: (date: Date) => Tatuagem[];
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export const AgendaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tatuagens, setTatuagens] = useState<Tatuagem[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const initialize = async () => {
      await StorageService.clearAll();
      await loadAllData();
    };
    initialize();
  }, []);

  const loadAllData = async () => {
    await loadTatuagens();
    await loadClientes();
  };

  const loadTatuagens = async () => {
    const data = await StorageService.getTatuagens();
    setTatuagens(data);
  };
  
  const loadClientes = async () => {
    const data = await StorageService.getClientes();
    setClientes(data);
  };

  const addTatuagem = async (tatuagem: Omit<Tatuagem, 'id'>) => {
    const newTatuagem: Tatuagem = {
      ...tatuagem,
      id: uuidv4(),
    };
    const newTatuagens = [...tatuagens, newTatuagem];
    setTatuagens(newTatuagens);
    await StorageService.saveTatuagens(newTatuagens);
  };

  const addCliente = async (cliente: Omit<Cliente, 'id'>) => {
    const newCliente: Cliente = {
      ...cliente,
      id: uuidv4(),
    };
    const newClientes = [...clientes, newCliente];
    setClientes(newClientes);
    await StorageService.saveClientes(newClientes);
  };

  const updateTatuagem = async (id: string, updates: Partial<Tatuagem>) => {
    const newTatuagens = tatuagens.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTatuagens(newTatuagens);
    await StorageService.saveTatuagens(newTatuagens);
  };

  const deleteTatuagem = async (id: string) => {
    const newTatuagens = tatuagens.filter(t => t.id !== id);
    setTatuagens(newTatuagens);
    await StorageService.saveTatuagens(newTatuagens);
  };

  const clearAllData = async () => {
    await StorageService.clearAll();
    setTatuagens([]);
    setClientes([]);
  };

  const getTatuagensForDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }
    const dateStr = date.toISOString().split('T')[0];
    return tatuagens.filter(t => t.data === dateStr && t.status === 'agendado');
  };

  const getTatuagensForWeek = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }
    const currentDate = new Date(date);
    const firstDay = new Date(currentDate);
    firstDay.setHours(0, 0, 0, 0);
    firstDay.setDate(currentDate.getDate() - currentDate.getDay());
    
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    return tatuagens.filter(t => {
      const [year, month, day] = t.data.split('-').map(Number);
      const tatuagemDate = new Date(year, month - 1, day);
      return tatuagemDate >= firstDay && tatuagemDate <= lastDay && t.status === 'agendado';
    });
  };

  const getTatuagensForMonth = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    return tatuagens.filter(t => {
      const [tatuagemYear, tatuagemMonth] = t.data.split('-').map(Number);
      return tatuagemYear === year && (tatuagemMonth - 1) === month && t.status === 'agendado';
    });
  };

  return (
    <AgendaContext.Provider
      value={{
        tatuagens,
        clientes,
        addTatuagem,
        updateTatuagem,
        deleteTatuagem,
        loadTatuagens,
        addCliente,
        clearAllData,
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
