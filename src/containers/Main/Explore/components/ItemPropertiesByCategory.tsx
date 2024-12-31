import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Image,
} from '@components';
import AppHelper from '@utils/appHelper';
import { TouchableOpacity, FlatList as RNFlatList, ActivityIndicator } from 'react-native';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import Api from '@utils/api';
import Server from '@utils/server';
import AuthPopup from '@components/Common/AuthPopup';
import useDialog from '@hooks/useDialog';
import { useAppSelector } from '@utils/redux';

interface Props {
  mode: number,
  category: any,
}

const ItemPropertiesByCategory: React.FC<Props> = (props: Props) => {
  const { mode, category } = props;
  const token = useAppSelector((state) => state.auth.loginData.token);
  const selectedCity = useAppSelector((state) => state.userConfig.selectedCity);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    isVisible,
    onClickDialogCloseBtn,
    onClickDialogOkBtn,
    onPressBtnToOpenDialog,
  } = useDialog({});
  // const { theme } = useTheme();

  const handleOnPress = (id: any) => {
    if (token) {
      NavigationService.navigate(Routes.DETAIL_PROPERTY, id);
    } else {
      onPressBtnToOpenDialog();
    }
    //
  };

  const renderThemeOne = (item: any) => (
    <QuickView
      style={{ width: 180 }}
      marginRight={20}
      onPress={() => handleOnPress(item?.id)}
    >
      <Image source={{ uri: item?.thumbnail || 'https://picsum.photos/200/300' }} width={180} height={140} />
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

  const renderThemeTwo = (item: any) => (
    <QuickView
      onPress={() => handleOnPress(item?.id)}
      width={300}
      height={140}
      borderRadius={20}
      marginRight={20}
    >
      <QuickView
        backgroundImage={{
          source: { uri: item?.thumbnail || 'https://picsum.photos/200/300' },
          imageStyle: { borderRadius: 20 },
        }}
        width={300}
      >
        <QuickView
          marginTop={100}
          marginRight={20}
          alignSelf="flex-end"
          borderRadius={10}
          backgroundColor="#FFFFFF"
          padding={5}
          row
        >
          <Text>Chỉ </Text>
          <Text color={colors.primary}>
            ₫
            {AppHelper.vndPriceFormat(item?.averagePrice * 10)}
            /tháng
          </Text>
        </QuickView>
      </QuickView>
    </QuickView>
  );

  const renderThemeThree = (item: any) => (
    <QuickView
      onPress={() => handleOnPress(item?.id)}
      width={300}
      height={140}
      borderRadius={20}
      marginRight={20}
    >
      <QuickView
        backgroundImage={{
          source: { uri: item?.thumbnail || 'https://picsum.photos/200/300' },
          imageStyle: { borderRadius: 20 },
        }}
        width={300}
      >
        <QuickView
          marginTop={100}
          marginRight={20}
          alignSelf="flex-end"
          borderRadius={10}
          backgroundColor="#FFFFFF"
          padding={5}
          row
        >
          <Text>Chỉ </Text>
          <Text bold color={colors.primary}>
            {AppHelper.vndPriceFormat(item.averagePrice * 10)}
            / căn/ tháng
          </Text>
        </QuickView>
      </QuickView>
    </QuickView>
  );

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const encodeQuery = Server.stringifyQuery({ limit: 3, s: { $and: [{ 'category.id': category?.id }, { 'destination.city.id': selectedCity?.id }] } });
      const response = await Api.get(`/properties?${encodeQuery}`);
      if (response?.result?.length > 0) {
        setData(response?.result);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error :>> ', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProperty();
  }, [category, selectedCity]);

  const renderRowItem = ({ item }: { item: any }) => {
    let theme = null;
    switch (mode) {
      case 0:
        theme = renderThemeOne(item);
        break;
      case 1:
        theme = renderThemeTwo(item);
        break;
      case 2:
        theme = renderThemeThree(item);
        break;
      default:
        theme = renderThemeOne(item);
        break;
    }
    return theme;
  };

  const handleViewAll = () => {
    if (token) {
      NavigationService.navigate(Routes.PROPERTY_BY_CATEGORY, category);
    } else {
      onPressBtnToOpenDialog();
    }
  };

  const renderEmpty = () => (
    <QuickView center flex={1}>
      {loading ? <ActivityIndicator /> : <Text>Không có dữ liệu</Text>}
    </QuickView>
  );

  return (
    <QuickView>
      <QuickView
        marginTop={40}
        row
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={20} bold>
          {category?.name || '-'}
        </Text>
        <TouchableOpacity onPress={handleViewAll} style={{ padding: 5 }}>
          {data?.length > 0 && (
          <Text fontSize={12} semibold color={colors.colorB1ADAD}>
            Xem thêm
          </Text>
          )}
        </TouchableOpacity>
      </QuickView>
      <RNFlatList
        ListEmptyComponent={renderEmpty()}
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        horizontal
        data={data}
        renderItem={renderRowItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <AuthPopup overlayIsVisible={isVisible} handleClosePopup={() => onClickDialogCloseBtn()} />
    </QuickView>
  );
};

export default ItemPropertiesByCategory;
