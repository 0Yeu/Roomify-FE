import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Image, Button, Avatar, Loading,
} from '@components';
import AppHelper, { IBase } from '@utils/appHelper';
import colors from '@themes/Color/colors';
import AppView from '@utils/appView';
import { Animated } from 'react-native';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import Api from '@utils/api';
import moment from 'moment';
import WishlistIcon from '../components/WishlistIcon';

interface Props extends IBase {
  route: any
}

const DetailProperty: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const passData = route?.params;
  const [data, setData] = useState<any>(null);
  const [lsRoom, setLsRoom] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const deltaY = new Animated.Value(0);
  const heightImageBanner = 300;
  const heightHeader = AppView.headerHeight;
  const marginTopBanner = heightImageBanner - heightHeader - AppView.safeAreaInsets.top + 15;

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/properties/${passData}`);
      setData(response);
      setLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error :>> ', error);
      setLoading(false);
    }
  };

  const fetchListRoom = async () => {
    try {
      const response = await Api.get(`/properties/${passData}/rooms`);
      if (response?.result?.length > 0) {
        setLsRoom(response?.result);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error :>> ', error);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchListRoom();
  }, []);

  const renderItem = (item: any, index: number) => (
    <QuickView
      onPress={() => NavigationService.navigate(
        Routes.DETAIL_ROOM, { id: item?.id, price: item?.price, owner: data?.owner }
      )}
      key={item?.id || index}
      row
      height={100}
      marginTop={30}
      backgroundColor={colors.white}
      borderRadius={10}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
      }}
    >
      <QuickView width={100}>
        <Image
          width={100}
          height={100}
          sharp
          style={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          source={{ uri: item?.images?.length > 0 ? item?.images[0] : `https://picsum.photos/${300 * index}` }}
        />
      </QuickView>
      <QuickView borderRadius={10} justifyContent="space-between" flex={1}>
        <QuickView padding={10} flex={1} height={55}>
          <Text numberOfLines={2} fontSize={16} bold>
            {item?.name || '-'}
          </Text>
          {/* <Text fontSize={10} numberOfLines={1} marginTop={5}>
            {item?.address}
          </Text> */}
        </QuickView>
        <QuickView
          row
          backgroundColor="#E6E9F0"
          borderBottomRightRadius={10}
          height={45}
        >
          <QuickView flex={1} center>
            <Text fontSize={12}>Diện tích</Text>
            <Text color={colors.primary} fontSize={12} bold>
              {Math.floor(item?.area)}
              m2
            </Text>
          </QuickView>
          <QuickView flex={1} center>
            <Text fontSize={12}>Giá</Text>
            <Text color={colors.primary} fontSize={12} bold>
              {AppHelper.vndPriceFormat(item?.price * 10)}
            </Text>
          </QuickView>
          <QuickView flex={1} center>
            <Button
              // onPress={() => NavigationService.navigate(
              //   exploreStack.detailRoom,
              //   { id: item?.id, price: item?.price },
              // )}
              clear
              title="Xem thêm"
              height={30}
              titleStyle={{
                fontSize: 12,
                fontWeight: 'bold',
              }}
              titlePaddingVertical={0}
            />
          </QuickView>
        </QuickView>
      </QuickView>
    </QuickView>
  );

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

  const rightComponent = () => (
    <WishlistIcon id={data?.id} active={data?.isFavorited} />
  );

  return (
    <>
      <Animated.Image
          // width={AppView.screenWidth}
        style={[
          {
            height: 300,
            width: '100%',
            position: 'absolute',
          },
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                250,
                250,
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          }
        ]}
        source={{ uri: data?.thumbnail }}
      />
      <Animated.View
        style={{
          backgroundColor: deltaY.interpolate({
            inputRange: [
              0,
              250,
              250,
            ],
            outputRange: ['transparent', colors.primary, colors.primary],
          })
        }}
      >
        <Header
          transparent
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={leftComponent}
          rightComponent={rightComponent()}
        />
      </Animated.View>
      <Body
        scrollable
        showsVerticalScrollIndicator={false}
          // style={{ flex: 1, paddingHorizontal: 20 }}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: { y: deltaY },
            },
          },
        ], {
          useNativeDriver: false
        })}
          // onContentSizeChange={() => {
          //   setHeightHeader(AppView.headerHeight);
          // }}
        scrollEventThrottle={8}
      >
        <QuickView marginTop={marginTopBanner}>
          <QuickView marginBottom={20}>
            <QuickView>
              <Text color={colors.primary} bold fontSize={18} style={{ textAlign: 'justify' }}>{data?.title}</Text>
            </QuickView>
            <QuickView marginTop={0} row justifyContent="space-between">
              <QuickView row center>
                <Text
                  marginTop={10}
                  icon={{
                    name: 'wallet-outline',
                    type: 'ionicon',
                    size: 14,
                  }}
                  bold
                  color={colors.primary}
                  fontSize={14}
                >
                  {data?.averagePrice ? AppHelper.vndPriceFormat(data?.averagePrice * 10) : 'Đang cập nhật'}
                </Text>
              </QuickView>
              <QuickView row center>
                <Text
                  marginTop={10}
                  icon={{
                    name: 'calendar-outline',
                    type: 'ionicon',
                    size: 14,
                  }}
                  bold
                  color={colors.primary}
                  fontSize={14}
                >
                  {data?.updatedAt ? moment(data?.updatedAt).format('DD/MM/YYYY') : 'Đang cập nhật'}
                </Text>
              </QuickView>
              <QuickView
                backgroundColor={colors.primary}
                center
                paddingHorizontal={24}
                paddingVertical={5}
                borderRadius={15}
              >
                <Text color={colors.white} bold fontSize={12}>
                  {data?.category?.name}
                </Text>
              </QuickView>
            </QuickView>
          </QuickView>
          <QuickView>
            <Text color={colors.primary} bold>Địa chỉ</Text>
            <Text>Đang cập nhật</Text>
          </QuickView>
          <QuickView marginTop={10}>
            <Text color={colors.primary} bold>Mô tả</Text>
            <Text>{data?.description || 'Đang cập nhật'}</Text>
          </QuickView>
          <QuickView verticalCenter row height={50} marginTop={10}>
            <QuickView flex={1}>
              <Text color={colors.primary} bold>{`Sở hữu bởi ${data?.owner?.fullName || 'Đang cập nhật'}`}</Text>
              <Text>Tham gia ngày 08/06/2020</Text>
            </QuickView>
            <QuickView>
              <Avatar
                size="medium"
                rounded
                source={{ uri: data?.owner?.avatar }}
              />
            </QuickView>
          </QuickView>
          <QuickView marginTop={10}>
            <Text color={colors.primary} bold>Danh sách phòng</Text>

            {(lsRoom || [])?.length > 0
            && lsRoom?.map((i: any, index: number) => renderItem(i, index))}
          </QuickView>
          {/* <HTML
                classesStyles={{ content: { color: lightPrimaryColor } }}
                html={`<div class="content">${'data?.content'}</div>`}
              /> */}
        </QuickView>
      </Body>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default DetailProperty;
