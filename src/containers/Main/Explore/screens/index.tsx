import React, { useEffect, useRef, useState } from 'react';
import {
  QuickView, Text, Header, Body, ModalButton, Icon, Button, Image, Loading,
} from '@components';
import colors from '@themes/Color/colors';
import IconSource from '@icons';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import Api from '@utils/api';
import { FlatList, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { setSelectedCity } from '@containers/Main/redux/slice';
import AppHelper from '@utils/appHelper';
import AppView from '@utils/appView';
import useFetchPagination from '@src/hooks/useFetchPagination';
import Server from '@utils/server';
import ItemPropertiesByCategory from '../components/ItemPropertiesByCategory';
import ItemCategory from '../components/ItemCategory';
import ItemPropertyThemeTwo from '../components/ItemPropertyThemeTwo';

// const data = [
//   {
//     id: 1, name: 'Đà Nẵng'
//   },
//   {
//     id: 2, name: 'Hà Nội'
//   },
//   {
//     id: 3, name: 'Thành phố Hồ Chí Minh'
//   },

// ];
interface Props {}

const ExploreScreen: React.FC<Props> = (props: Props) => {
  const modalRef = useRef<any>(null);

  const [category, setCategory] = useState([]);
  const [initRSProperties, setInitRSProperties] = useState([]);
  const dispatch = useAppDispatch();
  // const [refreshing, setRefreshing] = useState(false);
  // const [toggleReload, setToggleReload] = useState(1);
  const userConfig = useAppSelector((state) => state.userConfig);
  const selectedCity = useAppSelector((state) => state.userConfig.selectedCity);
  const auth = useAppSelector((state) => state.auth);
  const token = useAppSelector((state) => state.auth.loginData.token);

  const limit = 10;
  const [toggleReload, setToggleReload] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const defaulQuery = { limit, offset: page * limit };
  // const [data, loading, error, metadata, getLoadMore] = useFetchPagination('properties/rs', [], defaulQuery, 'result', [toggleReload]);
  // console.log('metadata :>> ', metadata);

  const fetchLsPropertyRSPagination = async () => {
    try {
      setLoading(true);
      const queryString = Server.stringifyQuery({ limit, offset: page * limit } as any);
      const response = await Api.get(`/properties/rs?${queryString}&cityId=${selectedCity?.id}`);
      const { page: resPage, total, pageCount, count } = response;
      const dataGet = response?.result;
      let dataCopy = dataGet;
      if (page) {
        const currentPage = page;
        dataCopy = currentPage === 1 || !currentPage
          ? dataGet
          : data.concat(
            dataGet.filter(
              (item: any) => data.indexOf(item) < 0,
            ),
          );
      }
      // if (response?.result?.length > 0) {
      //   setData(response?.result);
      // }
      setData(dataCopy);
      console.log('dataCopy :>> ', dataCopy);
      setMetadata({ page: resPage, pageCount, total, count });
      setLoading(false);
      // setRefreshing(false);
    } catch (error) {
      setLoading(false);

      // setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLsPropertyRSPagination();
    }
  }, [toggleReload]);

  const fetchCategory = async () => {
    try {
      const response = await Api.get('/category');
      if (response?.result?.length > 0) {
        setCategory(response?.result);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const fetchInitialPropertyRS = async () => {
    try {
      const response = await Api.get(`/properties/rs?cityId=${selectedCity?.id}`);
      if (response?.result?.length > 0) {
        setInitRSProperties(response?.result);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (token) {
      fetchInitialPropertyRS();
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchCategory();
  }, [toggleReload]);

  const handleSelectCity = (item: any) => {
    dispatch(setSelectedCity(item));
    // setSelectedCity(item);
    if (modalRef)modalRef?.current?.close();
  };

  const renderLeftComponent = () => (
    <ModalButton
      ref={modalRef}
      title="Bottom-Half Modal"
      modalProps={{ type: 'bottom-half' }}
      invisible
      buttonChildren={(
        <QuickView
            // onPress={() => {
            //   Global.bottomSheet.present();
            // }}
          row
          center
          style={{ borderWidth: 0, zIndex: 10 }}
        >
          <QuickView>
            <IconSource.PinOutlineIcon />
          </QuickView>
          <QuickView marginLeft={10}>
            <Text color="#B1ADAD">
              Vị Trí
            </Text>
            <QuickView verticalCenter row>
              <Text marginRight={5}>{selectedCity?.name || '-'}</Text>
              <IconSource.ArrowDownIcon />
            </QuickView>
          </QuickView>
        </QuickView>
)}
    >
      <QuickView padding={20} borderRadius={20} backgroundColor={colors.white} height={400}>
        <QuickView width="25%" height={5} alignSelf="center" backgroundColor={colors.colorB1ADAD} borderRadius={5} />
        <Text marginVertical={20} center fontSize={20} bold tText="explore:area" />
        {userConfig?.cityData?.map((d: any) => (
          <QuickView
            onPress={() => handleSelectCity(d)}
            borderRadius={10}
            key={d?.id}
            backgroundColor={selectedCity?.id === d?.id ? 'rgba(222,63,63,0.05)' : colors.white}
            paddingVertical={15}
            paddingHorizontal={20}
            marginBottom={10}
            row
            verticalCenter
            justifyContent="space-between"
          >
            <Text
              color={selectedCity?.id === d?.id ? colors.primary : colors.black}
              bold={selectedCity?.id === d?.id}
            >
              {d?.name || '-'}
            </Text>
            {selectedCity?.id === d?.id && <IconSource.CheckIcon />}
          </QuickView>
        ))}
      </QuickView>
    </ModalButton>

  );

  const handleActionRight = () => {
    NavigationService.navigate(Routes.CREATE_PROPERTY);
  };

  const renderRightComponent = () => {
    const isUser = (auth?.loginData?.role || [])?.length === 1
    && auth?.loginData?.role[0]?.id === 4;
    if (!isUser) {
      return (
        <QuickView
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={handleActionRight}
        >
          <IconSource.CreateRoom />
        </QuickView>
      );
    }
    return undefined;
  };

  const handleLoadMore = () => {
    console.log('handleLoadMore :>> ');
    if (data?.length < metadata?.total) {
      setPage(page + 1);
      setToggleReload(Math.random());
      // if (getLoadMore && metadata && !loading) {
      //   getLoadMore({ ...defaulQuery, offset: (page + 1) * limit });
      //   setPage(page + 1);
      // }
    }
  };

  const onRefresh = () => {
    // setPreventLoadmore(false)
    setPage(0);
    // setRefresh(true);
    setToggleReload(Math.random());
  };

  useEffect(() => {
    onRefresh();
  }, [selectedCity]);
  // const onRefresh = () => {
  //   setRefreshing(true);
  //   setToggleReload(Math.random());
  // };

  const handleOnPress = (id: any) => {
    NavigationService.navigate(Routes.DETAIL_PROPERTY, id);
  };

  const renderItem = ({ item }: { item: any }) => (
    <QuickView
      style={{ width: ((AppView.screenWidth - 20) / 2) - 20 }}
      marginHorizontal={10}
      marginBottom={10}
      onPress={() => handleOnPress(item?.id)}
    >
      <Image source={{ uri: item?.thumbnail || 'https://picsum.photos/200/300' }} width="100%" height={140} />
      <QuickView marginTop={15} marginLeft={10}>
        <Text bold>
          {AppHelper.vndPriceFormat(item?.averagePrice * 10)}
        </Text>
        <Text marginTop={5}>
          {item?.averageArea}
          m2
          {/* 60m2 */}
        </Text>
        <Text
          marginTop={10}
          icon={{
            name: 'map-pin',
            color: colors.primary,
            type: 'feather',
            size: 12,
          }}
          color="#77858C"
        >
          {item?.destination?.parent?.name}
          {/* Thanh Khê */}
        </Text>
      </QuickView>
    </QuickView>
  );

  const renderHeaderList = () => (
    <>
      <QuickView marginTop={10} row style={{ flexWrap: 'wrap' }}>
        {(category || [])?.map((c: any, idx) => <ItemCategory key={c?.id} data={c} image={`category${idx + 1}`} />)}
      </QuickView>
      <Text marginHorizontal={10} fontSize={20} bold marginBottom={10}>
        Gợi ý cho bạn
      </Text>
      {initRSProperties?.map((dt: any) => <ItemPropertyThemeTwo item={dt} key={dt?.id} />)}
      <Text marginHorizontal={10} fontSize={20} bold marginBottom={10}>
        Xem thêm
      </Text>
    </>
  );

  return (
    <>
      <Header
        barStyle="dark-content"
        placement="left"
        leftComponent={renderLeftComponent()}
        rightComponent={renderRightComponent()}
        backgroundColor="transparent"
      />
      <Body
        // fullWidth
        paddingHorizontal={10}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        // scrollable
      >
        <QuickView
          onPress={() => NavigationService.navigate(Routes.SEARCH_SCREEN)}
          row
          backgroundColor={colors.grey2}
          borderRadius={10}
          style={{ borderWidth: 1, borderColor: 'rgba(177, 173, 173, 0.2)' }}
          paddingHorizontal={15}
          paddingVertical={12}
          marginVertical={12}
        >
          <QuickView justifyContent="center" flex={1}>
            <Text color={colors.grey}>Tìm theo quận, tên đường, chi phí, diện tích, v.v</Text>
          </QuickView>
          <QuickView>
            <Icon name="magnify" type="material-community" color="#B1ADAD" />
          </QuickView>
        </QuickView>
        {token
          ? (
            <>
              <FlatList
                style={{ flex: 1 }}
                ListHeaderComponent={renderHeaderList()}
                numColumns={2}
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
              />
              {loading && <Loading />}
            </>
          ) : (
            <QuickView scrollable showsVerticalScrollIndicator={false}>
              {(category || [])?.length > 0 ? category?.map((c: any, index: number) => (
                <ItemPropertiesByCategory
                  category={c}
                  key={c?.id}
                  mode={index}
                />
              ))
                : (
                  <QuickView center marginTop={100}>
                    <Text tText="exception:500" />
                    <Button tTitle="common:Tải lại" onPress={onRefresh} />
                  </QuickView>
                )}
            </QuickView>
          )}

      </Body>
    </>
  );
};

export default ExploreScreen;
