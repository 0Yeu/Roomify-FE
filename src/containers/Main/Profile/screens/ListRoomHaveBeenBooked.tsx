import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Image, Loading, ErrorText, Icon,
} from '@components';
import AppHelper from '@utils/appHelper';
import useFetchPagination from '@src/hooks/useFetchPagination';
import colors from '@themes/Color/colors';
import { FlatList, RefreshControl, TouchableOpacity, Image as RNImage } from 'react-native';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import moment from 'moment';
import Api from '@utils/api';
import Server from '@utils/server';

interface Props{}

const ListRoomHaveBeenBooked: React.FC<Props> = () => {
  // const limit = 0;
  const [toggleReload, setToggleReload] = useState(0);
  // const [data, setData] = useState([]);
  // const [metadata, setMetadata] = useState<any>(null);
  // const [loading, setLoading] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefresh] = useState(false);

  const defaulQuery = { limit: 0 };
  const [data, loading, error, metadata, getLoadMore] = useFetchPagination('booking/mine/booked', [], defaulQuery, 'result', [toggleReload]);

  // const fetchLsRoomHaveBeenBooked = async () => {
  //   try {
  //     setLoading(true)
  //     const queryString = Server.stringifyQuery({ limit, offset: page * limit } as any);
  //     const response = await Api.get(`/booking/mine/booked?${queryString}`);
  //     const { page: resPage, total, pageCount, count } = response;
  //     const dataGet = response?.result;
  //     let dataCopy = dataGet;
  //     if (page) {
  //       const currentPage = response?.page;
  //       dataCopy = currentPage === 1 || !currentPage
  //         ? dataGet
  //         : data.concat(
  //           dataGet.filter(
  //             (item: any) => data.indexOf(item) < 0,
  //           ),
  //         );
  //     }
  //     // if (response?.result?.length > 0) {
  //     //   setData(response?.result);
  //     // }
  //     setData(dataCopy);
  //     setMetadata({ page: resPage, pageCount, total, count });
  //     // setRefreshing(false);
  //   } catch (error) {
  //     // setRefreshing(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLsRoomHaveBeenBooked();
  // }, [toggleReload]);

  const renderItem = ({ item }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id)}
      style={{ marginBottom: 30 }}
    >
      <RNImage source={{ uri: item?.room?.images[0] }} style={{ height: 160, borderRadius: 10 }} />
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
          color={colors.primary}
        >
          {`Tên: ${item?.user?.fullName} - SDT: ${item?.user?.phone}
Ngày đặt: ${moment(item?.createdAt).format('DD/MM/YYYY')}`}
        </Text>
      </QuickView>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    console.log('handleLoadMore');
    if (data?.length < metadata?.total) {
      console.log('handleLoadMore inside');
      // setPage(page + 1);
      // setToggleReload(Math.random());
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
      // if (error) return <ErrorText error={error} />;
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
      <Header backIcon tTitle="profile:room_is_booked" />
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

export default ListRoomHaveBeenBooked;
