import React from 'react';
import {
  QuickView, Text, Header, Body, Image,
} from '@components';
import AppHelper, { IBase } from '@utils/appHelper';
import { colors, useTheme } from 'react-native-elements';
import useFetchPagination from '@src/hooks/useFetchPagination';
import DefaultFlatList from '@components/Common/FlatList/DefaultFlatList';
import { TQuery } from '@utils/server';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props extends IBase {}

const ListRoommate: React.FC<Props> = (props: Props) => {
  const { theme } = useTheme();
  const defaulQuery = { };

  const [data, loading, error, metadata, getLoadMore] = useFetchPagination('roommate', [], defaulQuery, 'result', []);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() => NavigationService.navigate(Routes.DETAIL_ROOMMATE_SCREEN, item?.id)}
      style={{ marginBottom: 30, flexDirection: 'row', flexWrap: 'wrap' }}
    >
      <QuickView flex={1}>
        <Image source={{ uri: item?.user?.avatar }} width={100} height={100} />
      </QuickView>
      <QuickView flex={2} paddingHorizontal={20} justifyContent="center">
        <QuickView>
          <Text bold>
            {item?.user?.fullName}
          </Text>
        </QuickView>
        <QuickView marginVertical={10}>
          <Text color={colors.primary}>
            {AppHelper.vndPriceFormat(item?.price * 10)}
            {' '}
            VND
          </Text>
        </QuickView>
        <QuickView row>
          <Icon style={{ marginRight: 10 }} name="map-pin" type="feather" color={colors.primary} size={13} />
          <Text color={colors.primary}>
            {`${item?.destination?.name}, ${item?.destination?.parent?.name}, ${item?.destination?.parent?.parent?.name}`}
          </Text>
        </QuickView>
      </QuickView>
    </TouchableOpacity>
  );

  return (
    <>
      <Header placement="left" title="Tìm người ở ghép" />
      <Body>
        <QuickView>
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
        </QuickView>
      </Body>
    </>
  );
};

export default ListRoommate;
