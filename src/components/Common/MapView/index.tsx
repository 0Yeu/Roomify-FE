import React, { PureComponent } from 'react';
import RNMapView, {
  Marker,
  MapViewProps as RNMapViewProps,
  MarkerProps as RNMarkerProps,
} from 'react-native-maps';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import { Theme, withTheme } from 'react-native-elements';
import { NavigationService } from '@utils/navigation';
import AppView from '@utils/appView';
import withPermission from '@components/Hoc/withPermission';
import { PERMISSIONS } from 'react-native-permissions';
import i18next from 'i18next';
import DeviceInfo from 'react-native-device-info';
import QuickView from '../View/QuickView';
import Button from '../Button/DefaultButton';

const ASPECT_RATIO = AppView.screenWidth / AppView.screenHeight;
const LATITUDE = 16.054407;
const LONGITUDE = 108.202164;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface MarkerProps extends RNMarkerProps {
  children?: any;
}

export interface MapViewProps extends Omit<RNMapViewProps, 'initialRegion'> {
  staticMap?: boolean;
  initialRegion?: IRegion;
  width?: number;
  height?: number;
  fullScreen?: boolean;
  showDefaultMarker?: boolean;
  defaultMarkerProps?: Omit<MarkerProps, 'coordinate'>;
  markers?: Array<MarkerProps>;
  backIcon?: boolean;
  requestPermission?: (index?: number) => Promise<any>;
  needGPS?: boolean;
  children?: React.ReactNode;
}
interface State {}

class MapView extends PureComponent<MapViewProps & { forwardedRef: any, theme: Theme }, State> {
  static defaultProps = {
    initialRegion: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    width: 250,
    height: 250,
    showDefaultMarker: true,
    showsUserLocation: true,
    showsMyLocationButton: true,
    loadingEnabled: true,
    needGPS: true,
  };

  async componentDidMount() {
    const {
      requestPermission,
      needGPS,
    } = this.props;
    // Request Permission
    if (needGPS && requestPermission) requestPermission();
  }

  renderMarker = () => {
    const {
      initialRegion: initialRegionProp,
      showDefaultMarker,
      defaultMarkerProps,
      markers,
    } = this.props;
    const initialRegion = _.merge({
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }, initialRegionProp);
    const DefaultMarker: any = showDefaultMarker ? (
      <Marker
        {...defaultMarkerProps}
        coordinate={initialRegion}
      />
    ) : null;

    let CustomMarker: any = null;
    if (markers && !_.isEmpty(markers)) {
      CustomMarker = markers.map((marker: MarkerProps, index: number) => (
        <Marker {...marker} key={index.toString()}>
          {marker.children}
        </Marker>
      ));
    }

    return (
      <>
        {DefaultMarker}
        {CustomMarker}
      </>
    );
  };

  render() {
    const {
      forwardedRef,
      staticMap,
      backIcon,
      scrollEnabled,
      zoomEnabled,
      pitchEnabled,
      rotateEnabled,
      initialRegion: initialRegionProp,
      width: widthProp,
      height: heightProp,
      fullScreen,
      style: styleProp,
      showDefaultMarker,
      defaultMarkerProps,
      markers,
      children,
      theme,
      ...otherProps
    } = this.props;

    /**
     * initialRegion
     */
    const initialRegion = _.merge({
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }, initialRegionProp);

    /**
     * width, height, style
     */
    const width = fullScreen ? AppView.screenWidth : widthProp;
    const height = fullScreen ? AppView.screenHeight : heightProp;
    const style = StyleSheet.flatten([{
      width,
      height,
    },
    styleProp,
    ]);
    const customMapStyle = theme.colors.themeMode === 'dark'
      ? darkMapStyle
      : [];
    const backIconBackgroundColor = theme.colors.themeMode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    const backIconColor = theme.colors.themeMode === 'light' ? 'black' : 'black';
    const userInterfaceStyle = theme.colors.themeMode === 'dark' ? 'dark' : 'light';
    return (
      <>
        <RNMapView
          userInterfaceStyle={userInterfaceStyle}
          {...otherProps}
          ref={forwardedRef}
          scrollEnabled={staticMap ? false : scrollEnabled}
          zoomEnabled={staticMap ? false : zoomEnabled}
          pitchEnabled={staticMap ? false : pitchEnabled}
          rotateEnabled={staticMap ? false : rotateEnabled}
          initialRegion={initialRegion}
          style={style}
          customMapStyle={customMapStyle}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#FFFFFF"
        >
          {this.renderMarker()}
          {children}
        </RNMapView>
        {
          backIcon
            ? (
              <QuickView position="absolute" top={24} left={0}>
                <Button
                  icon={{
                    name: 'arrowleft',
                    type: 'antdesign',
                    size: 25,
                    color: backIconColor,
                  }}
                  width={40}
                  buttonStyle={{ margin: 10 }}
                  iconContainerStyle={{ marginLeft: 0 }}
                  backgroundColor={backIconBackgroundColor}
                  onPress={() => NavigationService.goBack()}
                  circle
                />
              </QuickView>
            )
            : null
        }
      </>
    );
  }
}

export default (
  withPermission(
    [
      {
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        deniedMessage: i18next.t('permission_denied:location', { appName: DeviceInfo.getApplicationName() })
      }
    ],
    false,
  )(withTheme(MapView as any, '') as unknown as React.ComponentClass<MapViewProps>)
);
