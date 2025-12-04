import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

const HistoricoTrabalhosScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Histórico de Trabalhos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.text,
    fontSize: 18,
  },
});

export default HistoricoTrabalhosScreen;
