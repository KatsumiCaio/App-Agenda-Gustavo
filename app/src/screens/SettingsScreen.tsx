import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgenda } from '../contexts/AgendaContext';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Nav = {
  navigate: (value: string) => void;
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { tatuagens } = useAgenda();

  const stats = {
    total: tatuagens.length,
    agendadas: tatuagens.filter(t => t.status === 'agendado').length,
    concluidas: tatuagens.filter(t => t.status === 'concluído').length,
    canceladas: tatuagens.filter(t => t.status === 'cancelado').length,
  };

  const totalValorConcluido = tatuagens
    .filter(t => t.status === 'concluído')
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>

          {/* ... Resumo Geral cards */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderTopColor: Colors.accent }]}>
              <Text style={styles.statIcon}>📋</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total de Trabalhos</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.primary }]}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>{stats.agendadas}</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.success }]}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{stats.concluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.error }]}>
              <Text style={styles.statIcon}>❌</Text>
              <Text style={styles.statValue}>{stats.canceladas}</Text>
              <Text style={styles.statLabel}>Canceladas</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>💰 Faturamento</Text>

          <View style={styles.faturamentoCard}>
            <View style={styles.faturamentoContent}>
              <Text style={styles.faturamentoLabel}>Faturamento Concluído</Text>
              <Text style={styles.faturamentoValue}>R$ {totalValorConcluido.toFixed(2)}</Text>
              <Text style={styles.faturamentoDesc}>
                Baseado em {stats.concluidas} tatuagens concluídas
              </Text>
            </View>
            <View style={styles.faturamentoIcon}>
              <Text style={{ fontSize: 40 }}>💵</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>⚙️ Ações</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('HistoricoTrabalhos')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="history" style={styles.actionIcon} />
            <View>
              <Text style={styles.actionLabel}>Histórico de Trabalhos</Text>
              <Text style={styles.actionSublabel}>Visualize todos os seus trabalhos passados</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" style={styles.actionChevron} />
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>ℹ️ Sobre o App</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Gustavo Tattoo - Agenda</Text>
            <Text style={styles.infoVersion}>Versão 1.0.0</Text>
            <Text style={styles.infoDescription}>
              App moderno e prático para gerenciar sua agenda de tatuagens com estilo.
            </Text>
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
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    ...Shadows.medium,
    borderTopWidth: 4,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  faturamentoCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.large,
    borderLeftWidth: 5,
    borderLeftColor: Colors.accent,
  },
  faturamentoContent: {
    flex: 1,
  },
  faturamentoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  faturamentoValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 6,
  },
  faturamentoDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  faturamentoIcon: {
    marginLeft: 16,
  },
  actionCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.medium,
  },
  actionIcon: {
    fontSize: 24,
    color: Colors.primary,
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  actionSublabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionChevron: {
    fontSize: 24,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  infoCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    ...Shadows.medium,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundLight,
    marginVertical: 30,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
});


