import React from 'react';
import {
  Icon,
  QuickView, Text
} from '@components';

interface Props {
  title: string
  selectedLabel?: string | null
  onPress?:() => any;
}

const SelectLocation: React.FC<Props> = (props: Props) => {
  const { title, selectedLabel, onPress } = props;

  return (
    <QuickView marginVertical={10}>
      <Text marginBottom={10}>{title || 'Tiêu đề'}</Text>
      <QuickView
        onPress={() => onPress?.()}
        row
        justifyContent="space-between"
        style={{ borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 5 }}
      >
        <Text>{selectedLabel || `Chọn ${title}`}</Text>
        <Icon name="chevron-down" type="entypo" />
      </QuickView>
    </QuickView>
  );
};

export default SelectLocation;
