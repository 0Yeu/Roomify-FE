import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBoxProps } from 'react-native-elements';
import CheckBox from '../CheckBox';

interface Props extends Omit<CheckBoxProps, 'checked'> {
  single?: boolean;
  row?: boolean;
  data: any;
  wrapperContainerStyle?: any;
  onChange?:(value: any)=> any;
  defaultValue?: Array<any>;
  defaultSingleValue?: any;
}

function ListCheckBox(props: Props) {
  const {
    single,
    row,
    wrapperContainerStyle,
    data,
    onChange,
    defaultValue,
    defaultSingleValue,
    ...otherProps } = props;
  // const formatData = data.map((d: any) => ({ ...d, isChecked: !!defaultValue?.includes(d?.id) }));
  const [dataState, setDataState] = useState([]);
  const [value, setValue] = useState((single && defaultSingleValue)
    ? defaultSingleValue : null);

  useEffect(() => {
    const formatData = data.map((d: any) => ({ ...d, isChecked: !!defaultValue?.includes(d?.id) }));
    setDataState(formatData);
  }, []);

  const onSelectMulti = (id: number) => {
    const valuesCopy = JSON.parse(JSON.stringify(dataState));
    const index = dataState.findIndex((cb: any) => cb.id === id);
    valuesCopy[index].isChecked = !valuesCopy[index].isChecked;
    if (onChange) onChange(valuesCopy.filter((v: any) => v.isChecked).map((a: any) => a.id));
    setDataState(valuesCopy);
  };
  const onSelect = (value: any) => {
    if (onChange) onChange(value);
    setValue(value);
  };

  if (single) {
    return (
      <View
        style={StyleSheet.flatten([
          row && {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          },
          { backgroundColor: 'transparent' },
          // styles.wrapStyles,
          wrapperContainerStyle,
        ])}
      >
        {dataState.map((item: any) => (
          <CheckBox
            // containerStyle={buttonContainer}
            key={item?.id}
            title={item?.name}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            // textStyle={{ fontSize: 14, fontWeight: 'normal' }}
            checked={value?.id === item?.id}
            onPress={() => onSelect(item)}
            size={16}
            {...otherProps}
          />
        ))}
      </View>
    );
  }
  return (
    <View
      style={StyleSheet.flatten([
        row && {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        },
        { backgroundColor: 'transparent' },
        // styles.wrapStyles,
        wrapperContainerStyle,
      ])}
    >
      {dataState.map((item: any) => (
        <CheckBox
          // containerStyle={buttonContainer}
          key={item?.id}
          title={item?.name}
          checked={item?.isChecked}
          onPress={() => onSelectMulti(item.id)}
          {...otherProps}
        />
      ))}
    </View>
  );
}

export default memo(ListCheckBox);
