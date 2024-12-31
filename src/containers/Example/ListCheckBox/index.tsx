/* eslint-disable no-console */
import React from 'react';
import {
  Body,
  Header,
  ListCheckBox,
} from '@components';
import colors from '@themes/Color/colors';
import Section from '../Section';

const data = [
  { id: '0', name: 'Mở bán dự án Residences Quy Nhơn' },
  { id: '17', name: 'Công bố dự án Phúc Yên Prosper Phố Đông Thủ Đức' },
  { id: '2', name: 'Công bố dự án Century City Long Thành' },
  { id: '5', name: 'Mở bán dự án Green Dragon City Quảng Ninh' },
];
const ListCheckBoxExample = () => (
  <>
    <Header customType="example" title="ListCheckBox" />
    <Body scrollable fullView>
      <Section title="Single select">
        <ListCheckBox
          defaultValue="17"
          onChange={(value: any) => console.log('onChange', value, typeof value)}
          single
          data={data}
        />
      </Section>
      <Section title="Multi select">
        <ListCheckBox
          defaultValue={['0', '2']}
          checkedColor={colors.error}
          uncheckedColor={colors.success}
          wrapperContainerStyle={{
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: colors.grey3,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: colors.white,
            paddingHorizontal: 10
          }}
          onChange={(value: any) => console.log('onChangeMulti', value, typeof value)}
          data={data}
        />
      </Section>
    </Body>
  </>
);

export default ListCheckBoxExample;
