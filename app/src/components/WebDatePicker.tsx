import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { format } from 'date-fns';

interface WebDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const WebDatePicker: React.FC<WebDatePickerProps> = ({ date, setDate }) => {
  const handleDateChange = (event: any) => {
    const dateString = event.target.value;
    if (dateString) {
      const [year, month, day] = dateString.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      setDate(localDate);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="calendar" style={styles.inputIcon} />
      <input
        type="date"
        value={format(date, 'yyyy-MM-dd')}
        onChange={handleDateChange}
        style={webStyles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

const webStyles = {
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    color: Colors.textLight,
    fontWeight: '500',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  } as React.CSSProperties,
};

export default WebDatePicker;
