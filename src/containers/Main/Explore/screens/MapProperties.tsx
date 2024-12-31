/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import {
  QuickView, Text, Header, Button, Image,
} from '@components';
import MapView, { Callout, Marker } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import { Dimensions, StyleSheet } from 'react-native';
import Server, { TQuery } from '@utils/server';
import colors from '@themes/Color/colors';
import AppHelper from '@utils/appHelper';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import Api from '@utils/api';

const LATITUDE = 16.0544068;
const LONGITUDE = 108.2021667;
const properties1 = [
  {
    title: 'Nearby the beach & Nguyen Tat Thanh street studio',
    latitude: LATITUDE,
    longitude: LONGITUDE,
    thumbnail: 'https://a0.muscache.com/im/pictures/810804f6-7f63-40b9-a9c0-d7468d7de64d.jpg?im_w=720',
    averagePrice: 550000,
    averageArea: 30
  },
  {
    title: '★1BR COSY HOUSE★500m to airport★',
    latitude: LATITUDE + 0.004,
    longitude: LONGITUDE - 0.003,
    thumbnail: 'https://a0.muscache.com/im/pictures/0b282e91-3784-4577-8bd8-23c4e50a6304.jpg?im_w=720',
    averagePrice: 750000,
    averageArea: 30
  },
  {
    title: 'BIG PROMO ❤️ Lil house - Apartment 1',
    latitude: LATITUDE + 0.002,
    longitude: LONGITUDE - 0.006,
    thumbnail: 'https://a0.muscache.com/im/pictures/9a6a5e47-9129-4d7a-9b67-b6645c4ef67c.jpg?im_w=720',
    averagePrice: 850000,
    averageArea: 30
  },
  {
    title: 'Love, Cozy, Quiet#Central City# 5min Dragon Bridge',
    latitude: LATITUDE - 0.004,
    longitude: LONGITUDE - 0.004,
    thumbnail: 'https://a0.muscache.com/im/pictures/12e38142-adf0-49c6-90f9-822aca4f20cb.jpg?im_w=720',
    averagePrice: 1550000,
    averageArea: 30
  },
  {
    title: '5Min to Cathedral STUDIO w/ city view',
    latitude: LATITUDE - 0.008,
    longitude: LONGITUDE - 0.004,
    thumbnail: 'https://a0.muscache.com/im/pictures/b8176838-3107-4ffc-9e3d-9eec09448959.jpg?im_w=720',
    averagePrice: 950000,
    averageArea: 30
  },
];
interface Props {
  route?: any;
  getList: (query ?: TQuery) => any;
  // properties: TArrayRedux;
}
interface State {
  markers: any;
  propertyIndex: number;
  data: Array<any>;
}
class MapProperties extends PureComponent<Props, State> {
  fields = 'id,thumbnail,averagePrice,averageArea,title,longitude,latitude,address';

  carousel: any;

