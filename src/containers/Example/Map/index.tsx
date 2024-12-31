/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import {
  QuickView, Header, Body, MapView, Text, ReactiveMap,
} from '@components';
import { View, Image, TouchableOpacity, Switch } from 'react-native';
import Helper from '@utils/helper';
import ImageSource from '@images';
import BottomSheetMap from '@components/Custom/Map/BottomSheetMap';
import { useTheme } from 'react-native-elements';
import { customMarker, bottomItemData } from './mock/data';
import Section from '../Section';

export default function MapExample() {
  let id = 0;
  const mapRef = useRef<any>(null);
  const [useBottomSheetMap, setUseBottomSheetMap] = useState(false);
  const [events, setEvents] = useState([] as any);
  const { theme } = useTheme();

  const renderBottomItem = ({ item }: { item: any }) => (
    <View style={{ backgroundColor: theme.colors.white }}>
      <Image
        source={item.data.image}
        style={{
          width: '100%',
          height: '60%',
          alignSelf: 'center',
        }}
        resizeMode="cover"
      />
      <View style={{
        padding: 10,
      }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            // marginTop: 5,
            fontWeight: 'bold',
          }}
        >
          {item.data.title}

        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            color: theme.colors.grey1,
          }}
        >
          {item.data.description}
        </Text>
        <View style={{
          alignItems: 'center',
          marginTop: 5,
        }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={[{
              width: '100%',
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 3,
            }, {
              borderColor: '#FF6347',
              borderWidth: 1,
            }]}
          >
            <Text style={[{
              fontSize: 14,
              fontWeight: 'bold',
            }, {
              color: '#FF6347',
            }]}
            >
              Order Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const makeEvent = (e: any, name: string) => ({
    // eslint-disable-next-line no-plusplus
    id: id++,
    name,
    data: e.nativeEvent ? e.nativeEvent : e,
  });

  const onRegionChangeComplete = async () => {
    const mapBoundaries = await mapRef.current.getMapBoundaries();
    console.log('mapBoundaries', mapBoundaries);
  };

  const recordEvent = (name: string) => async (e: any) => {
    if (e.persist) {
      e.persist(); // Avoids warnings relating to https://fb.me/react-event-pooling
    }
    const newEvents = [makeEvent(e, name), ...events.slice(0, 10)];
    setEvents(newEvents);
    console.log('state.events', events);
  };

  const bottomMarkerData = Helper.selectDeepField(bottomItemData, 'price');
  bottomMarkerData.forEach((item: string, index: number) => {
    bottomMarkerData[index] = `${Helper.numberWithCommas(parseInt(item, 10))} \u20AB`;
  });

  if (useBottomSheetMap) {
    return (
      <>
        <Header
          title="Map"
          onPressBackIcon={() => setUseBottomSheetMap(!useBottomSheetMap)}
          backIcon
          switchTheme
        />
        <BottomSheetMap />
      </>
    );
  }
  return (
    <>
      <Header customType="example" title="Map" />
      <Body scrollable fullWidth>
        <QuickView center marginVertical={20} row>
          <Text h3 marginRight={10} bold>Open BottomSheet Map</Text>
          <Switch
            onValueChange={() => setUseBottomSheetMap(!useBottomSheetMap)}
            value={useBottomSheetMap}
          />
        </QuickView>
        <Section title="Default Map">
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>No GPS Required</Text>
            <MapView
              defaultMarkerProps={{
                title: 'This is a title',
                description: 'This is a description',
              }}
              needGPS={false}
            />
          </QuickView>
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Static Map</Text>
            <MapView staticMap showDefaultMarker={false} />
          </QuickView>
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Google Map</Text>
            <MapView
              provider="google"
              defaultMarkerProps={{
                title: 'This is a title',
                description: 'This is a description',
              }}
            />
          </QuickView>
          <QuickView marginVertical={8} center>
            <Text h3 center bold marginVertical={5}>{'Map with custom \n initialRegion & events'}</Text>
            <MapView
              ref={mapRef}
              defaultMarkerProps={{
                title: 'This is a title',
                description: 'This is a description',
                onPress: recordEvent('Marker::onPress'),
                onSelect: recordEvent('Marker::onSelect'),
                onDeselect: recordEvent('Marker::onDeselect'),
                onCalloutPress: recordEvent('Marker::onCalloutPress'),
              }}
              onRegionChange={recordEvent('Map::onRegionChange')}
              onRegionChangeComplete={async () => {
                recordEvent(
                  'Map::onRegionChangeComplete',
                );
                await onRegionChangeComplete();
              }}
              onPress={recordEvent('Map::onPress')}
              onPanDrag={recordEvent('Map::onPanDrag')}
              onLongPress={recordEvent('Map::onLongPress')}
              onMarkerPress={recordEvent('Map::onMarkerPress')}
              onMarkerSelect={recordEvent('Map::onMarkerSelect')}
              onMarkerDeselect={recordEvent('Map::onMarkerDeselect')}
              onCalloutPress={recordEvent('Map::onCalloutPress')}
              initialRegion={{
                latitude: 20.53,
                longitude: 105.44,
              }}
            />
          </QuickView>

        </Section>
        <Section title="Custom Map">
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Map with custom marker image</Text>
            <MapView defaultMarkerProps={{
              title: 'This is a title',
              description: 'This is a description',
              image: ImageSource.flagBlue,
            }}
            />
          </QuickView>

          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Map with Custom Marker List</Text>
            <MapView
              showsMyLocationButton={false}
              showDefaultMarker={false}
              markers={customMarker}
            />
          </QuickView>
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Hybrid Map</Text>
            <MapView mapType="hybrid" />
          </QuickView>
          <QuickView marginVertical={8} center>
            <Text h3 bold marginVertical={5}>Satellite Map with Custom Style</Text>
            <MapView mapType="satellite" style={{ borderRadius: 20 }} />
          </QuickView>
        </Section>
        <Section title="FullScreen Map">
          <QuickView marginVertical={8} center>
            <ReactiveMap
              fullScreen
              staticMap
              showDefaultMarker={false}
              bottomItemData={bottomItemData}
              bottomMarkerData={bottomMarkerData}
              markerType="tag"
              // provider="google"
              // animationEnable={false}
              markerActiveBackgroundColor="#74A7A8"
              renderBottomItem={renderBottomItem}
            />
          </QuickView>
        </Section>
      </Body>
    </>
  );
}
