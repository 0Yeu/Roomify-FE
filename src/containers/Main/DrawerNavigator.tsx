import React from 'react';
import { View, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Divider, Switch } from 'react-native-elements';
import { switchTheme } from '@src/containers/Config/redux/slice';
import ImageSource from '@images';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { Text } from '@components';

function CustomContentComponent(
  props: DrawerContentComponentProps
) {
  const themeMode = useAppSelector((state) => state.config.themeMode);
  const dispatch = useAppDispatch();

  return (
    <View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={ImageSource.logo}
          style={{ width: '70%', height: 100, tintColor: '#397af8' }}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: 25,
          paddingBottom: 5,
        }}
      >
        <Text
          style={{
            marginTop: 3,
          }}
        >
          Dark Mode
        </Text>
        <Switch
          style={{
            position: 'absolute',
            right: 20,
          }}
          value={themeMode === 'dark'}
          onValueChange={() => { dispatch(switchTheme()); }}
        />
      </View>
      <Divider style={{ marginTop: 15 }} />
      <View>
        <DrawerItemList {...props} />
      </View>
    </View>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  return (
    <DrawerContentScrollView {...props}>
      <CustomContentComponent {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
