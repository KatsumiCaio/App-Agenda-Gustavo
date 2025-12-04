import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Nav = {
  navigate: (value: string) => void;
}

const MainScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const menuItems = [
    { title: 'Agenda', screen: 'Agenda', icon: 'calendar-month' },
    { title: 'Cadastrar Cliente', screen: 'CadastroCliente', icon: 'account-plus' },
    { title: 'Agendar Trabalho', screen: 'AddTatuagem', icon: 'plus-circle' },
    { title: 'Histórico de Trabalhos', screen: 'HistoricoTrabalhos', icon: 'history' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Menu Principal</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <MaterialCommunityIcons name={item.icon as any} size={48} color={Colors.primary} />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  cardText: {
    marginTop: 15,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MainScreen;
