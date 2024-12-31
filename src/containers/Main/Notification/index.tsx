import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, ErrorText, Icon, Loading,
} from '@components';
import colors from '@themes/Color/colors';
import moment from 'moment';
import { DeviceEventEmitter, FlatList, RefreshControl } from 'react-native';
import IconSource from '@icons';
import useFetchPagination from '@src/hooks/useFetchPagination';
import { useAppSelector } from '@utils/redux';
import { EVENT_APP_EMIT } from '@utils/constant';

interface Props {}
// const DATA = [
//   {
//     id: 1,
//     title: 'Có khách hàng vừa book trọ của bạn',
//     description: 'Liên hệ với khách hàng sớm nhất có thể để tiến hành cho thuê nhà trọ của bạn',
//     createdAt: '2021-10-15T02:19:57.290Z',
//   },
//   {
//     id: 2,
//     title: 'Bạn đã được duyệt trở thành owner',
//     description: 'Bây giờ bạn có thể giới thiệu phòng trọ của mình đến với mọi người',
//     createdAt: '2021-10-15T03:19:57.290Z',
//   },
// ];
const NotificationScreen: React.FC<Props> = () => {
  const limit = 10;
  const defaulQuery = { limit };
  const loginData = useAppSelector((state) => state.auth.loginData);
  const [toggleReload, setToggleReload] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshing, setRefresh] = useState(false);

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination('notifications/mine', [], defaulQuery, 'result', [toggleReload, loginData]);
  // console.log('data :>> ', data);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EVENT_APP_EMIT.RELOAD_SAVED,
      () => {
        setToggleReload(Math.random());
      },
    );
    return () => {
      subcribe.remove();
    };
  }, []);
  // console.log('data :>> ', data);

  const renderItem = ({ item }: { item: any }) => (
    <QuickView
      row
      onPress={() => {}}
      marginBottom={30}
    >
      <QuickView flex={1.2} alignSelf="center">
        <IconSource.BellOutlineIcon fill={colors.primary} />
      </QuickView>
      <QuickView flex={8.8}>
        <Text color={colors.primary} bold marginVertical={5}>{item?.title}</Text>
        <Text marginVertical={5}>{item?.description}</Text>
        <Text marginVertical={5}>{moment(item?.createdAt).fromNow()}</Text>
      </QuickView>
    </QuickView>
  );

  const handleLoadMore = () => {
    if (data?.length < metadata?.total) {
      if (getLoadMore && metadata && !loading) {
        console.log('handleLoadMore');
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
      <Header placement="left" tTitle="bottom_tab:Thông báo" />
      <Body>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          // fetchData={(query?: TQuery) => getLoadMore({ ...query, ...defaulQuery })}
          renderItem={renderItem}
          // contentContainerStyle={{
          //   flexGrow: 1,
          //   marginTop: 20
          // }}
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

export default NotificationScreen;
