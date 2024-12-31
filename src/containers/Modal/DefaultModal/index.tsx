import React from 'react';
import { StatusBar, View } from 'react-native';
import AppHelper from '@utils/appHelper';

export default function DefaultModal(props: any) {
  const {
    route,
  } = props;
  const name = route?.params?.item?.name || route?.params?.name;

  const modal = AppHelper.getModalFromGlobal(name);
  const Component = modal?.content || <View />;
  return (
    <>
      <StatusBar barStyle="light-content" />
      {Component}
    </>
  );
}
