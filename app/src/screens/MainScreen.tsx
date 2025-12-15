import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';

// Usa a tipagem correta do React Navigation, garantindo que só podemos navegar para rotas existentes
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const menuItems = [
    { title: 'Agenda', screen: 'Agenda', icon: 'calendar-month' },
    { title: 'Cadastrar Cliente', screen: 'CadastroCliente', icon: 'account-plus' },
    { title: 'Agendar Trabalho', screen: 'AddTatuagem', icon: 'plus-circle' },
    { title: 'Histórico', screen: 'ListaClientes', icon: 'history' }, // Alterado aqui
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Menu Principal</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)} // Type assertion
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
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
      }
    })
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Shadows.medium,
    elevation: 8,
  },
  cardText: {
    marginTop: 15,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
});

export default MainScreen;
