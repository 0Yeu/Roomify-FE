/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
import Routes from '@containers/routes';
import IconSource from '@icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '@themes/Color/colors';
import AppView from '@utils/appView';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Icon, ThemeContext } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chat from './Chat';
import ExploreScreen from './Explore/screens';
import NotificationScreen from './Notification';
import ProfileScreen from './Profile/screens';
import ListRoommate from './Roommate';
import SavedScreen from './Saved';

const BottomTabs = createBottomTabNavigator();

export default function MainBottomTab(props: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const backgroundColor = theme.colors.themeMode === 'light' ? theme.colors.white : theme.colors.grey0;
  const borderTopColor = theme.colors.themeMode === 'light' ? theme.colors.grey4 : 'transparent';

  /**
   * Handle Screen Metrics & SafeAreaInsets
   */

  const height = AppView.bottomNavigationBarHeight + insets.bottom;
  const customStyle: any = {};
  if (!insets.bottom && !AppView.isHorizontal) customStyle.paddingBottom = 5;
  if (insets.bottom && !AppView.isHorizontal) {
    customStyle.paddingTop = 10;
  } else if (!insets.bottom && !AppView.isHorizontal) {
    customStyle.paddingTop = 5;
  }
  if (insets.bottom && AppView.isHorizontal) {
    customStyle.maxHeight = height - 15;
  } else if (!insets.bottom && AppView.isHorizontal) {
    customStyle.maxHeight = height - 10;
  }
  // const { roundedBorderRadius: borderRadius } = AppView;
  const borderRadius = 20;
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.color363636,
        tabBarStyle: StyleSheet.flatten([{
          height,
          // borderTopLeftRadius: borderRadius,
          // borderTopRightRadius: borderRadius,
          borderTopColor,
          backgroundColor,
        },
          customStyle,
          // AppView.shadow()
        ]),
        tabBarItemStyle: {
          borderRadius,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: AppView.fontFamily,

        },
      }}
    >
      <BottomTabs.Screen
        name={Routes.EXPLORE_SCREEN}
        component={ExploreScreen}
        options={{
          tabBarLabel: t('bottom_tab:Trang chủ'),
          tabBarIcon: ({ focused, color, size }) => (
            <IconSource.MagnifyIcon
              fill={focused ? colors.primary : colors.color363636}
            />
          ),

        }}
      />

      <BottomTabs.Screen
        name="Routes.SAVED_SCREEN"
        component={ListRoommate}
        options={{
          tabBarLabel: t('bottom_tab:Ở ghép'),
          tabBarIcon: ({ focused, color, size }) => (focused ? (
            <Icon
              name="addusergroup"
              type="antdesign"
              color={color}
              size={26}
            />
          ) : (
            <Icon
              name="addusergroup"
              type="antdesign"
              color="#000000"
              size={22}
            />
          )),
        }}
      />
      <BottomTabs.Screen
        name={Routes.SAVED_SCREEN}
        component={SavedScreen}
        options={{
          tabBarLabel: t('bottom_tab:Yêu thích'),
          tabBarIcon: ({ focused, color, size }) => (
            <IconSource.HeartOutlineIcon
              fill={focused ? colors.primary : colors.color363636}
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name={Routes.NOTIFICATION_SCREEN}
        component={NotificationScreen}
        options={{
          tabBarLabel: t('bottom_tab:Thông báo'),
          tabBarIcon: (
            { focused, color, size }
          ) => (
            <IconSource.BellOutlineIcon
              fill={focused ? colors.primary : colors.color363636}
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name={Routes.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{
          tabBarLabel: t('bottom_tab:Cá nhân'),
          tabBarIcon: (
            { focused, color, size }
          ) => (
            <IconSource.PersonOutlineIcon
              fill={focused ? colors.primary : colors.color363636}
            />
          )
        }}
      />
      <BottomTabs.Screen
        name={Routes.CHAT_SCREEN}
        component={Chat}
        options={{
          tabBarLabel: t('bottom_tab:Trò chuyện'),
          tabBarIcon: ({ focused, color, size }) => (
            <IconSource.ChatIcon
              fill={focused ? colors.primary : colors.color363636}
            />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}
