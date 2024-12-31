import React, { useState } from 'react';
import {
  QuickView, Text, Header, Body, Loading, ErrorText,
} from '@components';
// import PanoramaView from '@lightbase/react-native-panorama-view';
import AppView from '@utils/appView';
import { StyleSheet, View } from 'react-native';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';

interface Props {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewer: {
    flex: 1
  },
});

const ls360Images = [
  'https://res.cloudinary.com/dichakho/image/upload/v1647162481/360%20Images/myroom_360_it5lrj.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148354/360%20Images/room8_360_rym3i3.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148355/360%20Images/room7_360_k9ncwc.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148355/360%20Images/room6_360_dp6vmd.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148354/360%20Images/room5_360_cqsce6.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148355/360%20Images/room4_360_lvcebh.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647148353/360%20Images/room3_360_vd5dio.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647147430/360%20Images/room2_360_wqtqp2.jpg',
  'https://res.cloudinary.com/dichakho/image/upload/v1647147413/360%20Images/room1_360_mvzr1x.jpg'
];

const View360DegreesImage: React.FC<Props> = () => {
  const [selectedUrl, setSelectedUrl] = useState(
    ls360Images[Math.floor(Math.random() * ls360Images.length)]
  );

  // const { data } = useFetch('https://api.cloudinary.com/v1_1/dichakho/property', [], {}, undefined);
  // console.log('data :>> ', data);

  const [loading, setLoading] = useState(true);
  const [errorLoadingImage, setErrorLoadingImage] = useState(false);
  const leftComponent = {
    icon: 'arrowleft',
    type: 'antdesign',
    size: 25,
    color: colors.primary,
    onPress: () => (
      NavigationService.goBack()
    ),
    style: {
      width: 25,
      height: 25,
    },
    containerStyle: {
      padding: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 10,
    },
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
  };

  return (
    <>
      {errorLoadingImage ? (
        <QuickView flex={1} center>
          <ErrorText error="Có lỗi xảy ra. Vui lòng thử lại sau" />
        </QuickView>
      ) : (
        <Body fullView>
          {/* <PanoramaView
            style={styles.viewer}
            dimensions={{
              height: AppView.screenHeight,
              width: AppView.screenWidth,
            }}
            inputType="mono"
            enableTouchTracking
            onImageLoadingFailed={() => {
              setLoading(false);
              setErrorLoadingImage(true);
            }}
            onImageLoaded={() => setLoading(false)}
            imageUrl={selectedUrl || 'https://res.cloudinary.com/dichakho/image/upload/v1647162481/360%20Images/myroom_360_it5lrj.jpg'}
          /> */}
        </Body>
      )}
      {/* <Body fullView>
        <PanoramaView
          style={styles.viewer}
          dimensions={{
            height: AppView.screenHeight,
            width: AppView.screenWidth,
          }}
          inputType="mono"
          enableTouchTracking
          onImageLoadingFailed={() => {
            setLoading(false);
            setErrorLoadingImage(true);
          }}
          onImageLoaded={() => setLoading(false)}
          imageUrl={selectedUrl || 'https://res.cloudinary.com/dichakho/image/upload/v1647162481/360%20Images/myroom_360_it5lrj.jpg'}
        />
      </Body> */}
      <View style={{
        position: 'absolute',
      }}
      >
        <Header leftComponent={leftComponent} transparent />
      </View>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default View360DegreesImage;
