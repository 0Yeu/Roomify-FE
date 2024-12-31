import React, { PureComponent } from 'react';
import {
  Avatar, QuickView, Text,
} from '@components';
import { Icon } from 'react-native-elements';
import { FlatList } from 'react-native';

interface Props {
  onChange: (item: any) => any;
}
interface State {}
class SearchHistory extends PureComponent<Props, State> {
  handleOnPress = (item: any) => {
    console.log('item', item);
    const { onChange } = this.props;
    if (onChange) {
      onChange(item);
    }
  };

  renderItem = ({ item }: { item: any }) => (
    <QuickView marginBottom={10} alignItems="center" row onPress={() => this.handleOnPress(item)}>
      <Icon style={{ marginRight: 10 }} name="google-maps" type="material-community" size={16} />
      <Text>{item}</Text>
    </QuickView>
  );

  render() {
    // console.log('history', history);

    return (
      <QuickView paddingVertical={20}>
        <QuickView row>
          <QuickView height={20} style={{ borderLeftWidth: 1, borderColor: 'red' }} />
          <Text marginBottom={10} bold> Tìm kiếm gần đây </Text>
        </QuickView>
        <FlatList data={[]} renderItem={this.renderItem} />
      </QuickView>
    );
  }
}

export default SearchHistory;
