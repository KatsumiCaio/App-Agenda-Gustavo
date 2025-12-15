import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, SafeAreaView, Modal, FlatList, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgenda } from '../contexts/AgendaContext';
import { format } from 'date-fns';
import { Colors, Shadows } from '../theme/colors';
import { Layout } from '../theme/layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Cliente } from '../types';
import WebDatePicker from '../components/WebDatePicker';
import WebTimePicker from '../components/WebTimePicker';
import { saveImagePermanently } from '../utils/fileHelper';
import * as ImagePicker from 'expo-image-picker';

import { saveTatuagemCloud } from '../services/firebase';

type Nav = {
  navigate: (value: string) => void;
}

export const AddTatuagemScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { clientes } = useAgenda();

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const [descricao, setDescricao] = useState('');
  const [date, setDate] = useState(new Date());
  const [horario, setHorario] = useState('10:00');
  const [local, setLocal] = useState('');
  const [valor, setValor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [observacoes, setObservacoes] = useState('');
  const [imagemModelo, setImagemModelo] = useState<string | null>(null); // Novo estado para a imagem
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Função para selecionar imagem
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma imagem.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const permanentUri = await saveImagePermanently(result.assets[0].uri);
        setImagemModelo(permanentUri);
      } catch (error) {
        Alert.alert('Erro ao Salvar Imagem', 'Ocorreu um erro ao tentar salvar a imagem permanentemente.');
      }
    }
  };


  const handleAddTatuagem = async () => {
    const newErrors: Record<string, string> = {};
    if (!selectedCliente) newErrors.cliente = 'Selecione um cliente';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!date) newErrors.data = 'Data inválida';
    if (!horario) newErrors.horario = 'Horário inválido';
    if (!valor || isNaN(parseFloat(valor))) newErrors.valor = 'Valor inválido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await saveTatuagemCloud({
        cliente: selectedCliente.nome,
        descricao: descricao.trim(),
        data: format(date, 'yyyy-MM-dd'),
        horario,
        local: local.trim() || 'Não especificado',
        valor: parseFloat(valor),
        status: 'agendado',
        telefone: selectedCliente.telefone || undefined,
        observacoes: observacoes.trim() || undefined,
        imagemModelo: imagemModelo || undefined, // Adiciona a imagem
      });

      // Limpa os campos imediatamente após o sucesso
      setSelectedCliente(null);
      setDescricao('');
      setDate(new Date());
      setHorario('10:00');
      setLocal('');
      setValor('');
      setObservacoes('');
      setImagemModelo(null); // Limpa a imagem

      // Exibe a mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Esconde a mensagem após 3 segundos

    } catch (error) {
      Alert.alert('❌ Erro', 'Falha ao agendar tatuagem na nuvem.');
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
          {showSuccessMessage && (
            <View style={styles.successMessageContainer}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.successMessageText}>Tatuagem agendada com sucesso!</Text>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Informações do Cliente</Text>
            <TouchableOpacity style={styles.newClientButton} onPress={() => navigation.navigate('CadastroCliente')}>
              <MaterialCommunityIcons name="account-plus-outline" size={16} color={Colors.primary} />
              <Text style={styles.newClientButtonText}>Novo Cliente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente *</Text>
            <TouchableOpacity style={[styles.inputContainer, errors.cliente && styles.inputError]} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="account-outline" style={styles.inputIcon} />
              <Text style={[styles.input, !selectedCliente && styles.placeholderText]}>
                {selectedCliente ? selectedCliente.nome : 'Selecione um cliente'}
              </Text>
            </TouchableOpacity>
            {errors.cliente && <Text style={styles.errorText}>{errors.cliente}</Text>}
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>🎨 Detalhes da Tatuagem</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer, errors.descricao && styles.inputError]}>
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
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
          </View>

          {/* Botão de Imagem e Preview */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Imagem de Referência</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <MaterialCommunityIcons name="camera-plus-outline" size={20} color={Colors.primary} />
              <Text style={styles.imagePickerButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>
            {imagemModelo && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imagemModelo }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setImagemModelo(null)}>
                  <MaterialCommunityIcons name="close-circle" size={24} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            )}
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
            <View style={[styles.inputContainer, errors.valor && styles.inputError]}>
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
            {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>📅 Agendamento</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            {Platform.OS === 'web' ? (
              <WebDatePicker date={date} setDate={setDate} />
            ) : (
              <TouchableOpacity style={[styles.inputContainer, errors.data && styles.inputError]} onPress={() => { /* lógica para nativo aqui */ }}>
                <MaterialCommunityIcons name="calendar" style={styles.inputIcon} />
                <Text style={styles.input}>
                  {format(date, 'dd/MM/yyyy')}
                </Text>
              </TouchableOpacity>
            )}
            {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário *</Text>
            {Platform.OS === 'web' ? (
              <WebTimePicker horario={horario} setHorario={setHorario} />
            ) : (
              <TouchableOpacity style={[styles.inputContainer, errors.horario && styles.inputError]} onPress={() => { /* lógica para nativo aqui */ }}>
                <MaterialCommunityIcons name="clock-outline" style={styles.inputIcon} />
                <Text style={styles.input}>
                  {horario}
                </Text>
              </TouchableOpacity>
            )}
            {errors.horario && <Text style={styles.errorText}>{errors.horario}</Text>}
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
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imagePickerButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: 220,
    height: 220,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 2,
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
  successMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight, // Usar uma cor de sucesso clara
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  successMessageText: {
    color: Colors.success, // Usar uma cor de sucesso para o texto
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: Colors.error,
    marginTop: 6,
    fontSize: 13,
  },
});

