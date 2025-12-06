import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { maskPhoneNumber } from '../utils/formatHelper';

import { useAgenda } from '../contexts/AgendaContext';

// ...

const CadastroClienteScreen: React.FC = () => {
  const { addCliente } = useAgenda();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSaveCliente = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('❌ Erro', 'Nome e Telefone são obrigatórios.');
      return;
    }
    
    try {
      await addCliente({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim() || undefined,
        instagram: instagram.trim() || undefined,
      });

      // Limpa os campos imediatamente após o sucesso
      setNome('');
      setTelefone('');
      setEmail('');
      setInstagram('');

      // Exibe a mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Esconde a mensagem após 3 segundos

    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Alert.alert('❌ Erro', 'Não foi possível salvar o cliente.');
    }
  };

//...

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Novo Cliente</Text>
          <Text style={styles.subtitle}>Adicione um novo cliente à sua lista.</Text>

          {showSuccessMessage && (
            <View style={styles.successMessageContainer}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.success} />
              <Text style={styles.successMessageText}>Cliente cadastrado com sucesso!</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do cliente"
                value={nome}
                onChangeText={setNome}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone-outline" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                value={telefone}
                onChangeText={(text) => setTelefone(maskPhoneNumber(text))}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textMuted}
                maxLength={15}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="cliente@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="instagram" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="@usuario"
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSaveCliente}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Salvar Cliente</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
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
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    ...Shadows.medium,
  },
  submitButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
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
});

export default CadastroClienteScreen;
