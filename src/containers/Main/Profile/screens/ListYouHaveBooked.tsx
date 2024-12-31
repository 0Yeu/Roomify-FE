import React, { useState } from 'react';
import {
  QuickView, Text, Header, Body, Image, Loading, ErrorText, Icon,
} from '@components';
import AppHelper from '@utils/appHelper';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import colors from '@themes/Color/colors';
import moment from 'moment';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import useFetchPagination from '@src/hooks/useFetchPagination';
import { TQuery } from '@utils/server';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';

interface Props {}

const ListYouHaveBooked: React.FC<Props> = () => {
  const limit = 10;
  const [toggleReload, setToggleReload] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshing, setRefresh] = useState(false);
  const defaulQuery = { limit };

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination('booking/mine/booking', [], defaulQuery, 'result', [toggleReload]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id)}
      style={{ marginBottom: 30 }}
    >
      <Image source={{ uri: item?.room?.images[0] }} height={160} />
      <QuickView paddingHorizontal={20}>
        <QuickView
          marginTop={20}
          justifyContent="space-between"
          row
        >
          <QuickView flex={2}>
            <Text bold>
              {item?.room?.name}
            </Text>
          </QuickView>
          <QuickView style={{ borderWidth: 0 }} alignItems="flex-end" flex={1}>
            <Text color={colors.primary}>
              {AppHelper.vndPriceFormat(item?.room?.price * 10)}
              {' '}
              VND
            </Text>
          </QuickView>
        </QuickView>
        <Text
          marginTop={10}
          numberOfLines={1}
          color={colors.primary}
        >
          {`Sở hữu bởi: ${item?.room?.property?.owner?.fullName}- Ngày đặt: ${moment(item?.updatedAt).format('DD/MM/YYYY')}`}
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
      <Header backIcon tTitle="profile:ls_u_have_booked" />
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
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default ListYouHaveBooked;
