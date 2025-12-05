import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { TatuagemItem } from '../components/TatuagemItem';
import { Colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HistoricoTrabalhosScreen: React.FC = () => {
  const { tatuagens } = useAgenda();

  // Ordena as tatuagens pela data mais recente
  const sortedTatuagens = [...tatuagens].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedTatuagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TatuagemItem 
            tatuagem={item} 
            onPress={() => {
              // TODO: Implementar navegação para detalhes do trabalho, se necessário
            }} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Histórico Completo</Text>
            <Text style={styles.subtitle}>Todos os seus trabalhos, do mais recente ao mais antigo.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>Nenhum trabalho encontrado</Text>
            <Text style={styles.emptySubtext}>Quando você adicionar novos agendamentos, eles aparecerão aqui.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HistoricoTrabalhosScreen;
