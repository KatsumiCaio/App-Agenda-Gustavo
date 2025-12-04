import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { addDays, subDays } from 'date-fns';
import { useAgenda } from '../contexts/AgendaContext';
import { TatuagemItem } from './TatuagemItem';
import { DateHelper } from '../utils/dateHelper';
import { Colors, Shadows } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
          <MaterialCommunityIcons 
            name="calendar-today" 
            size={18} 
            color={viewMode === 'dia' ? Colors.textLight : Colors.textMuted}
            style={{ marginRight: 6 }}
          />
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
          <MaterialCommunityIcons 
            name="calendar-week" 
            size={18} 
            color={viewMode === 'semana' ? Colors.textLight : Colors.textMuted}
            style={{ marginRight: 6 }}
          />
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
          <MaterialCommunityIcons 
            name="calendar-month" 
            size={18} 
            color={viewMode === 'mes' ? Colors.textLight : Colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.modeButtonText, viewMode === 'mes' && styles.modeButtonTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.primary} />
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>{getHeaderText()}</Text>

        <TouchableOpacity onPress={goToNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>Próximo</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
        <MaterialCommunityIcons name="calendar-check-outline" size={18} color={Colors.textLight} />
        <Text style={styles.todayButtonText}>Voltar para Hoje</Text>
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
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={styles.emptyStateText}>Nenhuma tatuagem agendada</Text>
            <Text style={styles.emptyStateSubtext}>
              {viewMode === 'dia' 
                ? 'para este dia' 
                : viewMode === 'semana' 
                ? 'para esta semana' 
                : 'para este mês'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modeButtonTextActive: {
    color: Colors.textLight,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  todayButton: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...Shadows.small,
  },
  todayButtonText: {
    color: Colors.textLight,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 8,
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
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
