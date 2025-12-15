import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export const TestScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Teste</Text>
      <Button title="Alerta de Teste" onPress={() => alert('O alerta da tela de teste funciona!')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc107',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TestScreen;
