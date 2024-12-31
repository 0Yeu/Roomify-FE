import CloudMessaging from '@core/plugin/cloudMessaging';
import { changeLanguageConfig, presentBottomSheet, closeBottomSheet } from '@src/containers/Config/redux/slice';
import Theme from '@themes/Theme';
import AppHelper, { Global } from '@utils/appHelper';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import React, { useEffect, useMemo } from 'react';
import Config from 'react-native-config';
import { ThemeProvider } from 'react-native-elements';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import AppNavigator from './app.navigator';

export default function AppContainer() {
  const [language, themeMode, loginData] = useAppSelector(
    (state) => [state.config.language, state.config.themeMode, state.auth.loginData]
  );
  const dispatch = useAppDispatch();

  useMemo(() => {
    console.log('TOKEN :>> ', loginData?.token);
    if (loginData?.token) {
      Global.token = loginData.token;
    }
    AppHelper.setGlobalDeviceInfo();
    Global.perPage = !Number.isNaN(parseInt(Config.PER_PAGE, 10))
      ? parseInt(Config.PER_PAGE, 10) : 10;
    Global.fn = {} as any;
    Global.bottomSheet = {
      ref: null,
      props: {} as any,
      present: () => dispatch(presentBottomSheet()),
      close: () => dispatch(closeBottomSheet()),
    };
    Global.dispatch = dispatch;
    return true;
  }, []);

  useEffect(() => {
    AppHelper.initCalendarLanguage();
    changeLanguageConfig(language);
    SplashScreen.hide();
    CloudMessaging.requestUserPermission();
    CloudMessaging.messageListener();
    return () => {};
  }, []);

  return (
    <ThemeProvider useDark={themeMode === 'dark'} theme={Theme}>
      <AppNavigator />
      <Toast />
      <FlashMessage position="top" />
    </ThemeProvider>
  );
}
