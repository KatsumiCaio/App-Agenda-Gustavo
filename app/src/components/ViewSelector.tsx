import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addDays, subDays } from 'date-fns';
import { useAgenda } from '../contexts/AgendaContext';
import { TatuagemItem } from './TatuagemItem';
import { DateHelper } from '../utils/dateHelper';

interface ViewSelectorProps {
  onSelectItem?: (item: any) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ onSelectItem }) => {
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getTatuagensForDate, getTatuagensForWeek, getTatuagensForMonth } = useAgenda();

  const getTatuagens = () => {
    switch (viewMode) {
      case 'dia':
        return getTatuagensForDate(currentDate);
      case 'semana':
        return getTatuagensForWeek(currentDate);
      case 'mes':
        return getTatuagensForMonth(currentDate);
      default:
        return [];
    }
  };

  const getHeaderText = () => {
    switch (viewMode) {
      case 'dia':
        return DateHelper.formatDateWithDay(currentDate);
      case 'semana':
        return DateHelper.formatWeekRange(currentDate);
      case 'mes':
        return DateHelper.formatMonth(currentDate);
    }
  };

  const goToPrevious = () => {
    switch (viewMode) {
      case 'dia':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'semana':
        setCurrentDate(subDays(currentDate, 7));
        break;
      case 'mes':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        break;
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case 'dia':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'semana':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'mes':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const tatuagens = getTatuagens();

  return (
    <View style={styles.container}>
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'dia' && styles.modeButtonActive]}
          onPress={() => {
            setViewMode('dia');
            setCurrentDate(new Date());
          }}
        >
          <Text style={[styles.modeButtonText, viewMode === 'dia' && styles.modeButtonTextActive]}>
            Dia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'semana' && styles.modeButtonActive]}
          onPress={() => {
            setViewMode('semana');
            setCurrentDate(new Date());
          }}
        >
          <Text style={[styles.modeButtonText, viewMode === 'semana' && styles.modeButtonTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'mes' && styles.modeButtonActive]}
          onPress={() => {
            setViewMode('mes');
            setCurrentDate(new Date());
          }}
        >
          <Text style={[styles.modeButtonText, viewMode === 'mes' && styles.modeButtonTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
          <Text style={styles.navButtonText}>← Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>{getHeaderText()}</Text>

        <TouchableOpacity onPress={goToNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>Próximo →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
        <Text style={styles.todayButtonText}>Hoje</Text>
      </TouchableOpacity>

      <ScrollView style={styles.tatuagensContainer} showsVerticalScrollIndicator={false}>
        {tatuagens.length > 0 ? (
          tatuagens.map(tatuagem => (
            <TatuagemItem
              key={tatuagem.id}
              tatuagem={tatuagem}
              onPress={onSelectItem || (() => {})}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma tatuagem agendada</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  modeButtonActive: {
    backgroundColor: '#2196F3',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  todayButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
  },
  todayButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  tatuagensContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});
