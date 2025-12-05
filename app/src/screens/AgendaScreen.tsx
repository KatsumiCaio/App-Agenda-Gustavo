import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { ViewSelector } from '../components/ViewSelector';
import { Colors } from '../theme/colors';

export const AgendaScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ViewSelector />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
