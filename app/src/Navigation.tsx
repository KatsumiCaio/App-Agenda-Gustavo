import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgendaScreen } from './screens/AgendaScreen';
import { AddTatuagemScreen } from './screens/AddTatuagemScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import MainScreen from './screens/MainScreen';
import CadastroClienteScreen from './screens/CadastroClienteScreen';
import HistoricoTrabalhosScreen from './screens/HistoricoTrabalhosScreen';
import { Colors } from './theme/colors';

const Stack = createNativeStackNavigator();

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Agenda"
          component={AgendaScreen}
          options={{ title: '📅 Minha Agenda' }}
        />
        <Stack.Screen
          name="AddTatuagem"
          component={AddTatuagemScreen}
          options={{ title: '➕ Novo Agendamento' }}
        />
        <Stack.Screen
          name="CadastroCliente"
          component={CadastroClienteScreen}
          options={{ title: 'Cadastro de Cliente' }}
        />
        <Stack.Screen
          name="HistoricoTrabalhos"
          component={HistoricoTrabalhosScreen}
          options={{ title: 'Histórico de Trabalhos' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: '📊 Estatísticas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};