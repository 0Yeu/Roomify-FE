import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Image,
} from '@components';
import AppHelper from '@utils/appHelper';
import useFetchPagination from '@src/hooks/useFetchPagination';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';
import { TQuery } from '@utils/server';
import { NavigationService } from '@utils/navigation';
import { DeviceEventEmitter, TouchableOpacity } from 'react-native';
import colors from '@themes/Color/colors';
import { useAppSelector } from '@utils/redux';
import Routes from '@containers/routes';
import { EVENT_APP_EMIT } from '@utils/constant';

interface Props {}

const MyProperties: React.FC<Props> = (props: Props) => {
  const loginData = useAppSelector((state) => state.auth.loginData);
  const [toggleReload, setToggleReload] = useState(0);

  let defaulQuery: any;
  const [data, loading, error, metadata, getLoadMore] = useFetchPagination(`owners/${loginData?.id}/properties`, [], defaulQuery, 'result', [toggleReload]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EVENT_APP_EMIT.RELOAD_MY_PROPERTIES,
      () => {
        setToggleReload(Math.random());
      },
    );
    return () => {
      subcribe.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ marginBottom: 30 }}
      onPress={() => NavigationService.navigate(Routes.MANAGE_DETAIL_PROPERTY, item?.id)}
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
      <Header onPressBackIcon={() => NavigationService.navigate(Routes.PROFILE_SCREEN)} backIcon tTitle="profile:my_room" />
      <Body>
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
      </Body>
    </>
  );
};

export default MyProperties;
