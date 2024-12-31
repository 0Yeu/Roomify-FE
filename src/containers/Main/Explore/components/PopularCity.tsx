import {
  Avatar, QuickView, Text,
} from '@components';
import { useAppSelector } from '@utils/redux';
import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

interface Props {
  onChange:(item: any) => any;
}

const PopularCity: React.FC<Props> = (props: Props) => {
  const { onChange } = props;
  const userConfig = useAppSelector((state) => state.userConfig);
  const handleOnPress = (item: any) => {
    // const { onChange } = this.props;
    onChange?.(item);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <QuickView onPress={() => handleOnPress(item)} center width={120}>
      <Avatar size="medium" rounded source={{ uri: `https://picsum.photos/${index * 200}/${index * 200}` }} />
      <Text marginTop={10} center>{item?.name}</Text>
    </QuickView>
  );

  console.log('userConfig?.cityData :>> ', userConfig?.cityData);

  return (
    <QuickView paddingVertical={20}>
      <QuickView row>
        <QuickView height={20} style={{ borderLeftWidth: 1, borderColor: 'red' }} />
        <Text marginBottom={10} bold> Thành phố phổ biến </Text>
      </QuickView>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={userConfig?.cityData}
        renderItem={renderItem}
      />
    </QuickView>
  );
};

export default PopularCity;
