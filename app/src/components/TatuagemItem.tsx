import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Tatuagem } from '../types';
import { DateHelper } from '../utils/dateHelper';

interface TatuagemItemProps {
  tatuagem: Tatuagem;
  onPress: (tatuagem: Tatuagem) => void;
}

export const TatuagemItem: React.FC<TatuagemItemProps> = ({ tatuagem, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return '#2196F3';
      case 'concluído':
        return '#4CAF50';
      case 'cancelado':
        return '#f44336';
      default:
        return '#999';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(tatuagem)}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cliente}>{tatuagem.cliente}</Text>
          <Text style={styles.data}>{DateHelper.formatDate(tatuagem.data)} às {tatuagem.horario}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tatuagem.status) }]}>
          <Text style={styles.statusText}>
            {tatuagem.status === 'agendado' ? 'Agendado' : tatuagem.status === 'concluído' ? 'Concluído' : 'Cancelado'}
          </Text>
        </View>
      </View>
      <Text style={styles.descricao} numberOfLines={2}>{tatuagem.descricao}</Text>
      <View style={styles.footer}>
        <Text style={styles.local}>📍 {tatuagem.local}</Text>
        <Text style={styles.valor}>R$ {tatuagem.valor.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cliente: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  data: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  descricao: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  local: {
    fontSize: 12,
    color: '#666',
  },
  valor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
});
