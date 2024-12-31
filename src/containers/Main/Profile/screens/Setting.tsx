import React from 'react';
import { Body, Button, Header, QuickView, Text, VersionText } from '@components';
import ButtonChangeLanguage from '@src/containers/Config/components/ButtonChangeLanguage';
import { NavigationService } from '@utils/navigation';
import colors from '@themes/Color/colors';

export default function SettingScreen() {
  return (
    <>
      <Header leftColor={colors.white} centerColor={colors.white} backgroundColor={colors.primary} backIcon tTitle="profile:setting" />
      <Body center flex={1}>
        <Text h1 tText="bottom_tab:more" marginBottom={10} />
        <ButtonChangeLanguage />
        <VersionText />
        <Button title="Go to example" onPress={() => NavigationService.navigate('ExampleDrawer')} />
        {/* <Button customType="logout" /> */}
      </Body>
    </>
  );
}
