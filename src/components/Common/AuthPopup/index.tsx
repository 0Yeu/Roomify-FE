import React from 'react';
import {
  QuickView, Text, Header, Body, Button,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme, Overlay } from 'react-native-elements';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props {
  handleClosePopup: () => any;
  overlayIsVisible: boolean;
}

const AuthPopup: React.FC<Props> = (props: Props) => {
  const { theme } = useTheme();
  const { handleClosePopup, overlayIsVisible } = props;

  return (
    <Overlay
      onBackdropPress={handleClosePopup}
      isVisible={overlayIsVisible}
        // height={200}
      overlayStyle={{ borderRadius: 8, height: 200, width: '80%' }}
    >
      <QuickView>
        <Text center bold color={colors.primary} fontSize={18} marginTop={32}>
          Thông báo
        </Text>
        <Text center fontSize={16} marginTop={12} marginHorizontal={30}>
          {`Bạn cần đăng nhập
để sử dụng chức năng này.`}
        </Text>
        <QuickView
          row
          justifyContent="space-between"
          paddingHorizontal={20}
            // width={250}
            // marginHorizontal={50}
            // center
          marginTop={12}
        >
          <Button
            outline
            title="Đóng"
            containerStyle={{
              width: '45%'
            }}
            onPress={handleClosePopup}
          />
          <Button
            title="Đăng nhập"
            titleColor="#FFFFFF"
            containerStyle={{
              width: '45%'
            }}
            onPress={() => {
              handleClosePopup();
              NavigationService.navigate(Routes.LOGIN_SCREEN);
            }}
          />
        </QuickView>
      </QuickView>
    </Overlay>
  );
};

export default AuthPopup;
