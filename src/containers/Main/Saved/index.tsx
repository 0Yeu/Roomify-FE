import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Image,
} from '@components';
import AppHelper from '@utils/appHelper';
import { DeviceEventEmitter, TouchableOpacity, TextInput } from 'react-native';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import useFetchPagination from '@hooks/useFetchPagination';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';
import { TQuery } from '@utils/server';
import colors from '@themes/Color/colors';
import { EVENT_APP_EMIT } from '@utils/constant';
import { useAppSelector } from '@utils/redux';
import useDialog from '@src/hooks/useDialog';
import AuthPopup from '@components/Common/AuthPopup';

interface Props {
  navigation: any;
}

const SavedScreen: React.FC<Props> = (props: Props) => {
  const { navigation } = props;
  const token = useAppSelector((state) => state.auth.loginData.token);

  const [toggleReload, setToggleReload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const defaulQuery: any = { sort: ['updatedAt,DESC'] };

  // Cập nhật query để lọc theo tìm kiếm
  const searchQueryParams = searchQuery
    ? {
        ...defaulQuery,
        filter: {
          $or: [
            { 'property.title': { $like: `%${searchQuery}%` } },
            { 'property.averagePrice': { $like: `%${searchQuery}%` } },
            { 'property.address': { $like: `%${searchQuery}%` } },
            { 'property.description': { $like: `%${searchQuery}%` } },
          ],
        },
      }
    : defaulQuery;

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination(
    'favorite-property',
    [],
    searchQueryParams,
    'result',
    [toggleReload, token]
  );

  const {
    isVisible,
    onClickDialogCloseBtn,
    onPressBtnToOpenDialog,
  } = useDialog({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!token) {
        onPressBtnToOpenDialog();
      }
    });

    return unsubscribe;
  }, [navigation, token]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EVENT_APP_EMIT.RELOAD_SAVED,
      () => {
        setToggleReload(Math.random());
      }
    );
    return () => {
      subcribe.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ marginBottom: 30 }}
      onPress={() => NavigationService.navigate(Routes.DETAIL_PROPERTY, item?.property?.id)}
    >
      <Image source={{ uri: item?.property?.thumbnail }} height={160} />
      <QuickView paddingHorizontal={20}>
        <QuickView marginTop={20} justifyContent="space-between" row>
          <QuickView flex={1}>
            <Text bold>
              {item?.property?.title}
            </Text>
          </QuickView>
          <QuickView alignItems="flex-end" flex={1}>
            <Text color={colors.primary} fontSize={16} bold>
              {AppHelper.vndPriceFormat(item?.property?.averagePrice * 10)}
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
          color={colors.color77858C}
        >
          {`${item?.property?.address}, ${item?.property?.destination?.name}, ${item?.property?.destination?.parent?.name}, ${item?.property?.destination?.parent?.parent?.name}`}
        </Text>
      </QuickView>
    </TouchableOpacity>
  );

  return (
    <>
      <Header placement="left" tTitle="bottom_tab:Phòng yêu thích" />
      {/* Thanh tìm kiếm */}
      <QuickView padding={10}>
          <TextInput
            placeholder="Tìm kiếm theo giá, địa chỉ, mô tả, tiêu đề..."
            value={searchQuery}
            onChangeText={(text: string) => setSearchQuery(text)}
            style={{
              borderWidth: 1,
              borderColor: colors.grey3,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: colors.grey5,
              backgroundColor: colors.grey2,
            }}
            placeholderTextColor={colors.grey5}
          />
        </QuickView>
      <Body>
        {token && (
          <DefaultFlatList
            loading={loading}
            data={data}
            error={error}
            metadata={metadata}
            fetchData={(query?: TQuery) => getLoadMore({ ...query, ...searchQueryParams })}
            ListHeaderComponentStyle={{ marginBottom: 12 }}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        )}
      </Body>
      <AuthPopup overlayIsVisible={isVisible} handleClosePopup={() => onClickDialogCloseBtn()} />
    </>
  );
};

export default SavedScreen;
