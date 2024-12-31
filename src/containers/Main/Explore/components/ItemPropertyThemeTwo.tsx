import React from 'react';
import {
  QuickView, Text
} from '@components';
import AppHelper from '@utils/appHelper';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props {
  item: any
}

const ItemPropertyThemeTwo: React.FC<Props> = (props: Props) => {
  const { item } = props;

  const handleOnPress = (id: any) => {
    NavigationService.navigate(Routes.DETAIL_PROPERTY, id);
  };

  return (
    <QuickView
      onPress={() => handleOnPress(item?.id)}
      // width={300}
      // width="100%"
      height={140}
      borderRadius={20}
      marginHorizontal={10}
      // marginRight={20}
      marginBottom={20}
    >
      <QuickView
        backgroundImage={{
          source: { uri: item?.thumbnail || 'https://picsum.photos/200/300' },
          imageStyle: { borderRadius: 20 },
        }}
        // width={300}
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
};

export default ItemPropertyThemeTwo;
