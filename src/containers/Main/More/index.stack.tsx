import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import moreScreen from './routes';
import MoreScreen from './screens';

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <>
      <Stack.Screen name={moreScreen.index} component={MoreScreen} />
    </>
  );
}