  map: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      markers: [],
      propertyIndex: 0,
      data: []
    };
  }

  componentDidMount() {
    this.fetchProperties();
  }

  fetchProperties = async () => {
    const { route } = this.props;
    const passData = route?.params;
    const query = { s: { $or:
      [
        { address: { $contL: passData } },
        { 'destination.name': { $contL: passData } },
        { 'destination.district.name': { $contL: passData } },
        { 'destination.city.name': { $contL: passData } }
      ] }
    };
    const queryString = Server.stringifyQuery(query);
    try {
      const response = await Api.get(`/properties?${queryString}`);
      this.setState({ data: response?.result });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  renderCarouselItem = ({ item }: { item: any }) => (
    <QuickView
      key={item?.id}
      row
      marginTop={30}
      backgroundColor="#FFFFFF"
      borderRadius={10}
      style={{
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: {
          width: 3,
          height: 7,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,
        elevation: 2.5,
      }}
    >
      <QuickView width={102}>
        <Image
          width={102}
          height={102}
          sharp
          style={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          source={{ uri: item?.thumbnail }}
        />
      </QuickView>
      <QuickView flex={7} height={102}>
        <QuickView marginHorizontal={20} marginTop={10}>
          <Text numberOfLines={1} fontSize={16} bold>
            {item?.title}
          </Text>
          <Text fontSize={10} numberOfLines={1} marginTop={5}>
            {item?.address}
          </Text>
        </QuickView>
        <QuickView
          row
          backgroundColor="#E6E9F0"
          borderBottomRightRadius={10}
          borderTopRightRadius={10}
          marginLeft={0}
          marginTop={10}
          height={46}
        >
          <QuickView flex={1} center>
            <Text fontSize={12}>Diện tích</Text>
            <Text color={colors.primary} fontSize={12} bold>
              {Math.floor(item?.averageArea)}
              m2
            </Text>
          </QuickView>
          <QuickView flex={1} center>
            <Text fontSize={12}>Giá</Text>
            <Text color={colors.primary} fontSize={12} bold>
              {AppHelper.vndPriceFormat(item?.averagePrice * 10)}
            </Text>
          </QuickView>
          <QuickView flex={1} center>
            <Button
              onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id)}
              // onPress={() => NavigationService.navigate(rootStack.exploreStack, {
              //   screen: exploreStack.detailProperty,
              //   params: setIdIntoParams(item),
              // })}
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

  onCarouselItemChange = (index: number) => {
    const { markers, data } = this.state;
    // const { route, properties: { data } } = this.props;
    this.setState({ propertyIndex: index });
    const location = data[index];

    this.map.animateToRegion({
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.0035,
      // latitudeDelta: 1,
      // longitudeDelta: 1,
    });

    markers[index].showCallout();
  };

  onMarkerPressed = (location: any, index: number) => {
    this.map.animateToRegion({
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.0035,
      // latitudeDelta: 1,
      // longitudeDelta: 1,
    });
    this.carousel.snapToItem(index);
  };

  render() {
    const { markers, propertyIndex, data } = this.state;
    // const { route, properties } = this.props;

    return (

      <QuickView style={{ ...StyleSheet.absoluteFillObject }}>
        <Header title="Bản đồ" backIcon />
        <MapView
          ref={(map) => { this.map = map; }}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: data?.length > 0 ? data[0]?.latitude : LATITUDE,
            longitude: data?.length > 0 ? data[0]?.longitude : LONGITUDE,
            // latitude: LATITUDE,
            // longitude: LONGITUDE,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            // latitudeDelta: 1,
            // longitudeDelta: 1,
          }}
        >
          {data?.map((marker: any, index: number) => (
            <Marker
                // style={{ borderWidth: 1 }}
              key={marker?.title}
              ref={(ref) => { markers[index] = ref; }}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker?.latitude,
                longitude: marker?.longitude,
              }}
            >
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
                }}
                padding={7}
                borderRadius={20}
                backgroundColor={propertyIndex === index ? colors.primary : colors.white}
              >
                <Text bold color={propertyIndex === index ? colors.white : colors.primary}>{`${AppHelper.convertPrice(marker?.averagePrice * 10, ',')} ₫`}</Text>
              </QuickView>
              {/* <Callout>
                  <Text>{marker.price}</Text>
                </Callout> */}
            </Marker>
          ))}
        </MapView>
        <Carousel
          ref={(c) => {
            this.carousel = c;
          }}
          data={data}
          containerCustomStyle={{
            position: 'absolute',
            bottom: 0,
            marginBottom: 48,
          }}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width - 40}
          removeClippedSubviews={false}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
        />
      </QuickView>

    );
  }
}

// const mapStateToProps = (state: any) => ({
//   properties: parseArraySelector(applyArraySelector(propertyListSelector, state)),
// });

// const mapDispatchToProps = (dispatch: any) => ({
//   getList: (query ?: TQuery) => dispatch(propertyGetList({ query })),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

export default MapProperties;
