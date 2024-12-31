import React from 'react';
import { QuickView, Text, Header, Body, Image, Button } from '@components';
import { IBase } from '@utils/appHelper';
import colors from '@themes/Color/colors';
import IconSource from '@icons';
import Routes from '@containers/routes';
import { NavigationService } from '@utils/navigation';
import AppView from '@utils/appView';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { logout } from '@containers/Auth/components/Login/redux/slice';
import { RoleApi } from '@utils/constant';

interface Props extends IBase {}

const list = [
  {
    name: 'profile:register_owner',
    type: 'screen',
    icon: <IconSource.RegisterOwnerIcon />,
    // stack: rootStack.profileStack,
    screen: Routes.REGISTER_OWNER,
    forbiddenRole: RoleApi.OWNER,
    // role: [RoleApi.USER],
  },
  {
    name: 'profile:my_room',
    type: 'screen',
    icon: <IconSource.MyRoomIcon />,
    forbiddenRole: RoleApi.USER,
    // stack: rootStack.profileStack,
    screen: Routes.MY_LIST_PROPERTY,
    // role: [RoleApi.OWNER],
  },
  {
    name: 'profile:rent_your_home',
    type: 'screen',
    icon: <IconSource.CreateRoom />,
    forbiddenRole: RoleApi.USER,
    screen: Routes.CREATE_PROPERTY,
    // role: [RoleApi.OWNER],
  },
  {
    name: 'profile:room_is_booked',
    type: 'screen',
    icon: <IconSource.LsBookedRoom />,
    forbiddenRole: RoleApi.USER,
    screen: Routes.LIST_ROOM_HAVE_BEEN_BOOKED,
    // role: [RoleApi.OWNER],
  },
  {
    name: 'profile:ls_u_have_booked',
    type: 'screen',
    icon: <IconSource.YouBookedIcon />,
    // forbiddenRole: RoleApi.USER,
    screen: Routes.LIST_YOU_HAVE_BOOKED,
    // role: [RoleApi.USER, RoleApi.OWNER],
  },
  {
    name: 'profile:setting',
    type: 'screen',
    icon: <IconSource.SettingIcon />,
    // stack: rootStack.profileStack,
    screen: Routes.SETTING_SCREEN,
    // role: [RoleApi.OWNER, RoleApi.USER],
  },
];

const ItemSetting = ({ icon, t, onPress }: { icon: any; t: string; onPress?: any }) => (
  <QuickView
    onPress={() => {
      if (onPress) onPress();
    }}
    verticalCenter
    borderRadius={15}
    style={{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    }}
    backgroundColor={colors.white}
    padding={15}
    marginBottom={20}
    row>
    {icon}
    <Text marginLeft={10} tText={t} />
  </QuickView>
);

const ProfileScreen: React.FC<Props> = (props: Props) => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handlePress = (screen: string | undefined) => {
    if (screen) NavigationService.navigate(screen);
  };

  const handleLogout = () => {
    dispatch(logout());
    // dispatch({ type: 'RESET_REDUX' });
  };

  if (!auth?.loginData?.token) {
    return (
      <>
        <QuickView scrollable>
          <Header placement="left" tTitle="profile:mine" />
          <QuickView paddingHorizontal={AppView.bodyPaddingHorizontal}>
            <Text tText="profile:suggest_login" />
            <Button
              marginTop={40}
              tTitle="auth:login"
              onPress={() => NavigationService.navigate(Routes.LOGIN_SCREEN)}
            />
            <QuickView
              marginTop={10}
              row
              onPress={() => NavigationService.navigate(Routes.SIGNUP_SCREEN)}>
              <Text tText="auth:have_account" />
              <QuickView onPress={() => NavigationService.navigate(Routes.SIGNUP_SCREEN)}>
                <Text marginLeft={5} underline tText="auth:signup" />
              </QuickView>
            </QuickView>
            <QuickView
              onPress={() => NavigationService.navigate(Routes.SETTING_SCREEN)}
              verticalCenter
              style={{ borderTopWidth: 0.5, borderColor: colors.grey }}
              marginTop={15}
              paddingTop={15}
              row>
              <QuickView flex={1}>
                <Text tText="profile:setting" />
              </QuickView>
              <IconSource.SettingIcon fill={colors.black} />
            </QuickView>
            <QuickView
              onPress={() => NavigationService.navigate(Routes.SETTING_SCREEN)}
              verticalCenter
              style={{ borderTopWidth: 0.5, borderColor: colors.grey }}
              marginTop={15}
              paddingTop={15}
              row>
              <QuickView flex={1}>
                <Text tText="profile:get_help" />
              </QuickView>
              <IconSource.SettingIcon fill={colors.black} />
            </QuickView>
          </QuickView>
        </QuickView>
      </>
    );
  }

  const lsRoles =
    (auth?.loginData?.role || [])?.length > 0 && auth?.loginData?.role?.map((r: any) => r?.name);

  return (
    <>
      <Header placement="left" tTitle="profile:mine" />
      <Body scrollable>
        <QuickView
          row
          onPress={() => NavigationService.navigate(Routes.MY_ACCOUNT)}
          borderRadius={15}
          marginTop={15}
          marginBottom={30}
          padding={15}
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
          }}
          backgroundColor={colors.white}>
          <Image
            borderRadius={50}
            source={{ uri: auth?.loginData?.avatar }}
            width={70}
            height={70}
          />
          <QuickView marginLeft={10}>
            <Text fontSize={20} bold>
              {auth?.loginData?.fullName}
            </Text>
            <Text marginTop={5} color={colors.grey}>
              {auth?.loginData?.email}
            </Text>
            <Text marginTop={5} color={colors.grey}>
              {auth?.loginData?.phone}
            </Text>
            <Text marginTop={5} color={colors.grey}>
              {lsRoles?.join(',')}
            </Text>
          </QuickView>
        </QuickView>
        {list?.map(l => {
          if ((lsRoles || [])?.length > 1) {
            return (
              <ItemSetting
                key={l?.name}
                t={l?.name}
                icon={l?.icon}
                onPress={() => handlePress(l?.screen)}
              />
            );
          }
          if ((lsRoles || [])?.length === 1 && !lsRoles?.includes(l?.forbiddenRole)) {
            return (
              <ItemSetting
                key={l?.name}
                t={l?.name}
                icon={l?.icon}
                onPress={() => handlePress(l?.screen)}
              />
            );
          }
          return null;
        })}
        <Button customType="logout" center onPress={handleLogout} />
        {/* <ButtonChangeLanguage />
      <VersionText />
      <Button title="Go to example" onPress={() => NavigationService.navigate('ExampleDrawer')} />
      <Button customType="logout" /> */}
      </Body>
    </>
  );
};

export default ProfileScreen;
