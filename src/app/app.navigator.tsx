import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useTheme } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainStack from '@src/containers/index.navigator';
import { NavigationService } from '@utils/navigation';
import ModalStack from '@src/containers/Modal/index.stack';
import { useAppSelector } from '@utils/redux';
import colorsDark from '@themes/Color/colorsDark';
import { Global } from '@utils/appHelper';
import { BottomSheet } from '@components';

const Stack = createStackNavigator();

function RootStack() {
  Global.bottomSheet.ref = useRef<any>(null);
  const [reloadBottomSheet] = useAppSelector(
    (state) => [
      state.config.reloadBottomSheet,
    ]
  );

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="mainStack" component={MainStack} />
        {ModalStack()}
      </Stack.Navigator>
      <BottomSheet
        ref={Global.bottomSheet.ref}
        index={-1}
        backdropPressBehavior="close"
        name={reloadBottomSheet.toString()}
        {...Global.bottomSheet.props as any}
      />
    </>
  );
}

function handleTheme() {
  /**
   * Theme
   */
  const themeMode = useAppSelector((state) => state.config.themeMode);
  const { theme } = useTheme();
  const defaultBackgroundColor = theme.colors.surface;
  const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor);
  useEffect(() => {
    setBackgroundColor(defaultBackgroundColor);
  }, [defaultBackgroundColor]);
  if (!Global.fn.setBackgroundColor) {
    Global.fn.setBackgroundColor = setBackgroundColor;
  }

  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent', true);
    StatusBar.setTranslucent(true);
  }
  return { backgroundColor, themeMode };
}

export default function AppNavigator() {
  const { backgroundColor, themeMode } = handleTheme();

  return (
    <>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={NavigationService.navigationRef}
        theme={{
          colors: {
            background: backgroundColor,
            primary: '',
            card: '',
            text: '',
            border: '',
            notification: '',
          },
          dark: themeMode === 'dark',
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="rootStack"
            component={RootStack}
            options={{
              headerShown: false,
              cardStyle: {
                backgroundColor: colorsDark.white
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
