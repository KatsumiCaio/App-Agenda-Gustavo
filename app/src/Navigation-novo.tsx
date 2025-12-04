import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AgendaScreen } from './screens/AgendaScreen';
import { AddTatuagemScreen } from './screens/AddTatuagemScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Colors } from './theme/colors';

const Tab = createBottomTabNavigator();

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = 'help-circle';

            if (route.name === 'Agenda') {
              iconName = focused ? 'calendar-check' : 'calendar-outline';
            } else if (route.name === 'AddTatuagem') {
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'chart-box' : 'chart-box-outline';
            }

            return (
              <MaterialCommunityIcons name={iconName as any} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: Colors.background,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: Colors.textLight,
          },
          headerBackTitleVisible: false,
        })}
      >
        <Tab.Screen
          name="Agenda"
          component={AgendaScreen}
          options={{
            title: '📅 Minha Agenda',
            tabBarLabel: 'Agenda',
          }}
        />
        <Tab.Screen
          name="AddTatuagem"
          component={AddTatuagemScreen}
          options={{
            title: '➕ Novo Agendamento',
            tabBarLabel: 'Agendar',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '📊 Estatísticas',
            tabBarLabel: 'Mais',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
