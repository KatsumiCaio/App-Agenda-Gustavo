import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Tatuagem } from '../types';
import { Colors, Shadows } from '../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EditTatuagemPanelProps {
  visible: boolean;
  onClose: () => void;
  tatuagem: Tatuagem | null;
  onSave: (tatuagem: Tatuagem) => void;
}

const EditTatuagemPanel: React.FC<EditTatuagemPanelProps> = ({ visible, onClose, tatuagem, onSave }) => {
  const [editedTatuagem, setEditedTatuagem] = useState<Tatuagem | null>(null);

  useEffect(() => {
    setEditedTatuagem(tatuagem);
  }, [tatuagem]);

  const pickImage = async () => {
    // Pedir permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar suas fotos!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && editedTatuagem) {
      setEditedTatuagem({ ...editedTatuagem, imagem: result.assets[0].uri });
    }
  };
  
  const removeImage = () => {
    if (editedTatuagem) {
      setEditedTatuagem({ ...editedTatuagem, imagem: undefined });
    }
  };

  if (!editedTatuagem) {
    return null;
  }

  const handleSave = () => {
    if (editedTatuagem) {
      onSave(editedTatuagem);
    }
  };

  const getStatusStyle = (status: Tatuagem['status']) => {
    switch (status) {
      case 'agendado':
        return { backgroundColor: Colors.primary, color: Colors.textLight };
      case 'concluído':
        return { backgroundColor: Colors.success, color: Colors.textLight };
      case 'cancelado':
        return { backgroundColor: Colors.error, color: Colors.textLight };
      default:
        return { backgroundColor: Colors.background, color: Colors.textMuted };
    }
  };

  const renderStatusSelector = () => {
    const statuses: Tatuagem['status'][] = ['agendado', 'concluído', 'cancelado'];
    return (
      <View style={styles.statusContainer}>
        {statuses.map((status) => {
          const isSelected = editedTatuagem.status === status;
          const statusColors = getStatusStyle(status);

          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { 
                  backgroundColor: isSelected ? statusColors.backgroundColor : 'transparent',
                  borderColor: statusColors.backgroundColor,
                }
              ]}
              onPress={() => setEditedTatuagem({ ...editedTatuagem, status })}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  { color: isSelected ? statusColors.color : statusColors.backgroundColor },
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalText}>Editar Agendamento</Text>
            
            {/* Campos de texto */}
            <TextInput style={styles.input} value={editedTatuagem.cliente} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, cliente: text })} placeholder="Cliente" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.descricao} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, descricao: text })} placeholder="Descrição" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.valor.toString()} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, valor: parseFloat(text) || 0 })} placeholder="Valor" keyboardType="numeric" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.data} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, data: text })} placeholder="Data" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.horario} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, horario: text })} placeholder="Horário" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.local} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, local: text })} placeholder="Local" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={styles.input} value={editedTatuagem.telefone} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, telefone: text })} placeholder="Telefone" placeholderTextColor={Colors.textMuted}/>
            <TextInput style={[styles.input, { height: 80 }]} value={editedTatuagem.observacoes} onChangeText={(text) => setEditedTatuagem({ ...editedTatuagem, observacoes: text })} placeholder="Observações" multiline placeholderTextColor={Colors.textMuted}/>

            {renderStatusSelector()}

            {/* Seletor de Imagem */}
            {editedTatuagem.status === 'concluído' && (
              <View style={styles.imagePickerContainer}>
                <Text style={styles.imagePickerLabel}>Foto da Tatuagem</Text>
                {editedTatuagem.imagem ? (
                  <View>
                    <Image source={{ uri: editedTatuagem.imagem }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                        <MaterialCommunityIcons name="close-circle" size={24} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={22} color={Colors.primary} />
                    <Text style={styles.pickImageButtonText}>Adicionar Foto</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Botões de Ação */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.actionButton, styles.closeButton]} onPress={onClose}>
                <Text style={styles.actionButtonText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.actionButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalView: { margin: 20, backgroundColor: Colors.backgroundLight, borderRadius: 12, padding: 20, width: '90%', maxHeight: '85%', ...Shadows.large, borderWidth: 1, borderColor: Colors.border },
  scrollViewContent: { paddingBottom: 20 },
  modalText: { marginBottom: 24, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.textLight },
  input: { width: '100%', height: 50, backgroundColor: Colors.background, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 15, color: Colors.textLight, fontSize: 16 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 20 },
  statusButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1 },
  statusButtonText: { fontWeight: 'bold', fontSize: 12 },
  imagePickerContainer: { width: '100%', alignItems: 'center', marginVertical: 20, padding: 15, backgroundColor: Colors.background, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  imagePickerLabel: { fontSize: 16, fontWeight: '600', color: Colors.textLight, marginBottom: 15 },
  pickImageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  pickImageButtonText: { color: Colors.primary, marginLeft: 10, fontWeight: 'bold' },
  imagePreview: { width: 150, height: 150, borderRadius: 8, marginBottom: 10 },
  removeImageButton: { position: 'absolute', top: -10, right: -10, backgroundColor: Colors.backgroundLight, borderRadius: 12 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  actionButton: { borderRadius: 8, paddingVertical: 14, flex: 1, alignItems: 'center', ...Shadows.small },
  actionButtonText: { color: Colors.textLight, fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: Colors.primary, marginLeft: 10 },
  closeButton: { backgroundColor: Colors.textMuted }
});

export default EditTatuagemPanel;
