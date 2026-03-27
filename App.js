import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { HabitProvider } from './src/context/HabitContext';
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import StreakScreen from './src/screens/StreakScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              paddingBottom: 8,
              paddingTop: 6,
              height: 70,
            },
            tabBarActiveTintColor: '#c94f1e',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
            tabBarIcon: ({ focused, color }) => {
              const icons = { Home: '🏠', Stats: '📊', Streaks: '🔥', Profile: '👤' };
              return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Stats" component={StatsScreen} />
          <Tab.Screen name="Streaks" component={StreakScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </HabitProvider>
  );
}
