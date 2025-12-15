import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgendaScreen } from './screens/AgendaScreen';
import { AddTatuagemScreen } from './screens/AddTatuagemScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import MainScreen from './screens/MainScreen';
import CadastroClienteScreen from './screens/CadastroClienteScreen';
import HistoricoTrabalhosScreen from './screens/HistoricoTrabalhosScreen';
import ListaClientesScreen from './screens/ListaClientesScreen'; // Importa a nova tela
import { Colors } from './theme/colors';

// Define os tipos de parâmetros para cada rota
export type RootStackParamList = {
  Main: undefined;
  Agenda: undefined;
  AddTatuagem: undefined;
  CadastroCliente: undefined;
  ListaClientes: undefined; // Nova rota para a lista de clientes
  HistoricoTrabalhos: { clienteNome?: string }; // Rota de histórico com parâmetro opcional
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          options={{ title: 'Agenda' }}
        />
        <Stack.Screen
          name="AddTatuagem"
          component={AddTatuagemScreen}
          options={{ title: 'Novo Agendamento' }}
        />
        <Stack.Screen
          name="CadastroCliente"
          component={CadastroClienteScreen}
          options={{ title: 'Cadastro de Cliente' }}
        />
        <Stack.Screen
          name="ListaClientes"
          component={ListaClientesScreen}
          options={{ title: 'Histórico por Cliente' }}
        />
        <Stack.Screen
          name="HistoricoTrabalhos"
          component={HistoricoTrabalhosScreen}
          options={{ title: 'Histórico de Trabalhos' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Mais' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};