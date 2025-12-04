import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AgendaProvider } from './contexts/AgendaContext';
import { Navigation } from './Navigation';

export default function App() {
  return (
    <AgendaProvider>
      <Navigation />
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
    </AgendaProvider>
  );
}
