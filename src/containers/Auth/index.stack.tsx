import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import authStack from './routes';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={authStack.login} component={LoginScreen} />
      <Stack.Screen name={authStack.signup} component={SignupScreen} />
    </Stack.Navigator>
  );
}
