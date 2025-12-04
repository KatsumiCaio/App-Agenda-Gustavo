import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';

export const SettingsScreen: React.FC = () => {
  const { tatuagens } = useAgenda();

  const stats = {
    total: tatuagens.length,
    agendadas: tatuagens.filter(t => t.status === 'agendado').length,
    concluidas: tatuagens.filter(t => t.status === 'concluído').length,
    canceladas: tatuagens.filter(t => t.status === 'cancelado').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Estatísticas</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCard1]}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, styles.statCard2]}>
              <Text style={styles.statValue}>{stats.agendadas}</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>
            <View style={[styles.statCard, styles.statCard3]}>
              <Text style={styles.statValue}>{stats.concluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={[styles.statCard, styles.statCard4]}>
              <Text style={styles.statValue}>{stats.canceladas}</Text>
              <Text style={styles.statLabel}>Canceladas</Text>
            </View>
          </View>

          <Text style={[styles.title, styles.titleMargin]}>Sobre o App</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Agenda Tatuador</Text>
            <Text style={styles.infoVersion}>Versão 1.0.0</Text>
            <Text style={styles.infoDescription}>
              Aplicativo simples e prático para gerenciar sua agenda de tatuagens.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Funcionalidades:</Text>
            <Text style={styles.featureItem}>✓ Visualização diária, semanal e mensal</Text>
            <Text style={styles.featureItem}>✓ Adicionar novos agendamentos</Text>
            <Text style={styles.featureItem}>✓ Gerenciar status das tatuagens</Text>
            <Text style={styles.featureItem}>✓ Armazenamento local de dados</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Desenvolvido com ❤️ para tatuadores
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  titleMargin: {
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard1: {
    backgroundColor: '#E3F2FD',
  },
  statCard2: {
    backgroundColor: '#E8F5E9',
  },
  statCard3: {
    backgroundColor: '#FFF3E0',
  },
  statCard4: {
    backgroundColor: '#FFEBEE',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
});
