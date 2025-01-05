import Routes from '@containers/routes';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import ChatRoom from '../Chat/ChatRoom';
import DetailProperty from './screens/DetailProperty';
import DetailRoom from './screens/DetailRoom';
import MapProperties from './screens/MapProperties';
import PropertyByCategory from './screens/PropertyByCategory';
import PropertyByCity from './screens/PropertyByCity';
import PropertyNearMe from './screens/PropertyNearMe';
import SearchScreen from './screens/SearchScreen';
import View360DegreesImage from './screens/View360DegreesImage';

const Stack = createStackNavigator();

export default function ExploreStack() {
  return (
    <>
      <Stack.Screen name={Routes.CHAT_ROOM} component={ChatRoom} />
      <Stack.Screen name={Routes.DETAIL_PROPERTY} component={DetailProperty} />
      <Stack.Screen name={Routes.DETAIL_ROOM} component={DetailRoom} />
      <Stack.Screen name={Routes.PROPERTY_BY_CATEGORY} component={PropertyByCategory} />
      <Stack.Screen name={Routes.PROPERTY_BY_CITY} component={PropertyByCity} />
      <Stack.Screen name={Routes.SEARCH_SCREEN} component={SearchScreen} />
      <Stack.Screen name={Routes.MAP_PROPERTIES} component={MapProperties} />
      <Stack.Screen name={Routes.VIEW_360_DEGREES_IMAGE} component={View360DegreesImage} />
      <Stack.Screen name={Routes.PROPERTY_NEAR_ME} component={PropertyNearMe} />
    </>
  );
}
