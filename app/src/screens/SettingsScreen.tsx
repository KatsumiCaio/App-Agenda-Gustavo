import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteAllImages } from '../utils/fileHelper';
import { useAgenda } from '../contexts/AgendaContext';
import { StorageService } from '../services/storage';
import { uploadImageForShared, saveTatuagemShared, saveClientesShared, getTatuagensShared, getClientesShared } from '../services/firebase';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Nav = {
  navigate: (value: string) => void;
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { tatuagens, clearAllData, reloadData } = useAgenda();

  /*
  const stats = {
    total: tatuagens.length,
    agendadas: tatuagens.filter(t => t.status === 'agendado').length,
    concluidas: tatuagens.filter(t => t.status === 'concluído').length,
    canceladas: tatuagens.filter(t => t.status === 'cancelado').length,
  };
  */

  const [syncKey, setSyncKey] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{ current: number; total: number; item?: string } | null>(null);

  /*
  const totalValorConcluido = tatuagens
    .filter(t => t.status === 'concluído')
    .reduce((acc, t) => acc + t.valor, 0);
  */

  const handleClearData = () => {
    console.log('handleClearData called');
    const message = 'Você tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.';

    if (Platform.OS === 'web') {
      const ok = window.confirm(message);
      if (!ok) return;
      (async () => {
        setIsClearing(true);
        try {
          await clearAllData();
          await deleteAllImages();
          await reloadData();
          window.alert('Sucesso: Todos os dados e imagens foram apagados.');
        } catch (err) {
          console.error('Erro ao limpar dados:', err);
          window.alert('Erro ao apagar dados. Veja o console para detalhes.');
        } finally {
          setIsClearing(false);
        }
      })();
      return;
    }

    Alert.alert(
      'Confirmar Ação',
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearAllData();
              await deleteAllImages();
              await reloadData();
              Alert.alert('Sucesso', 'Todos os dados e imagens foram apagados.');
            } catch (err) {
              console.error('Erro ao limpar dados:', err);
              Alert.alert('Erro', 'Falha ao apagar dados. Veja o console para detalhes.');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const handleUploadToCloud = async () => {
    if (!syncKey) {
      Alert.alert('Sync Key', 'Informe a Sync Key antes de enviar.');
      return;
    }
    setIsSyncing(true);
    try {
      const localTatuagens = await StorageService.getTatuagens();
      const localClientes = await StorageService.getClientes();

      // Upload clients (no progress tracking for clients)
      await saveClientesShared(syncKey, localClientes || []);

      // Upload tatuagens (com upload de imagens se necessário)
      setUploadProgress({ current: 0, total: localTatuagens.length });
      for (let i = 0; i < localTatuagens.length; i++) {
        const t = localTatuagens[i];
        const copy = { ...t } as any;
        setUploadProgress({ current: i + 1, total: localTatuagens.length, item: copy.id || copy.descricao || 'item' });
        if (copy.imagemModelo && !copy.imagemModelo.startsWith('http')) {
          try {
            copy.imagemModelo = await uploadImageForShared(copy.imagemModelo, syncKey);
          } catch (e) {
            console.warn('Falha upload imagem modelo', e);
          }
        }
        if (copy.imagemFinal && !copy.imagemFinal.startsWith('http')) {
          try {
            copy.imagemFinal = await uploadImageForShared(copy.imagemFinal, syncKey);
          } catch (e) {
            console.warn('Falha upload imagem final', e);
          }
        }
        await saveTatuagemShared(syncKey, copy);
      }
      setUploadProgress(null);
      Alert.alert('Sucesso', 'Dados enviados para a nuvem com sucesso.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao enviar dados para a nuvem. Veja console.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadFromCloud = async () => {
    if (!syncKey) {
      Alert.alert('Sync Key', 'Informe a Sync Key antes de baixar.');
      return;
    }

    Alert.alert('Confirmar', 'Deseja substituir os dados locais pelos dados da nuvem?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Substituir', style: 'destructive', onPress: async () => {
        setIsSyncing(true);
        try {
          const cloudTatuagens = await getTatuagensShared(syncKey);
          const cloudClientes = await getClientesShared(syncKey);

          // Salva diretamente no storage local. Imagens já estarão em URLs públicas.
          await StorageService.saveTatuagens(cloudTatuagens.map(c => ({ ...c })));
          await StorageService.saveClientes(cloudClientes.map(c => ({ ...c })));
          // Forçar recarga via contexto
          try { await reloadData(); } catch (e) { console.warn('reloadData falhou', e); }
          Alert.alert('Sucesso', 'Dados baixados e salvos localmente.');
        } catch (err) {
          console.error(err);
          Alert.alert('Erro', 'Falha ao baixar dados da nuvem.');
        } finally {
          setIsSyncing(false);
        }
      }}
    ]);
  };

  const handleMergeFromCloud = async () => {
    if (!syncKey) {
      Alert.alert('Sync Key', 'Informe a Sync Key antes de mesclar.');
      return;
    }
    setIsSyncing(true);
    try {
      const cloudTatuagens = await getTatuagensShared(syncKey);
      const localTatuagens = await StorageService.getTatuagens();
      const merged = [...localTatuagens];
      const existingIds = new Set(localTatuagens.map(t => t.id));
      for (const ct of cloudTatuagens) {
        if (!existingIds.has(ct.id)) {
          merged.push(ct as any);
        }
      }
      await StorageService.saveTatuagens(merged);
      try { await reloadData(); } catch (e) { console.warn('reloadData falhou', e); }
      Alert.alert('Sucesso', 'Dados mesclados (apenas novos registros adicionados).');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao mesclar dados da nuvem.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>

          {/* As a a substitute for the stats object, I will render a placeholder */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderTopColor: Colors.accent }]}>
              <Text style={styles.statIcon}>📋</Text>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Total de Trabalhos</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.primary }]}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.success }]}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: Colors.error }]}>
              <Text style={styles.statIcon}>❌</Text>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Canceladas</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>💰 Faturamento</Text>

          {/* As a substitute for the totalValorConcluido, I will render a placeholder */}
          <View style={styles.faturamentoCard}>
            <View style={styles.faturamentoContent}>
              <Text style={styles.faturamentoLabel}>Faturamento Concluído</Text>
              <Text style={styles.faturamentoValue}>R$ --.--</Text>
              <Text style={styles.faturamentoDesc}>
                Baseado em - tatuagens concluídas
              </Text>
            </View>
            <View style={styles.faturamentoIcon}>
              <Text style={{ fontSize: 40 }}>💵</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>⚙️ Ações</Text>

          <TouchableOpacity
            style={[styles.actionCard, { marginBottom: 16 }]}
            onPress={handleClearData}
            disabled={isClearing || isSyncing}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="trash-can-outline" style={[styles.actionIcon, { color: Colors.error }]} />
            <View>
              <Text style={styles.actionLabel}>Limpar Dados</Text>
              <Text style={styles.actionSublabel}>Apaga todos os registros de tatuagens e clientes</Text>
            </View>
            {isClearing ? (
              <ActivityIndicator style={styles.actionChevron} color={Colors.error} />
            ) : (
              <MaterialCommunityIcons name="chevron-right" style={styles.actionChevron} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('HistoricoTrabalhos')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="history" style={styles.actionIcon} />
            <View>
              <Text style={styles.actionLabel}>Histórico de Trabalhos</Text>
              <Text style={styles.actionSublabel}>Visualize todos os seus trabalhos passados</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" style={styles.actionChevron} />
          </TouchableOpacity>

          <View style={[styles.syncCard, { marginTop: 16 }]}> 
            <Text style={styles.syncTitle}>🔁 Sincronização (com imagens)</Text>
            <Text style={styles.syncHelp}>Informe uma Sync Key compartilhada entre aparelhos.</Text>
            <TextInput
              value={syncKey}
              onChangeText={setSyncKey}
              placeholder="ex: minha-chave-secreta"
              placeholderTextColor={Colors.textMuted}
              style={styles.syncInput}
            />

            <View style={styles.syncButtonsRow}>
              <TouchableOpacity style={styles.syncButton} onPress={handleUploadToCloud} disabled={isSyncing}>
                {isSyncing ? <ActivityIndicator color="white" /> : (
                  <View style={styles.syncButtonContent}>
                    <MaterialCommunityIcons name="cloud-upload-outline" size={18} color="white" />
                    <Text style={styles.syncButtonText}>Enviar para Nuvem</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.syncButton, { backgroundColor: Colors.backgroundLight }]} onPress={handleMergeFromCloud} disabled={isSyncing}>
                <View style={styles.syncButtonContent}>
                  <MaterialCommunityIcons name="call-merge" size={18} color={Colors.textMuted} />
                  <Text style={[styles.syncButtonText, { color: Colors.textMuted }]}>Mesclar</Text>
                </View>
              </TouchableOpacity>
            </View>

              {uploadProgress && (
                  <View style={styles.progressRow}>
                    <ActivityIndicator color={Colors.primary} />
                    <Text style={styles.progressText}> Enviando {uploadProgress.current} / {uploadProgress.total} {uploadProgress.item ? `- ${uploadProgress.item}` : ''}</Text>
                  </View>
                )}
            

            <View style={{ height: 12 }} />
            <TouchableOpacity style={[styles.syncButton, { backgroundColor: Colors.error }]} onPress={handleDownloadFromCloud} disabled={isSyncing}>
              <View style={styles.syncButtonContent}>
                <MaterialCommunityIcons name="cloud-download-outline" size={18} color="white" />
                <Text style={styles.syncButtonText}>Substituir dados locais</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>ℹ️ Sobre o App</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Gustavo Tattoo - Agenda</Text>
            <Text style={styles.infoVersion}>Versão 1.0.0</Text>
            <Text style={styles.infoDescription}>
              App moderno e prático para gerenciar sua agenda de tatuagens com estilo.
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Desenvolvido com ❤️ para tatuadores profissionais
          </Text>
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
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    ...Shadows.medium,
    borderTopWidth: 4,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  faturamentoCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.large,
    borderLeftWidth: 5,
    borderLeftColor: Colors.accent,
  },
  faturamentoContent: {
    flex: 1,
  },
  faturamentoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  faturamentoValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 6,
  },
  faturamentoDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  faturamentoIcon: {
    marginLeft: 16,
  },
  actionCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.medium,
  },
  actionIcon: {
    fontSize: 24,
    color: Colors.primary,
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  actionSublabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionChevron: {
    fontSize: 24,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  infoCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    ...Shadows.medium,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundLight,
    marginVertical: 30,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  syncCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 10,
    ...Shadows.medium,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 6,
  },
  syncHelp: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  syncInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: Colors.textLight,
    marginBottom: 12,
  },
  syncButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  syncButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncButtonText: {
    color: Colors.textLight,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressText: {
    color: Colors.textLight,
    marginLeft: 8,
  },
});