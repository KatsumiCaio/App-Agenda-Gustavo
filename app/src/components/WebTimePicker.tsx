// This is a placeholder for non-web platforms.
// The actual web implementation is in WebTimePicker.web.tsx
// The Platform.OS check in AddTatuagemScreen ensures this is never rendered.
import React from 'react';

// Define the props to match the web version so TypeScript doesn't complain
interface WebTimePickerProps {
  horario: string;
  setHorario: (time: string) => void;
}

const WebTimePicker: React.FC<WebTimePickerProps> = () => null;

export default WebTimePicker;