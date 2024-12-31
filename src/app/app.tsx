import { store, persistor } from '@core/configs/store';
import ImageSource from '@images';
import React from 'react';
import { ActivityIndicator, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-elements';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './app.container';

const LoadingScreen = () => {
  const { theme } = useTheme();

  return (
    <ImageBackground
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
      source={ImageSource.splash}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 250 }} />
    </ImageBackground>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={LoadingScreen()} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}
