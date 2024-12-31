import React from 'react';
import Text from '@components/Common/Text';
import QuickView from '@components/Common/View/QuickView';
import Config from 'react-native-config';
import { Global } from '@utils/appHelper';

export default function VersionText() {
  return (
    <QuickView>
      <QuickView row style={{ flexWrap: 'wrap' }}>
        <Text marginTop={15} marginRight={3} bold tText="version">:</Text>
        <Text>{`${Config.NODE_ENV} | ${Global.deviceInfo.buildVersion} | ${Global.deviceInfo.buildNumber}` }</Text>
      </QuickView>
      <Text marginTop={5}>{Config.API_URL}</Text>
    </QuickView>
  );
}
