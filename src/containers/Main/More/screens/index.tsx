import React from 'react';
import { Button, QuickView, Text, VersionText } from '@components';
import ButtonChangeLanguage from '@src/containers/Config/components/ButtonChangeLanguage';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

export default function More() {
  return (
    <QuickView center flex={1}>
      <Text center h1 tText="bottom_tab:more" marginBottom={10} />
      <ButtonChangeLanguage />
      <VersionText />
      <Button title="Go to example" onPress={() => NavigationService.navigate('ExampleDrawer')} />
      <Button customType="logout" />
    </QuickView>
  );
}
