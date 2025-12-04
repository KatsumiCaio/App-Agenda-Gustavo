import 'react-native-get-random-values';
import React from 'react';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AgendaProvider } from './src/contexts/AgendaContext';
import { Navigation } from './src/Navigation';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AgendaProvider>
        <Navigation />
        <StatusBar style="light" backgroundColor={Colors.background} />
      </AgendaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);