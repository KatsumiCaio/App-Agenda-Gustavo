
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation'; // Supondo que a definição do stack esteja aqui
import { Cliente } from '../types';

// O tipo de props de navegação para esta tela
type Props = NativeStackScreenProps<RootStackParamList, 'ListaClientes'>;

const ListaClientesScreen = ({ navigation }: Props) => {
  const { clientes } = useAgenda();

  const handleSelectClient = (cliente: Cliente) => {
    // A navegação será implementada no Passo 2, após a tela de histórico ser modificada
    console.log('Cliente selecionado:', cliente.nome);
    navigation.navigate('HistoricoTrabalhos', { clienteNome: cliente.nome });
  };

  const renderItem = ({ item }: { item: Cliente }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectClient(item)}>
      <Text style={styles.itemText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico por Cliente</Text>
      {clientes.length > 0 ? (
        <FlatList
          data={clientes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fundo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 20,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  itemText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0A0A0',
  },
});

export default ListaClientesScreen;

