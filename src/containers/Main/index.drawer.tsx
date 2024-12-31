import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeContext } from 'react-native-elements';
import ExampleDrawer from '@src/containers/Example/index.drawer';
import Route from '@src/containers/routes';
import AppView from '@utils/appView';
import DrawerNavigator from './DrawerNavigator';

const Drawer = createDrawerNavigator();

function MainDrawer() {
  const { theme } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      initialRouteName={Route.exampleStack.input}
      drawerContent={DrawerNavigator}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.secondary,
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveTintColor: theme.colors.grey7,
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: {
          fontSize: 15,
          marginLeft: 0,
          paddingLeft: 1,
          fontWeight: 'normal',
          fontFamily: AppView.fontFamily,
        },
        drawerStyle: {
          backgroundColor: theme.colors.grey0,
        }
      }}
    >
      {ExampleDrawer()}
    </Drawer.Navigator>
  );
}

export default MainDrawer;
