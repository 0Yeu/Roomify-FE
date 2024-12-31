import React from 'react';
import {
  QuickView, Text, Header, Body, Avatar, Button,
} from '@components';
import AppHelper, { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import useFetch from '@src/hooks/useFetch';
import colors from '@themes/Color/colors';
import { Linking } from 'react-native';

interface Props {
  route: any
}

const DetailRoommate: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const passData = route?.params;
  const { data } = useFetch(`/roommate/${passData}`, [], {}, undefined);

  const handleCall = () => {
    if (data?.phone) {
      Linking.openURL(`tel:${data?.phone}`);
    }
  };

  return (
    <>
      <Header backIcon title="Chi tiết phòng ghép" />
      <Body scrollable>
        <QuickView>
          <QuickView center>
            <Avatar size="xlarge" source={{ uri: data?.user?.avatar }} />
          </QuickView>
          <QuickView marginTop={20}>
            <Text bold>{data?.user?.fullName}</Text>
            <QuickView style={{ borderBottomWidth: 1, borderColor: colors.grey3 }} paddingVertical={10} row justifyContent="space-between">
              <Text bold>Mức giá</Text>
              <Text>{AppHelper.vndPriceFormat(data?.price * 10)}</Text>
            </QuickView>
            <QuickView style={{ borderBottomWidth: 1, borderColor: colors.grey3 }} paddingVertical={10} row justifyContent="space-between">
              <Text bold>Địa chỉ</Text>
              <Text>{`${data?.destination?.parent?.name}, ${data?.destination?.parent?.parent?.name}`}</Text>
            </QuickView>
            <QuickView style={{ borderBottomWidth: 1, borderColor: colors.grey3 }} paddingVertical={10} row justifyContent="space-between">
              <QuickView flex={1}>
                <Text bold>Mô tả</Text>
              </QuickView>
              <QuickView flex={2}>
                <Text style={{ textAlign: 'right' }}>{data?.description}</Text>
              </QuickView>
            </QuickView>

          </QuickView>

          <Button onPress={handleCall} marginTop={20} title="Gọi điện thoại" />
        </QuickView>
      </Body>
    </>
  );
};

export default DetailRoommate;
