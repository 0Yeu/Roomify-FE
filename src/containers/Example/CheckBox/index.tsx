/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Header, Body, CheckBox, Text
} from '@components';

const CheckBoxExample = () => {
  const [state, setState] = useState(false);
  return (
    <>
      <Header customType="example" title="CheckBoxExample" />
      <Body>
        <CheckBox
          // checked={state}
          title="Additional props"
          onValueChange={(value: boolean) => {
            console.log('checked', value);
            setState(value);
          }}
          onPressProps={() => console.log('!23')}
        />
        <Text>{`Check ----> ${state}`}</Text>
        <CheckBox
          title="Icon right"
          iconRight
          onValueChange={(value: boolean) => console.log('checked', value)}
          onPressProps={() => console.log('!23')}
        />
        <CheckBox
          title="Center"
          onValueChange={(value: boolean) => console.log('checked', value)}
          onPressProps={() => console.log('!23')}
          center
        />
        <CheckBox
          title="Right"
          onValueChange={(value: boolean) => console.log('checked', value)}
          onPressProps={() => console.log('!23')}
          right
        />
        <CheckBox
          title="Custom icon"
          checkedIcon="clear"
          uncheckedIcon="add"
          iconType="material"
          onValueChange={(value: boolean) => console.log('checked', value)}
          onPressProps={() => console.log('!23')}
        />
        <CheckBox
          title="Custom checkedColor"
          checkedColor="red"
          onValueChange={(value: boolean) => console.log('checked', value)}
          onPressProps={() => console.log('!23')}
        />
      </Body>
    </>
  );
};

export default CheckBoxExample;
