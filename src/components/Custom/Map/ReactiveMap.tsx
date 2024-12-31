/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { ListRenderItem, View, Animated, Platform } from 'react-native';
import Text from '@components/Common/Text';
import MapView, { LATITUDE_DELTA, LONGITUDE_DELTA, MapViewProps, MarkerProps } from '@components/Common/MapView';
import Image from '@components/Common/Image/DefaultImage';
import _ from 'lodash';
import AppView from '@utils/appView';
import { TArray } from '@utils/appHelper';
import { TQuery } from '@utils/server';
import { Marker } from 'react-native-maps';
import ImageSource from '@images';
import { Theme, withTheme } from 'react-native-elements';

interface IMapItem {
  marker: MarkerProps;
  data: any;
}

interface Props extends MapViewProps {
  renderBottomItem?: ListRenderItem<any>;
  bottomItemGetList?: (query?: TQuery) => any;
  bottomItemData?: Array<IMapItem>;
  bottomItemList?: TArray;
  animationEnable?: boolean;
  markerType?: 'default' | 'tag';
  bottomMarkerData?: Array<string>;
  markerActiveBackgroundColor?: any;
}
interface State {
  scrollX: Animated.Value,
  viewableIndex: number,
  onMomentumScrollEnd: boolean,
}

const SPACING_FOR_CARD_INSET = AppView.screenWidth * 0.1 - 30;
const CARD_WIDTH = 250;
const CARD_HEIGHT = 250;

class ReactiveMap extends PureComponent<Props & { theme: Theme }, State> {
  static defaultProps = {
    animationEnable: true,
    markerType: 'default',
  };

  bottomFlatListRef: any;

  mapRef: any;

  constructor(props: any) {
    super(props);
    // @ts-ignore
    const { forwardedRef } = this.props;
    this.mapRef = forwardedRef || React.createRef();
    this.bottomFlatListRef = React.createRef();

    this.state = {
      scrollX: new Animated.Value(0),
      viewableIndex: 0,
      onMomentumScrollEnd: true,
    };
  }

  componentDidMount() {
    const {
      bottomItemList,
      bottomItemGetList,
    } = this.props;
    if (bottomItemList && bottomItemGetList) {
      bottomItemGetList();
    }
  }

  customRenderBottomItem = (props: any) => {
    const { renderBottomItem } = this.props;
    if (renderBottomItem) {
      return (
        <View
          style={{
            // borderTopLeftRadius: 5,
            // borderTopRightRadius: 5,
            margin: 10,
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            overflow: 'hidden',
          }}
        >
          {renderBottomItem(props)}
        </View>
      );
    }
    return null;
  };

  onViewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
    const { viewableIndex } = this.state;
    if (!_.isEmpty(viewableItems)) {
      if (viewableItems[0].index !== viewableIndex) {
        this.setState({
          viewableIndex: viewableItems[0].index,
        });
        this.animateToRegion(viewableItems[0].index);
      }
    }
  };

  animateToRegion = (index: number) => {
    const { bottomItemData, bottomItemList } = this.props;
    const bottomData = bottomItemData || bottomItemList?.data;
    const { coordinate } = bottomData[index].marker;

    this.mapRef.current.animateToRegion(
      {
        ...coordinate,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    );
  };

  refreshBottomFlatList = () => {
    const { bottomItemList, bottomItemGetList } = this.props;
    if (bottomItemList && bottomItemGetList) {
      bottomItemGetList();
    }
  };

  onBottomItemMarkerPress = (mapEventData: any) => {
    const {
      bottomItemData, bottomItemList,
    } = this.props;
    if ((bottomItemList || bottomItemData)
    && (!_.isEmpty(bottomItemData) || !_.isEmpty(bottomItemList?.data))) {
    // eslint-disable-next-line no-underscore-dangle
      const markerID = mapEventData._targetInst.return.key;
      // let x = (markerID * CARD_WIDTH) + (markerID * 20);
      // if (Platform.OS === 'ios') {
      //   x -= SPACING_FOR_CARD_INSET;
      // }
      const extraX = (1 - CARD_WIDTH / AppView.screenWidth) / 2 + 0.08;
      const index = markerID >= 1 ? markerID - extraX : 0;
      if (markerID) {
        this.setState({ onMomentumScrollEnd: false });
        this.bottomFlatListRef.current.scrollToIndex({
          animated: true,
          index,
        });
      }
    }
  };

  renderBottomFlatList = () => {
    const {
      bottomItemData, bottomItemList, animationEnable, markerType,
    } = this.props;
    const { scrollX } = this.state;

    if ((bottomItemList || bottomItemData)
    && (!_.isEmpty(bottomItemData) || !_.isEmpty(bottomItemList?.data))
    ) {
      return (
        <Animated.FlatList
          ref={this.bottomFlatListRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          snapToAlignment="center"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingVertical: 10,
          }}
          contentInset={{
            top: 0,
            left: SPACING_FOR_CARD_INSET,
            bottom: 0,
            right: SPACING_FOR_CARD_INSET,
          }}
          contentContainerStyle={{
            paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
          }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              // useNativeDriver === true only effects on transform & opacity
              useNativeDriver: !animationEnable && markerType !== 'default',
            },
          )}
          onResponderGrant={() => this.setState({ onMomentumScrollEnd: false })}
          onMomentumScrollEnd={() => this.setState({ onMomentumScrollEnd: true })}
          data={bottomItemData || bottomItemList?.data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.customRenderBottomItem}
        />
      );
    }
    return null;
  };

  renderBottomFlatListMarker = () => {
    const {
      bottomItemData,
      bottomItemList,
      bottomMarkerData,
      markerType,
      markerActiveBackgroundColor,
      animationEnable,
      theme,
    } = this.props;
    const { scrollX, viewableIndex, onMomentumScrollEnd } = this.state;

    if ((bottomItemList || bottomItemData)
    && (!_.isEmpty(bottomItemList?.data) || !_.isEmpty(bottomItemData))) {
      const bottomData = bottomItemData || bottomItemList?.data;
      const markerInactiveBackgroundColor = theme.colors.white;
      const interpolations = bottomData.map((item: any, index: number) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH - 30,
          index * CARD_WIDTH - 30,
          (index + 1) * CARD_WIDTH - 30,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [1, markerType === 'default' ? 1.5 : 1.1, 1],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [-0.2, 1.2, -0.2],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            markerInactiveBackgroundColor,
            markerActiveBackgroundColor,
            markerInactiveBackgroundColor,
          ],
        });

        return {
          scale,
          backgroundColor,
          opacity,
        };
      });
      const CustomView: any = animationEnable ? Animated.View : View;

      return bottomData.map((item: any, index: number) => {
        /**
         * animatedStyle
         */
        const {
          scale,
          backgroundColor: animatedBackgroundColor,
          opacity: animatedOpacity,
        } = interpolations[index];

        const scaleStyle = animationEnable ? {
          transform: [
            {
              scale,
            },
          ],
        } : {
          transform: [
            {
              scale: (markerType === 'default' && onMomentumScrollEnd && viewableIndex === index) ? 1.5 : 1.1,
            },
          ],
        };
        const backgroundColor = animationEnable
          ? animatedBackgroundColor
          : ((onMomentumScrollEnd && viewableIndex === index)
            ? markerActiveBackgroundColor
            : markerInactiveBackgroundColor);
        const opacity = animationEnable
          ? animatedOpacity
          : ((onMomentumScrollEnd && viewableIndex === index)
            ? 1
            : 0);

        /**
         * markerType === 'default' || 'tag'
         */
        switch (markerType) {
          case 'tag':
            return (
              <Marker
                key={index.toString()}
                coordinate={item.marker.coordinate}
                onPress={(e) => this.onBottomItemMarkerPress(e)}
              >
                <View style={{ padding: 5 }}>
                  <CustomView style={[{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 30,
                    borderRadius: 10,
                    backgroundColor,
                  }, AppView.shadow]}
                  >
                    <CustomView style={[
                      scaleStyle,
                    ]}
                    >
                      {bottomMarkerData ? (
                        <Text style={{ fontSize: 11 }}>
                          {bottomMarkerData[index]}
                        </Text>
                      ) : null }
                    </CustomView>
                  </CustomView>
                  <CustomView style={[AppView.shadow]}>
                    <CustomView style={{
                      width: 0,
                      height: 0,
                      alignSelf: 'center',
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderLeftWidth: 10,
                      borderRightWidth: 10,
                      borderBottomWidth: 10,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderBottomColor: backgroundColor,
                      opacity,
                      transform: [
                        { rotate: '180deg' },
                      ],
                    }}
                    />
                  </CustomView>
                </View>
              </Marker>
            );
          default:
            return (
              <Marker
                key={index.toString()}
                coordinate={item.marker.coordinate}
                onPress={(e) => this.onBottomItemMarkerPress(e)}
              >
                <CustomView style={[{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                }, scaleStyle]}
                >
                  <Image
                    source={ImageSource.mapMarker}
                    style={[{
                      width: 30,
                      height: 30,
                    }]}
                    resizeMode="cover"
                  />
                </CustomView>
              </Marker>
            );
        }
      });
    }
    return null;
  };

  render() {
    const {
      bottomItemData,
      bottomItemList,
      bottomMarkerData,
      markerType,
      markerActiveBackgroundColor,
      animationEnable,
      ...mapViewProps
    } = this.props;
    return (
      <>
        <MapView ref={this.mapRef} {...mapViewProps}>
          {this.renderBottomFlatListMarker()}
        </MapView>
        {this.renderBottomFlatList()}
      </>
    );
  }
}

const ReactiveMapWithRef = React.forwardRef((props: any, ref) => (
  <ReactiveMap {...props} forwardedRef={ref} />
));

export default withTheme(ReactiveMapWithRef as any, '') as unknown as React.ComponentClass<Props>;
