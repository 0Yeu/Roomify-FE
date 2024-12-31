/* eslint-disable no-console */
import React from 'react';
import { MarkerProps } from '@components/Common/MapView';
import { Callout } from 'react-native-maps';
import { Text, View } from 'react-native';
import ImageSource from '@images';
import PriceMarker from '../containers/PriceMarker';

export const customMarker: Array<MarkerProps> = [
  {
    coordinate: {
      latitude: 16.057079,
      longitude: 108.186230,
    },
    title: 'This is a title',
    description: 'This is a description',
  },
  {
    coordinate: {
      latitude: 16.067090,
      longitude: 108.216250,
    },
    draggable: true,
    onSelect: ((e) => console.log('onSelect', e)),
    onDrag: ((e) => console.log('onDrag', e)),
    onDragStart: ((e) => console.log('onDragStart', e)),
    onDragEnd: ((e) => console.log('onDragEnd', e)),
    onPress: ((e) => console.log('onPress', e)),
    children: (
      <Callout style={{ width: 180 }}>
        <View>
          <Text style={{ color: 'orange', textAlign: 'center' }}>This is a custom Callout</Text>
        </View>
      </Callout>
    ),
  },
  {
    coordinate: {
      latitude: 16.027090,
      longitude: 108.196250,
    },
    title: 'This is a title',
    description: 'This is a description',
    children: <PriceMarker amount={100} />,
  },
];

const Images = [
  { image: ImageSource.foodBanner1 },
  { image: ImageSource.foodBanner2 },
  { image: ImageSource.foodBanner3 },
  { image: ImageSource.foodBanner4 },
];

export const bottomItemData = [
  {
    marker: {
      coordinate: {
        latitude: 16.057079,
        longitude: 108.186230,
      },
    },
    data: {
      title: 'Amazing Food Place',
      description: 'This is the best food place',
      image: Images[0].image,
      rating: 4,
      price: 125000,
    },
  },
  {
    marker: {
      coordinate: {
        latitude: 16.060079,
        longitude: 108.195230,
      },
    },
    data: {
      title: 'Second Amazing Food Place',
      description: 'This is the second best food place',
      image: Images[1].image,
      rating: 5,
      price: 270000,
    },
  },
  {
    marker: {
      coordinate: {
        latitude: 16.069090,
        longitude: 108.200250,
      },
    },
    data: {
      title: 'Third Amazing Food Place',
      description: 'This is the third best food place',
      image: Images[2].image,
      rating: 3,
      price: 1400000,
    },
  },
  {
    marker: {
      coordinate: {
        latitude: 16.080090,
        longitude: 108.210250,
      },
    },
    data: {
      title: 'Fourth Amazing Food Place',
      description: 'This is the fourth best food place',
      image: Images[3].image,
      rating: 4,
      price: 18000000,
    },
  },
  {
    marker: {
      coordinate: {
        latitude: 16.065090,
        longitude: 108.210250,
      },
    },
    data: {
      title: 'Fifth Amazing Food Place',
      description: 'This is the fifth best food place',
      image: Images[3].image,
      rating: 4,
      price: 300000,
    },
  },
];
