import React, { useState } from 'react';
import {
  QuickView, Text, Header, Body, Image,
} from '@components';
import AppHelper from '@utils/appHelper';
import { TouchableOpacity } from 'react-native';
import colors from '@themes/Color/colors';
import useFetchPagination from '@src/hooks/useFetchPagination';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';
import { TQuery } from '@utils/server';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props {
  route: any
}
const DATA = [
  {
    id: '9292292',
    thumbnail:
        'https://picsum.photos/1300/1500',
    address: '252 1st Avenue',
    price: 499,
    totalBed: 4,
    totalBath: 2,
  },
  {
    id: '929221929',
    thumbnail:
        'https://picsum.photos/1500/1200',
    address: '252 1st Avenue',
    price: 499,
    totalBed: 4,
    totalBath: 2,
  },
  {
    id: '9292229',
    thumbnail:
        'https://picsum.photos/1500/1100',
    address: '252 1st Avenue',
    price: 499,
    totalBed: 4,
    totalBath: 2,
  },
  {
    id: '92922929',
    thumbnail:
        'https://picsum.photos/1000/1500',
    address: '252 1st Avenue',
    price: 499,
    totalBed: 4,
    totalBath: 2,
  },
];
const PropertyByCity: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const passData = route.params;
  console.log('passData :>> ', passData);
  // const [reload, setReload] = useState(1);
  const defaulQuery = { s: { 'destination.city.id': passData?.id } };

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination('properties', [], defaulQuery, 'result', []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ marginBottom: 30 }}
      onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id)}
    >
      <Image source={{ uri: item.thumbnail }} height={160} />
      <QuickView paddingHorizontal={20}>
        <QuickView
          marginTop={20}
          justifyContent="space-between"
          row
        >
          <QuickView flex={2}>
            <Text bold>
              {item?.title}
            </Text>
          </QuickView>
          <QuickView style={{ borderWidth: 0 }} alignItems="flex-end" flex={1}>
            <Text color={colors.primary}>

              {AppHelper.vndPriceFormat(item?.averagePrice * 10)}
              {' '}
              VND
            </Text>
          </QuickView>
        </QuickView>
        <Text
          marginTop={10}
          icon={{
            name: 'map-pin',
            color: colors.primary,
            type: 'feather',
            size: 13,
          }}
          numberOfLines={1}
          color={colors.primary}
        >
          {`${item?.address}, ${item?.destination?.name}, ${item?.destination?.parent?.name}, ${item?.destination?.parent?.parent?.name}`}
        </Text>
      </QuickView>
    </TouchableOpacity>
  );

  return (
    <>
      <Header backIcon title={passData?.name} />
      <Body>
        <QuickView>
          <DefaultFlatList
            loading={loading}
            data={data}
            error={error}
            metadata={metadata}
            fetchData={(query?: TQuery) => getLoadMore({ ...query, ...defaulQuery })}
            ListHeaderComponentStyle={{ marginBottom: 12 }}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1
            }}
          />
        </QuickView>
      </Body>
    </>
  );
};

export default PropertyByCity;
