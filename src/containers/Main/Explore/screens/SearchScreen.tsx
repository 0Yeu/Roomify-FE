import React, { useRef, useState } from 'react';
import {
  QuickView, Text, Header, Body, Image, Icon,
} from '@components';
import AppHelper from '@utils/appHelper';
import { SearchBar } from 'react-native-elements';
import colors from '@themes/Color/colors';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import { NavigationService } from '@utils/navigation';
import useFetchPagination from '@hooks/useFetchPagination';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';
import { TQuery } from '@utils/server';
import Routes from '@containers/routes';
import Geolocation from '@react-native-community/geolocation';
import Api from '@utils/api';
import PopularCity from '../components/PopularCity';
import SearchHistory from '../components/SearchHistory';

interface Props {}

const SearchScreen: React.FC<Props> = () => {
  const [search, setSearch] = useState<string>('');
  const [text, setText] = useState<string>('');

  const defaulQuery = useRef<any>(null);

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination(
    'properties',
    [],
    // { s: { $or:
    //   [
    //     { address: { $contL: search } },
    //     { 'destination.name': { $contL: search } },
    //     { 'destination.district.name': { $contL: search } },
    //     { 'destination.city.name': { $contL: search } }
    //   ] }
    // },
    defaulQuery.current,
    'result', [search]
  );

  const callSuggestions = (_.debounce((txt) => {
    setSearch(txt);
  }, 1500));

  const updateSearch = (txt: string) => {
    setText(txt);
    defaulQuery.current = { s: { $or:
      [
        { address: { $contL: txt } },
        { 'destination.name': { $contL: txt } },
        { 'destination.district.name': { $contL: txt } },
        { 'destination.city.name': { $contL: txt } },
        { 'properties.address.name': { $contL: txt } }
      ] }
    };
    callSuggestions(txt);
    // this.setState({ loadingCall: false });
  };

  const renderCenterComponent = () => (
    <SearchBar
        // onClear={this.onClear}
        // onSubmitEditing={this.onSubmitEditing}
      inputStyle={{ fontSize: 14, color: colors.black }}
      // @ts-ignore
      onChangeText={updateSearch}
      value={text}
        // platform="ios"
      lightTheme
      placeholder="Tìm theo quận, tên đường, chi phí, diện tích, v.v"
      // @ts-ignore
      searchIcon={null}
      placeholderTextColor={colors.grey6}
      containerStyle={{
        width: '100%',
        elevation: 20,
        backgroundColor: colors.grey2,
        borderWidth: 1,
        borderColor: 'rgba(177, 173, 173, 0.2)',
        borderRadius: 10,
      }}
      inputContainerStyle={{
        height: 30,
        borderRadius: 22.5,
        backgroundColor: colors.grey2,
      }}
    />
  );

  const handleNavigateToDetailProperty = (item: any) => {
    NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.id);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleNavigateToDetailProperty(item)}
      style={{ marginBottom: 30 }}
    >
      <Image source={{ uri: item?.thumbnail }} height={160} />
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

  const handleOpenMap = () => {
    NavigationService.navigate(Routes.MAP_PROPERTIES, search);
  };

  const renderFlatList = () => (
    <>
      <QuickView paddingVertical={20}>
        <Text bold>
          {metadata?.total}
          {' '}
          kết quả tìm thấy
        </Text>
      </QuickView>
      <DefaultFlatList
        loading={loading}
        data={data}
        error={error}
        metadata={metadata}
        fetchData={(query?: TQuery) => getLoadMore({ ...query, ...defaulQuery.current })}
        keyExtractor={(item, index) => `${item?.id}` || index.toString()}
        renderItem={renderItem}
      />
      <QuickView
        onPress={handleOpenMap}
        row
        borderRadius={10}
        center
        backgroundColor={colors.white}
        padding={10}
        marginBottom={50}
        style={{
          position: 'absolute',
          bottom: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
        }}
      >
        <Icon name="map-outline" type="ionicon" />
        <Text marginLeft={5}>Map</Text>
      </QuickView>
    </>
  );

  // const renderItemSuggestion = ({ item }: { item: any }) => (
  //   <QuickView>
  //     <Text>alo</Text>
  //   </QuickView>
  // );

  const handleOnPressCity = (item: any) => {
    NavigationService.navigate(Routes.PROPERTY_BY_CITY, item);
  };

  const locateCurrentPosition = async () => {
    Geolocation.getCurrentPosition(async (position) => {
      const initialPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log('initialPosition', initialPosition);
      // NavigationService.navigate(Routes.PROPERTY_NEAR_ME, initialPosition);
      const result = await Api.get(`https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyBOdpPUJPzutcHJ7LWjMu4T7wfLp5kKBwM&latlng=${initialPosition.latitude},${initialPosition.longitude}`);
      // console.log('result :>> ', result);
      let administrativeAreaLevel3 = 'Hòa Khánh';
      const selectedResult = result?.results?.length > 0 && result?.results?.filter((o: any) => o?.types?.includes('administrative_area_level_3'));
      if (selectedResult?.length > 0) {
        const temp = selectedResult[0]?.address_components?.length > 0 && selectedResult[0]?.address_components?.filter((o: any) => o.types?.includes('administrative_area_level_3'));
        if (temp?.length > 0) {
          administrativeAreaLevel3 = temp[0]?.long_name;
        }
      }
      console.log('administrativeAreaLevel3 :>> ', administrativeAreaLevel3);
      NavigationService.navigate(Routes.PROPERTY_NEAR_ME, { ...initialPosition, administrativeAreaLevel3 });
    },
    (error) => console.log('error', error.message),
    { enableHighAccuracy: true, timeout: 10000 });
  };

  return (
    <>
      <Header
        backIcon
        placement="left"
        leftContainerStyle={{ justifyContent: 'center' }}
        centerComponent={renderCenterComponent()}
      />
      <Body>
        {text?.length === 0 && _.isNull(null) ? (
          <>
            <QuickView onPress={locateCurrentPosition} paddingVertical={20}>
              <QuickView row>
                <QuickView height={20} style={{ borderLeftWidth: 1, borderColor: 'red' }} />
                <Text marginBottom={10} bold> Khu trọ gần tôi</Text>
              </QuickView>

            </QuickView>
            <PopularCity onChange={(item: any) => handleOnPressCity(item)} />
            {/* <SearchHistory onChange={(item: string) => updateSearch(item)} /> */}
          </>
        ) : (renderFlatList())}
      </Body>
    </>
  );
};

export default SearchScreen;
