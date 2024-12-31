import React from 'react';
import {
  QuickView, Text, Header, Body,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import { TextInput } from 'react-native';

interface Props {
  title: string;
  value: string | undefined;
  onChange: any;
}

const CustomInput: React.FC<Props> = (props: Props) => {
  const { theme } = useTheme();
  const { title, value, onChange } = props;

  return (
    <QuickView style={{ borderBottomWidth: 1, paddingVertical: 20, borderBottomColor: 'rgba(222, 63, 63, 0.3)' }} row>
      <Text>{title || ''}</Text>
      <TextInput onChangeText={onChange} value={value} style={{ flex: 1, textAlign: 'right' }} />
    </QuickView>
  );
};

export default CustomInput;
