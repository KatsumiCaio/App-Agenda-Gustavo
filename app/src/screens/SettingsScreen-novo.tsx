import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { Colors, Shadows } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const { tatuagens } = useAgenda();

  const stats = {
    total: tatuagens.length,
    agendadas: tatuagens.filter(t => t.status === 'agendado').length,
    concluidas: tatuagens.filter(t => t.status === 'concluído').length,
    canceladas: tatuagens.filter(t => t.status === 'cancelado').length,
  };

  const totalValor = tatuagens.reduce((acc, t) => acc + t.valor, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Estatísticas</Text>
          <Text style={styles.headerSubtitle}>Acompanhe seu desempenho</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={styles.statIcon}>📋</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>

            <View style={[styles.statCard, styles.statCardAgendado]}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>{stats.agendadas}</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>

            <View style={[styles.statCard, styles.statCardConcluido]}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{stats.concluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>

            <View style={[styles.statCard, styles.statCardCancelado]}>
              <Text style={styles.statIcon}>❌</Text>
              <Text style={styles.statValue}>{stats.canceladas}</Text>
              <Text style={styles.statLabel}>Canceladas</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>💰 Faturamento</Text>

          <View style={styles.faturamentoCard}>
            <View style={styles.faturamentoContent}>
              <Text style={styles.faturamentoLabel}>Valor Total</Text>
              <Text style={styles.faturamentoValue}>R$ {totalValor.toFixed(2)}</Text>
              <Text style={styles.faturamentoDesc}>
                De {stats.concluidas} tatuagens concluídas
              </Text>
            </View>
            <View style={styles.faturamentoIcon}>
              <Text style={{ fontSize: 40 }}>💵</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>ℹ️ Sobre o App</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Gustavo Tattoo - Agenda</Text>
            <Text style={styles.infoVersion}>Versão 1.0.0</Text>
            <Text style={styles.infoDescription}>
              App moderno e prático para gerenciar sua agenda de tatuagens com estilo.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>✨ Funcionalidades:</Text>
            <Text style={styles.featureItem}>✓ Visualização diária, semanal e mensal</Text>
            <Text style={styles.featureItem}>✓ Adicionar novos agendamentos</Text>
            <Text style={styles.featureItem}>✓ Gerenciar status das tatuagens</Text>
            <Text style={styles.featureItem}>✓ Acompanhar faturamento</Text>
            <Text style={styles.featureItem}>✓ Armazenamento local de dados</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Desenvolvido com ❤️ para tatuadores profissionais
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    ...Shadows.small,
  },
  statCardTotal: {
    backgroundColor: '#E8F4F8',
  },
  statCardAgendado: {
    backgroundColor: '#FFE8CC',
  },
  statCardConcluido: {
    backgroundColor: '#E8F5E9',
  },
  statCardCancelado: {
    backgroundColor: '#FFEBEE',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  faturamentoCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    ...Shadows.small,
  },
  faturamentoContent: {
    flex: 1,
  },
  faturamentoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  faturamentoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  faturamentoDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  faturamentoIcon: {
    marginLeft: 16,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.small,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    ...Shadows.small,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
});
