import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainBottomTab from '@src/containers/Main/index.bottomtab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import AppView from '@utils/appView';
import ExampleStack from './Example/index.drawer';
import MoreStack from './Main/More/index.stack';
import ExploreStack from './Main/Explore/index.stack';
import MainDrawer from './Main/index.drawer';
import Routes from './routes';
import SettingScreen from './Main/Profile/screens/Setting';
import CreatePropertyScreen from './Main/Profile/screens/CreateProperty';
import RegisterOwner from './Main/Profile/screens/RegisterOwner';
import LoginScreen from './Auth/screens/LoginScreen';
import SignupScreen from './Auth/screens/SignupScreen';
import ListYouHaveBooked from './Main/Profile/screens/ListYouHaveBooked';
import MyProperties from './Main/Profile/screens/MyProperties';
import ListRoomHaveBeenBooked from './Main/Profile/screens/ListRoomHaveBeenBooked';
import SelectLocation from './Main/Profile/screens/CreateProperty/SelectLocation';
import ManageDetailProperty from './Main/Profile/screens/ManageDetailProperty';
import CreateRoom from './Main/Profile/screens/CreateRoom';
import MyAccount from './Main/Profile/screens/MyAccount';
import DetailRoommate from './Main/Roommate/DetailRoommate';

const Stack = createStackNavigator();

function SwitchStack() {
  // const [loginData] = useAppSelector(
  //   (state) => [
  //     state.auth.loginData
  //   ]
  // );
  // if (!loginData.token) {
  //   return (
  //     <Stack.Screen
  //       name="authStack"
  //       component={AuthStack}
  //     />
  //   );
  // }
  return (
    <Stack.Screen
      name="mainBottomTab"
      component={MainBottomTab}
    />
  );
}

export default function MainStack() {
  // const themeSelectorData = useSelector((state) => themeSelector(state));
  // const backgroundColor = themeSelectorData === 'light'
  //   ? Color.lightPrimaryBackground
  //   : Color.darkPrimaryBackground;

  /**
   * Handle Screen Metrics & SafeAreaInsets
   */
  function onDimensionChange({ window }: any) {
    AppView.onDimensionChange(window);
  }
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);
    AppView.initSafeArea(insets);
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >

      {SwitchStack()}
      <Stack.Screen
        name="ExampleDrawer"
        component={MainDrawer}
      />
      {ExampleStack()}
      {MoreStack()}
      {ExploreStack()}
      {/* Profile */}
      <Stack.Screen
        name={Routes.SETTING_SCREEN}
        component={SettingScreen}
      />
      <Stack.Screen
        name={Routes.CREATE_PROPERTY}
        component={CreatePropertyScreen}
      />
      <Stack.Screen
        name={Routes.REGISTER_OWNER}
        component={RegisterOwner}
      />
      <Stack.Screen
        name={Routes.LIST_YOU_HAVE_BOOKED}
        component={ListYouHaveBooked}
      />
      <Stack.Screen
        name={Routes.MY_LIST_PROPERTY}
        component={MyProperties}
      />
      <Stack.Screen
        name={Routes.LIST_ROOM_HAVE_BEEN_BOOKED}
        component={ListRoomHaveBeenBooked}
      />
      <Stack.Screen
        name={Routes.SELECT_LOCATION}
        component={SelectLocation}
      />
      <Stack.Screen
        name={Routes.MANAGE_DETAIL_PROPERTY}
        component={ManageDetailProperty}
      />
      <Stack.Screen
        name={Routes.CREATE_ROOM}
        component={CreateRoom}
      />
      <Stack.Screen
        name={Routes.MY_ACCOUNT}
        component={MyAccount}
      />
      {/* Profile */}
      {/* Auth */}
      <Stack.Screen name={Routes.LOGIN_SCREEN} component={LoginScreen} />
      <Stack.Screen name={Routes.SIGNUP_SCREEN} component={SignupScreen} />
      {/* Auth */}
      <Stack.Screen name={Routes.DETAIL_ROOMMATE_SCREEN} component={DetailRoommate} />
    </Stack.Navigator>
  );
}
