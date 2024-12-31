import React from 'react';
import {
  QuickView, Text,
} from '@components';
import { ImageBackground } from 'react-native';
import colors from '@themes/Color/colors';
import ImageCommonSource from '@images/Common';
import AppView from '@utils/appView';
import { useAppSelector } from '@utils/redux';
import Routes from '@containers/routes';
import { NavigationService } from '@utils/navigation';
import AuthPopup from '@components/Common/AuthPopup';
import useDialog from '@src/hooks/useDialog';

interface Props {
  data: any
  image: any
}

const ItemCategory: React.FC<Props> = (props: Props) => {
  const { data, image } = props;
  const ImageSource: any = ImageCommonSource;
  const token = useAppSelector((state) => state.auth.loginData.token);

  const {
    isVisible,
    onClickDialogCloseBtn,
    onClickDialogOkBtn,
    onPressBtnToOpenDialog,
  } = useDialog({});

  const handleOnPress = () => {
    if (token) {
      NavigationService.navigate(Routes.PROPERTY_BY_CATEGORY, data);
    } else {
      onPressBtnToOpenDialog();
    }
    //
  };

  return (
    <>
      <QuickView
        onPress={handleOnPress}
        style={{
          width: ((AppView.screenWidth - 20) / 2) - 20 }}
        marginHorizontal={10}
        marginBottom={20}
      >
        <ImageBackground
          source={ImageSource[image]}
          style={{ width: '100%', height: 140 }}
          imageStyle={{ borderRadius: 10 }}
        >
          <QuickView justifyContent="flex-end" horizontalCenter style={{ borderRadius: 10 }} flex={1} backgroundColor="rgba(0,0,0,0.3)">
            <Text marginBottom={15} color={colors.white} bold>{data?.name}</Text>
          </QuickView>
        </ImageBackground>
      </QuickView>
      <AuthPopup overlayIsVisible={isVisible} handleClosePopup={() => onClickDialogCloseBtn()} />
    </>
  );
};

export default ItemCategory;
