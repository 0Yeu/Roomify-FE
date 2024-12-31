import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Route from '@src/containers/routes';
import ProductListScreen from './screens/ProductList';
import ProductDetailScreen from './screens/ProductDetail';

const Stack = createStackNavigator();

export default function FlatListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Route.exampleStack.flatListStack.productList}
        component={ProductListScreen}
      />
      <Stack.Screen
        name={Route.exampleStack.flatListStack.productDetail}
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
}
