import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface WebTimePickerProps {
  horario: string;
  setHorario: (time: string) => void;
}

const WebTimePicker: React.FC<WebTimePickerProps> = ({ horario, setHorario }) => {
  const handleTimeChange = (event: any) => {
    setHorario(event.target.value);
  };

  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="clock-outline" style={styles.inputIcon} />
      <input
        type="time"
        value={horario}
        onChange={handleTimeChange}
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

export default WebTimePicker;
