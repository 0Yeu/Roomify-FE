import * as React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import modalStack from './routes';
import DefaultModal from './DefaultModal';

const Stack = createStackNavigator();

export default function ModalStack() {
  return (
    <>
      <Stack.Screen
        name={modalStack.defaultModal}
        component={DefaultModal}
        options={{
          gestureDirection: 'vertical',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </>
  );
}
