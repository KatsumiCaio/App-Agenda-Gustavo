import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, SafeAreaView, Modal, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgenda } from '../contexts/AgendaContext';
import { format } from 'date-fns';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Cliente } from '../types';
import WebDatePicker from '../components/WebDatePicker';
import WebTimePicker from '../components/WebTimePicker';

type Nav = {
  navigate: (value: string) => void;
}

export const AddTatuagemScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { addTatuagem, clientes } = useAgenda();

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const [descricao, setDescricao] = useState('');
  const [date, setDate] = useState(new Date());
  const [horario, setHorario] = useState('10:00');
  const [local, setLocal] = useState('');
  const [valor, setValor] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleAddTatuagem = async () => {
    if (!selectedCliente || !descricao.trim() || !date || !horario || !valor) {
      Alert.alert('❌ Erro', 'Preencha todos os campos obrigatórios, incluindo a seleção do cliente.');
      return;
    }

    try {
      await addTatuagem({
        cliente: selectedCliente.nome,
        descricao: descricao.trim(),
        data: format(date, 'yyyy-MM-dd'),
        horario,
        local: local.trim() || 'Não especificado',
        valor: parseFloat(valor),
        status: 'agendado',
        telefone: selectedCliente.telefone || undefined,
        observacoes: observacoes.trim() || undefined,
      });

      Alert.alert('✅ Sucesso', 'Tatuagem agendada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCliente(null);
            setDescricao('');
            setDate(new Date());
            setHorario('10:00');
            setLocal('');
            setValor('');
            setObservacoes('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('❌ Erro', 'Falha ao agendar tatuagem');
    }
  };

  const onClientSelect = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Seleção de Cliente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Cliente</Text>
            <FlatList
              data={clientes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.clientItem} onPress={() => onClientSelect(item)}>
                  <Text style={styles.clientName}>{item.nome}</Text>
                  <Text style={styles.clientPhone}>{item.telefone}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum cliente cadastrado.</Text>}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Informações do Cliente</Text>
            <TouchableOpacity style={styles.newClientButton} onPress={() => navigation.navigate('CadastroCliente')}>
              <MaterialCommunityIcons name="account-plus-outline" size={16} color={Colors.primary} />
              <Text style={styles.newClientButtonText}>Novo Cliente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente *</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="account-outline" style={styles.inputIcon} />
              <Text style={[styles.input, !selectedCliente && styles.placeholderText]}>
                {selectedCliente ? selectedCliente.nome : 'Selecione um cliente'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>🎨 Detalhes da Tatuagem</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <MaterialCommunityIcons name="pencil-outline" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textAreaInput]}
                placeholder="Descrição da tatuagem desejada"
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local no Corpo</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="map-marker-outline" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Braço, Costas, Perna"
                value={local}
                onChangeText={setLocal}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="cash" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>📅 Agendamento</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            {Platform.OS === 'web' ? (
              <WebDatePicker date={date} setDate={setDate} />
            ) : (
              <TouchableOpacity style={styles.inputContainer} onPress={() => { /* lógica para nativo aqui */ }}>
                <MaterialCommunityIcons name="calendar" style={styles.inputIcon} />
                <Text style={styles.input}>
                  {format(date, 'dd/MM/yyyy')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário *</Text>
            {Platform.OS === 'web' ? (
              <WebTimePicker horario={horario} setHorario={setHorario} />
            ) : (
              <TouchableOpacity style={styles.inputContainer} onPress={() => { /* lógica para nativo aqui */ }}>
                <MaterialCommunityIcons name="clock-outline" style={styles.inputIcon} />
                <Text style={styles.input}>
                  {horario}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <MaterialCommunityIcons name="comment-text-outline" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textAreaInput]}
                placeholder="Observações adicionais"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleAddTatuagem}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>✨ Agendar Tatuagem</Text>
          </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
  },
  newClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  newClientButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    minHeight: 50,
  },
  inputIcon: {
    fontSize: 20,
    color: Colors.textMuted,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 15,
    color: Colors.textLight,
    fontWeight: '500',
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
    ...Shadows.medium,
  },
  submitButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  clientItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  clientName: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '600',
  },
  clientPhone: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  emptyListText: {
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  closeButtonText: {
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

