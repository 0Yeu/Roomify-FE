import React, { memo, useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Input, Button, Loading
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import { Image, ImageBackground, TextInput, View } from 'react-native';
import ImageCommonSource from '@images/Common';
import AppView from '@utils/appView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Api from '@utils/api';
import colors from '@themes/Color/colors';
import Toast from 'react-native-toast-message';
import CustomInput from '../components/CustomInput';

interface Props extends IBase {}

const MyAccount: React.FC<Props> = (props: Props) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any>(null);
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchInfoMe = async () => {
    try {
      const response = await Api.get('/auth/me');
      setData(response);
      setFullName(response?.fullName);
      setEmail(response?.email);
      setPhone(response?.phone);
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  useEffect(() => {
    fetchInfoMe();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        fullName,
        email,
        phone
      };
      const response = await Api.patch('/auth/me', payload);
      console.log('response :>> ', response);
      setLoading(false);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Thành công',
        text2: 'Bạn đã cập nhật thông tin thành công',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 40,
        bottomOffset: 40,
        onShow: () => {},
        onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
        onPress: () => {},
        props: {} // any custom props passed to the Toast component
      });
    } catch (error) {
      console.log('error :>> ', error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Header backIcon title="MyAccount" /> */}
      <ImageBackground
        source={ImageCommonSource.bgProfile}
        style={{ width: AppView.screenWidth, height: 250 }}
      >
        <Header leftColor={colors.white} backIcon title="Thay đổi thông tin" centerColor={colors.white} />
        <QuickView flex={1} center>
          <Image
            source={{
              uri: data?.avatar,
            }}
            style={{ width: 85, height: 85 }}
          />
        </QuickView>
      </ImageBackground>
      <Body backgroundColor={colors.white}>
        <QuickView scrollable>
          <CustomInput onChange={setFullName} value={fullName} title="Họ và tên " />
          <CustomInput onChange={setEmail} value={email} title="Email" />
          <CustomInput onChange={setPhone} value={phone} title="Số điện thoại" />
        </QuickView>
        <Button title="Cập nhật" onPress={handleUpdate} />
      </Body>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default MyAccount;
