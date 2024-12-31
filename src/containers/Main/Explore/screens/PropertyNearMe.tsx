import React, { useState } from 'react';
import {
  QuickView, Text, Header, Body, Image, ErrorText, Icon, Loading,
} from '@components';
import AppHelper from '@utils/appHelper';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import colors from '@themes/Color/colors';
import useFetchPagination from '@src/hooks/useFetchPagination';
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
const PropertyNearMe: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const passData = route.params;
  console.log('passData :>> ', passData);
  // const [reload, setReload] = useState(1);
  const limit = 10;
  const [toggleReload, setToggleReload] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshing, setRefresh] = useState(false);
  const defaulQuery = { limit };

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination(`properties/near-me?latitude=${passData?.latitude}&longtitude=${passData?.longitude}&sub-district=${passData?.administrativeAreaLevel3 || 'Hòa Khánh'}`, [], defaulQuery, 'result', [], true);

  // console.log('data :>> ', data);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{ marginBottom: 30 }}
      onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id)}
      // onPress={() => NavigationService.navigate(rootStack.exploreStack, {
      //   screen: exploreStack.detailProperty,
      //   params: setIdIntoParams(item),
      // })}
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

  const handleLoadMore = () => {
    console.log('handleLoadMore');
    if (data?.length < metadata?.total) {
      if (getLoadMore && metadata && !loading) {
        getLoadMore({ ...defaulQuery, offset: (page + 1) * limit });
        setPage(page + 1);
      }
    }
  };

  const onRefresh = () => {
    // setPreventLoadmore(false)
    setPage(0);
    // setRefresh(true);
    setToggleReload(Math.random());
  };

  const renderEmpty = () => {
    // const { loading, horizontal, error } = this.props;
    if (!loading) {
      if (error) return <ErrorText error={error} />;
      return (
        <QuickView center>
          <QuickView marginVertical={10}>
            <Icon
              name="exclamationcircleo"
              type="antdesign"
              size={30}
            />
          </QuickView>
          <Text tText="component:flat_list:empty" marginBottom={10} />
        </QuickView>
      );
    }
    return (
      <QuickView flex={1} center>
        <Loading />
      </QuickView>
    );
  };

  return (
    <>
      <Header backIcon title="Khu trọ gần tôi" />
      <Body>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item?.id}` || index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
          ListEmptyComponent={renderEmpty()}
        />
      </Body>
    </>
  );
};

export default PropertyNearMe;
