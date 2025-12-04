import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, SafeAreaView } from 'react-native';
import { useAgenda } from '../contexts/AgendaContext';
import { DateHelper } from '../utils/dateHelper';
import { Colors, Shadows } from '../theme/colors';

export const AddTatuagemScreen: React.FC = () => {
  const { addTatuagem } = useAgenda();
  const [cliente, setCliente] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(DateHelper.getTodayString());
  const [horario, setHorario] = useState('10:00');
  const [local, setLocal] = useState('');
  const [valor, setValor] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleAddTatuagem = async () => {
    if (!cliente.trim() || !descricao.trim() || !data || !horario || !valor) {
      Alert.alert('❌ Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await addTatuagem({
        cliente: cliente.trim(),
        descricao: descricao.trim(),
        data,
        horario,
        local: local.trim() || 'Não especificado',
        valor: parseFloat(valor),
        status: 'agendado',
        telefone: telefone.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
      });

      Alert.alert('✅ Sucesso', 'Tatuagem agendada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setCliente('');
            setDescricao('');
            setData(DateHelper.getTodayString());
            setHorario('10:00');
            setLocal('');
            setValor('');
            setTelefone('');
            setObservacoes('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('❌ Erro', 'Falha ao agendar tatuagem');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Novo Agendamento</Text>
          <Text style={styles.headerSubtitle}>Preencha os dados abaixo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>👤 Informações do Cliente</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Cliente *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do cliente"
              value={cliente}
              onChangeText={setCliente}
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>🎨 Detalhes da Tatuagem</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local no Corpo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Braço, Costas, Perna"
              value={local}
              onChangeText={setLocal}
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>📅 Agendamento</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={data}
              onChangeText={setData}
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              value={horario}
              onChangeText={setHorario}
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
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
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionTitleMargin: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: Colors.text,
    fontWeight: '500',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    paddingVertical: 12,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    ...Shadows.medium,
  },
  submitButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
