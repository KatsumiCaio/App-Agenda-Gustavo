import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { ViewSelector } from '../components/ViewSelector';

export const AgendaScreen: React.FC = () => {
  const { loadTatuagens } = useAgenda();

  useEffect(() => {
    loadTatuagens();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ViewSelector />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
