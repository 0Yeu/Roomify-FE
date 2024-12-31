import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import AppHelper from '@utils/appHelper';
import AppView from '@utils/appView';
import {
  QuickView,
  Text,
  Header,
  withList,
  Body,
  SearchInput,
} from '@components';
import { Card, withTheme } from 'react-native-elements';
import { NavigationService } from '@utils/navigation';
import { WithListProps } from '@utils/hocHelper';
import I18n from 'i18next';
import Route from '@src/containers/routes';
import _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CONSTANT, getProductList } from '../redux/slice';

interface Props extends WithListProps {}

function ProductList(props: Props) {
  const { loading, filter } = props;
  const searchInput = useRef<any>(null);

  const { renderFlatList, theme } = props;

  const renderItem = ({ item }: any) => {
    const containerStyle = StyleSheet.flatten([
      {
        borderRadius: 10,
        margin: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: theme.colors.grey5
      },
      AppView.shadow(),
    ]);
    const wrapperStyle = StyleSheet.flatten([
      { borderRadius: 10 },
      {
        backgroundColor: theme.colors.themeMode === 'light' ? theme.colors.white : theme.colors.grey0
      },
    ]);

    return (
      <QuickView
        backgroundColor={
          theme.colors.themeMode === 'light'
            ? '#E6EDFF'
            : theme.colors.grey5
        }
        borderRadius={10}
        marginVertical={10}
        onPress={() => NavigationService.navigate(
          Route.exampleStack.flatList,
          {
            screen: Route.exampleStack.flatListStack.productDetail,
            params: AppHelper.setItemIntoParams(item),
          }
        )}
      >
        <Card
          containerStyle={containerStyle}
          wrapperStyle={wrapperStyle}
        >
          <Card.Image source={{ uri: item.thumbnail }} style={{ borderRadius: 10 }} />
          <QuickView padding={15}>
            <Text
              numberOfLines={1}
              bold
              fontSize={18}
              color={theme.colors.primary}
            >
              {I18n.t('key') === 'en' ? item.enTitle : item.viTitle}
            </Text>
            <Text
              marginTop={5}
              subtitle
            >
              {I18n.t('key') === 'en' ? item.enDescription : item.viDescription}
            </Text>
          </QuickView>
        </Card>
      </QuickView>
    );
  };

  // Search
  const search = _.debounce(async () => {
    searchInput.current.switchLoading();
    const { refresh } = props;
    refresh();
  }, 500);

  const onChangeText = (text: string) => {
    const { filter } = props;
    filter.mergeFilter('enTitle', '$contL', text);
    search();
  };

  if (!loading) {
    if (searchInput.current) searchInput.current.switchLoading(false);
  }

  return (
    <>
      <Header customType="example" title="ProductList" />
      <QuickView paddingHorizontal={AppView.bodyPaddingHorizontal} marginTop={10}>
        <SearchInput
          ref={searchInput}
          onChangeText={onChangeText}
          value={filter?.filterObject?.enTitle?.$contL || ''}
        />
      </QuickView>
      <Body fullView>
        {renderFlatList({
          renderItem,
          contentContainerStyle: {
            paddingHorizontal: AppView.bodyPaddingHorizontal
          }
        })}
      </Body>
    </>
  );
}

export default withList({
  url: '/posts',
  focusRefresh: true,
  fields: ['enTitle', 'enDescription', 'thumbnail'],

  /** Use redux */
  // redux: {
  //   dispatch: getProductList,
  //   constant: {
  //     NAME: CONSTANT.NAME,
  //     KEY: CONSTANT.LIST
  //   },
  // }
})(withTheme(ProductList as any, ''));
