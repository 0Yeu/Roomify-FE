import {
  Body,
  ErrorText,
  Header,
  Icon,
  Image,
  Loading,
  QuickView, Text
} from '@components';
import Routes from '@containers/routes';
import useFetchPagination from '@src/hooks/useFetchPagination';
import colors from '@themes/Color/colors';
import { RoleApi } from '@utils/constant';
import { NavigationService } from '@utils/navigation';
import { useAppSelector } from '@utils/redux';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

interface Props { }

const ListChat: React.FC<Props> = () => {
  const limit = 10;
  const [toggleReload, setToggleReload] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshing, setRefresh] = useState(false);
  const defaulQuery = { limit };
  const auth = useAppSelector(state => state.auth);
  const lsRoles =
    (auth?.loginData?.role || [])?.length > 0 && auth?.loginData?.role?.map((r: any) => r?.name);
  console.log('lsRoles :>> ', lsRoles);
  console.log('RoleApi.USER :>> ', (lsRoles || [])?.length === 1 && lsRoles?.includes(RoleApi.USER));
  const isUser = (lsRoles || [])?.length === 1 && lsRoles?.includes(RoleApi.USER);

  const [data, loading, error, metadata, getLoadMore] = isUser ? useFetchPagination('booking/mine/booking', [], defaulQuery, 'result', [toggleReload]) : useFetchPagination('booking/mine/booked', [], defaulQuery, 'result', [toggleReload]);


  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => NavigationService.navigate(Routes.CHAT_ROOM, { room: item })}
      style={{
        marginBottom: 30, backgroundColor: colors.white, borderRadius: 10, padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      }}
    >
      <QuickView row>
        <Image source={{ uri: item?.room?.images[0] }} width={50} style={{ display: 'flex', flex: 1, width: '100%' }} />
        <QuickView paddingHorizontal={20} column>
          <QuickView flex={2}>
            <Text bold>
              {item?.room?.name}
            </Text>
          </QuickView>
          <Text
            marginTop={10}
            numberOfLines={1}
            color={colors.primary}
          >
            {isUser ? `Sở hữu bởi: ${item?.room?.property?.owner?.fullName}` : `Người thuê: ${item?.user?.fullName}`}
          </Text>
        </QuickView>
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

  useEffect(() => {
    console.log('data :>> ', data);
  }
    , [data]);

  return (
    <>
      <Header borderBottomColor="transparent" tTitle="Trò chuyện" />
      <Body>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item?.id} || index.toString()`}
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

export default ListChat;
