import React, { useEffect, useRef, useState } from 'react';
import {
  QuickView, Text, Header, Body, Button, Icon, Image,
} from '@components';
import AppHelper from '@utils/appHelper';
import { Animated, FlatList, Platform, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import colors from '@themes/Color/colors';
import AppView from '@utils/appView';
import Carousel, { AdditionalParallaxProps, Pagination, ParallaxImage } from 'react-native-snap-carousel';
import Api from '@utils/api';
import Server from '@utils/server';
import { Overlay } from 'react-native-elements';
import _ from 'lodash';
import { useAppSelector } from '@utils/redux';
import ImageSource from '@images';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props {
  route: any
}
const CAROUSEL_HEIGHT = AppView.screenWidth - 60;
// const images = [
//   'https://picsum.photos/200/300',
//   'https://picsum.photos/200/400',
//   'https://picsum.photos/200/500',
//   'https://picsum.photos/600/300',
//   'https://picsum.photos/250/300',
// ];

const styles = StyleSheet.create({
  item: {
    width: AppView.screenWidth - 60,
    height: AppView.screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

const DetailRoom: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const { id, price, owner } = route.params;
  const scrollY = new Animated.Value(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [errorBooking, setErrorBooking] = useState(null);
  const [overlayIsVisible, setOverlayIsVisible] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>([]);
  const scrollRef = useRef<ScrollView>(null);
  const auth = useAppSelector((state) => state.auth);

  const fetchRoom = async (roomId: number) => {
    try {
      const response = await Api.get(`/rooms/${roomId}`);
      setData(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error :>> ', error);
    }
  };

  const fetchSuggestion = async () => {
    const encodeQuery = Server.stringifyQuery(
      { s: { $and: [
        { price: { $gte: price - 50000 } },
        { price: { $lte: price + 50000 } }] } }
    );
    try {
      const response = await Api.get(`/rooms?${encodeQuery}`);
      setSuggestion(response?.result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error :>> ', error);
    }
  };

  useEffect(() => {
    fetchRoom(id);
    fetchSuggestion();
  }, []);

  const renderItem = ({ item }: { item: any }, parallaxProps: AdditionalParallaxProps) => (
    <QuickView>
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        {/* <Text numberOfLines={2}>{item.title}</Text> */}
      </View>
    </QuickView>
  );

  const renderPagination = () => (
    <Pagination
      dotsLength={data?.images?.length}
      activeDotIndex={activeSlide}
      containerStyle={{
        position: 'absolute', width: '100%', top: AppView.screenWidth - 120,
      }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
      }}
      inactiveDotStyle={{

        // Define styles for inactive dots here
      }}
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  );

  const handlePressItemSuggestion = (id: number) => {
    fetchRoom(id);
    fetchSuggestion();
    setActiveSlide(0);
    scrollRef.current?.scrollTo({ x: 0, y: 0 });
  };

  const renderSuggestionItem = ({ item }: { item: any }) => (
    <QuickView
      style={{ width: 140 }}
      onPress={() => handlePressItemSuggestion(item?.id)}
        // onPress={() => this.handleOnPress(item?.id)}
      marginRight={20}
    >
      <Image
        source={{ uri: item?.images[0] }}
        width={140}
        height={100}
      />
      <QuickView marginTop={15}>
        <Text numberOfLines={2} bold>
          {item?.name}
        </Text>
        <Text marginTop={5}>
          {Math.floor(item?.area)}
          m2
        </Text>
        <Text bold marginTop={5}>
          {AppHelper.convertPrice(item?.price * 10, '.')}
          ₫
        </Text>
      </QuickView>
    </QuickView>
  );

  const handleBooking = async () => {
    setErrorBooking(null);
    try {
      const result = await Api.post('/booking', {
        roomId: id,
      });
      if (result) {
        setOverlayIsVisible(true);
      }
    } catch (error) {
      setErrorBooking(error?.message);
      setOverlayIsVisible(true);
    }
  };

  const renderRightComponent = () => (
    <QuickView onPress={() => NavigationService.navigate(Routes.VIEW_360_DEGREES_IMAGE)}>
      <Image source={ImageSource.image360Degrees} style={{ tintColor: 'red' }} width={24} height={24} />
    </QuickView>
    // <QuickView backgroundColor="red" height={24} width={24}>
    //   {/* <Text>123</Text> */}
    //   <Image source={ImageSource.image360Degrees} width={24} height={24} />
    //   {/* <ImageSource.image360Degrees /> */}
    //   {/* <IconSource.Image360DegreesIcon width={24} height={24} /> */}
    // </QuickView>
  );

  return (
    <>
      <Header title="Chi tiết phòng" backIcon rightComponent={renderRightComponent()} />
      <Overlay isVisible={overlayIsVisible} overlayStyle={{ borderRadius: 8, width: '80%' }}>
        <QuickView>
          <Text center color={colors.primary} bold>Thông báo</Text>
          <Text marginVertical={10} center>
            {!_.isNull(errorBooking) ? errorBooking : 'Chủ nhà sẽ liên hệ với bạn trong thời gian sớm nhất'}
          </Text>
          <QuickView paddingHorizontal={80}>
            <Button
              title="Đóng"
              onPress={() => setOverlayIsVisible(false)}
            />
          </QuickView>
        </QuickView>
      </Overlay>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [
                    -CAROUSEL_HEIGHT,
                    0,
                    CAROUSEL_HEIGHT,
                    CAROUSEL_HEIGHT + 1,
                  ],
                  outputRange: [
                    -CAROUSEL_HEIGHT / 2,
                    0,
                    CAROUSEL_HEIGHT * 0.75,
                    CAROUSEL_HEIGHT * 0.75,
                  ],
                }),
              },
              {
                scale: scrollY.interpolate({
                  inputRange: [
                    -CAROUSEL_HEIGHT,
                    0,
                    CAROUSEL_HEIGHT,
                    CAROUSEL_HEIGHT + 1,
                  ],
                  outputRange: [2, 1, 0.5, 0.5],
                }),
              },
            ],
          }}
        >
          <Carousel
            sliderWidth={AppView.screenWidth}
            sliderHeight={AppView.screenWidth}
            itemWidth={AppView.screenWidth - 60}
            data={data?.images}
            // @ts-ignore
            renderItem={renderItem}
            hasParallaxImages
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          {renderPagination()}
        </Animated.View>
        <Body style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5, }}
        >
          <Text marginTop={20} bold fontSize={18}>
            {data?.name}
          </Text>
          <QuickView marginTop={10} row center>
            <Text>GIÁ PHÒNG: </Text>
            <Text color={colors.primary}>
              {AppHelper.vndPriceFormat(data?.price * 10)}
              {' '}
              VND
            </Text>
          </QuickView>
          <QuickView paddingVertical={20} style={{ borderBottomWidth: 1, borderColor: '#B1ADAD' }} row>
            <QuickView center flex={1}>
              <Text>Trạng thái</Text>
              <Text color={colors.primary}>{data?.status}</Text>
            </QuickView>
            <QuickView center flex={1}>
              <Text>Diện tích</Text>
              <Text color={colors.primary}>
                {Math.floor(data?.area)}
                {' '}
                m2
              </Text>
            </QuickView>
          </QuickView>
          {/* Mô tả */}
          <QuickView paddingVertical={20}>
            <Text bold>Mô tả</Text>
            <Text marginTop={10}>{data?.description}</Text>
          </QuickView>
          {/* Tiện ích */}
          <QuickView paddingVertical={20}>
            <Text bold>Tiện ích</Text>
            <QuickView paddingVertical={10} style={{ flexWrap: 'wrap' }} row>
              {data?.amenities.map((a: any) => (
                <QuickView key={a?.id} marginVertical={5} width="45%" alignItems="center" padding={5} row>
                  <Icon name={a?.iconName} type={a?.iconType} />
                  <Text marginLeft={5}>{a?.name}</Text>
                </QuickView>
              ))}
            </QuickView>
          </QuickView>
          {/* Map */}
          <QuickView
            style={{
            // ...StyleSheet.absoluteFillObject,
              height: 300,
              // width: 400,
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderRadius: 10,
            }}
          >
            <MapView
              style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
              region={{
                latitude: 16.06375,
                longitude: 108.17969,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker
              // style={{ borderWidth: 1 }}
              // key={marker.name}
              // ref={(ref) => { markers[index] = ref; }}
                  // onPress={() => this.onMarkerPressed(marker, index)}
                coordinate={{
                  latitude: 16.06375,
                  longitude: 108.17969,
                }}
              >
                <QuickView center backgroundColor="'rgba(220,47,48,0.2)'" width={100} height={100} borderRadius={50}>
                  <QuickView center backgroundColor="'rgba(220,47,48,0.8)'" width={50} height={50} borderRadius={25}>
                    <Icon color={colors.white} name="home" type="antdesign" />
                  </QuickView>
                </QuickView>
              </Marker>
            </MapView>
            <QuickView
              activeOpacity={1}
                // onPress={() => NavigationService.navigate(exploreStack.mapDetailRoom)}
              style={{
                flex: 1,
                ...StyleSheet.absoluteFillObject,
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            />

            {/* <Button
              marginVertical={10}
              title="Xem bản đồ"
              onPress={() => NavigationService.navigate(exploreStack.mapDetailRoom)}
            /> */}
          </QuickView>
          {/* <Button
            marginVertical={10}
            title="Xem bản đồ"
            onPress={() => NavigationService.navigate(exploreStack.mapDetailRoom)}
          /> */}
          {/* Gợi ý */}
          <QuickView paddingVertical={20}>
            <Text bold>Gợi ý</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ marginTop: 20 }}
              data={suggestion}
              renderItem={renderSuggestionItem}
            />
          </QuickView>
        </Body>

      </Animated.ScrollView>
      <QuickView
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
          paddingBottom: 20,
          paddingTop: 10,
        }}
        backgroundColor="#FFFFFF"
        justifyContent="space-around"
        alignItems="center"
        row
      >
        {/* <Button
          width={100}
          marginTop={20}
          titleStyle={{ fontWeight: 'bold' }}
          title="Save"
          onPress={this.handleBooking}
        /> */}
        <QuickView center row>
          <Text bold>
            {AppHelper.convertPrice(data?.price * 10, '.')}
            ₫
          </Text>
          <Text>/ 1 tháng</Text>
        </QuickView>
        <Button disabled={auth?.loginData?.id === owner?.id} titleStyle={{ fontWeight: 'bold' }} title="Booking" onPress={handleBooking} />
      </QuickView>
    </>
  );
};

export default DetailRoom;
