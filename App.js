import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Home from './screens/Home';
import Overview from './screens/Overview';
import Chart from './screens/Chart';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{gestureEnabled: false}}>
        <Stack.Screen
          name = "Home"
          component={Home}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name = "Overview"
          component={Overview}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name = "Chart"
          component={Chart}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}