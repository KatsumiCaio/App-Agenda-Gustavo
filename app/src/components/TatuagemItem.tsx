import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Tatuagem } from '../types';
import { DateHelper } from '../utils/dateHelper';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TatuagemItemProps {
  tatuagem: Tatuagem;
  onPress: (tatuagem: Tatuagem) => void;
}

export const TatuagemItem: React.FC<TatuagemItemProps> = ({ tatuagem, onPress }) => {
  const getStatus = () => {
    switch (tatuagem.status) {
      case 'agendado':
        return { color: Colors.primary, text: 'Agendado', icon: 'calendar-clock' };
      case 'concluído':
        return { color: Colors.success, text: 'Concluído', icon: 'check-circle' };
      case 'cancelado':
        return { color: Colors.error, text: 'Cancelado', icon: 'close-circle' };
      default:
        return { color: Colors.textMuted, text: 'Indefinido', icon: 'help-circle' };
    }
  };

  const status = getStatus();

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: status.color }]} 
      onPress={() => onPress(tatuagem)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.cliente}>{tatuagem.cliente}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <MaterialCommunityIcons name={status.icon as any} size={14} color={Colors.textLight} />
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      </View>

      {/* Detalhes */}
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.descricao} numberOfLines={2}>{tatuagem.descricao}</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={14} color={Colors.textMuted} />
            <Text style={styles.infoText}>{DateHelper.formatDate(tatuagem.data)} às {tatuagem.horario}</Text>
          </View>
          
          {tatuagem.local && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{tatuagem.local}</Text>
            </View>
          )}

          {tatuagem.telefone && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{tatuagem.telefone}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.imageContainer}>
          {tatuagem.imagemModelo && (
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Referência</Text>
              <Image source={{ uri: tatuagem.imagemModelo }} style={styles.imagemPreview} />
            </View>
          )}
          {tatuagem.imagemFinal && (
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Finalizada</Text>
              <Image source={{ uri: tatuagem.imagemFinal }} style={styles.imagemPreview} />
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.valorLabel}>Valor</Text>
        <Text style={styles.valor}>R$ {tatuagem.valor.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 5,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cliente: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  descricao: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageWrapper: {
    alignItems: 'center',
    gap: 5,
  },
  imageLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  imagemPreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  valorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  valor: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },
});
