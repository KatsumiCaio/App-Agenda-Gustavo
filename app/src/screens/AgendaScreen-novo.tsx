import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { ViewSelector } from '../components/ViewSelector';
import { DateHelper } from '../utils/dateHelper';
import { Colors, Shadows } from '../theme/colors';

export const AgendaScreen: React.FC = () => {
  const { loadTatuagens, getTatuagensForDate } = useAgenda();
  const [totalHoje, setTotalHoje] = useState(0);

  useEffect(() => {
    loadTatuagens();
    const hoje = getTatuagensForDate(new Date());
    setTotalHoje(hoje.length);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minha Agenda</Text>
          <Text style={styles.subtitle}>Hoje - {DateHelper.formatDate(new Date())}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalHoje}</Text>
        </View>
      </View>

      <ViewSelector />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textLight,
  },
});
