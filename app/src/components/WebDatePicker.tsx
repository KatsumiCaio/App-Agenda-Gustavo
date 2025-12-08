// This is a placeholder for non-web platforms.
// The actual web implementation is in WebDatePicker.web.tsx
// The Platform.OS check in AddTatuagemScreen ensures this is never rendered.
import React from 'react';

// Define the props to match the web version so TypeScript doesn't complain
interface WebDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const WebDatePicker: React.FC<WebDatePickerProps> = () => null;

export default WebDatePicker;