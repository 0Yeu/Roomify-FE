import React, { useEffect, useState } from 'react';
import { CheckBox as ECheckBox, CheckBoxProps, colors, withTheme } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export interface AppCheckBoxProps extends Omit<CheckBoxProps, 'title'> {
  onPressProps?: () => any;
  onValueChange?: (value: boolean) => any;
  title?: string;
}

const CheckBox = (props: AppCheckBoxProps) => {
  const {
    containerStyle,
    onPressProps, onValueChange, title, textStyle, checked: checkedProps, ...otherProps } = props;
  const [checked, setChecked] = useState<boolean>(!!checkedProps);
  useEffect(() => {
    setChecked(!!checkedProps);
  }, [checkedProps]);
  return (
    <ECheckBox
      title={title || 'Click here'}
      onPress={() => {
        setChecked(!checked);
        if (onPressProps) onPressProps();
        if (onValueChange) onValueChange(!checked);
      }}
      // title="Click Here"
      checked={checked}
      textStyle={[{ marginLeft: 0, color: colors.black, fontWeight: 'normal' }, textStyle]}
      containerStyle={StyleSheet.flatten([
        {
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingHorizontal: 0,
          // width: '100%',
          marginLeft: 0,

        },
        containerStyle
      ])}
      {...otherProps}
    />
  );
};

export default withTheme(CheckBox as any, '') as unknown as React.ComponentClass<AppCheckBoxProps>;
