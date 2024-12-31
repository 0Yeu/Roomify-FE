/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  textInput: {
    fontWeight: 'bold',
  },
  containerInput: {
    // borderWidth: 1,
    padding: 15,
    // height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#FFFFFF',
    // textAlign: 'center',
    // alignContent: 'center',
    alignItems: 'center',
    // zIndex: 1000,
    // elevation: 1000,
  },
  isSelected: {
    // /borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#315DF7',
    // top: -10,
  },
  isNotSelected: {
    // /borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    // top: -10,
  },
  // textOption: {
  //   fontSize:
  // }
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },

  containerDropdownStyles: {
    overflow: 'scroll',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    position: 'absolute',
  },
  infoViewStyles: {
    flex: 8,
    // width: '80%',
    justifyContent: 'center',
  },
});

interface Props {
  textStyle?: any;
  defaultValue?: number | string;
  onChange?: any;
  containerStyle?: any;
  dropdownStyles?: any;
  activeColor?: string;
  activeTextColor?: string;
  data: any;
  inActiveTextColor?: string;
  inActiveColor?: string;
  placeholderColor?: string;
  iconComponent?: any;
  iconSize?: number;
  iconColor?: string;
  placeholder?: string;
  labelKey?: string;
  valueKey?: string;
  // inActiveComponent?: any;
  // activeComponent?: any;
}
interface State {
  rotateIcon: boolean;
  value: number | string;
}

class Dropdown extends PureComponent<Props, State> {
  static defaultProps = {
    labelKey: 'label',
    valueKey: 'value',
  };

  constructor(props: any) {
    super(props);
    const { defaultValue, data, valueKey } = this.props;
    let valueSeclected = data[0][valueKey || 'value'];
    if (defaultValue) {
      valueSeclected = defaultValue;
    }
    this.state = {
      rotateIcon: false,
      value: valueSeclected,
    };
  }

  setValue = (value: any) => () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      value,
      rotateIcon: false,
    });
  };

  render() {
    const {
      textStyle,
      containerStyle,
      dropdownStyles,
      activeColor,
      activeTextColor,
      data,
      placeholderColor,
      inActiveColor,
      inActiveTextColor,
      iconComponent,
      iconSize,
      iconColor,
      placeholder,
      labelKey,
      valueKey,
    } = this.props;
    const { rotateIcon, value } = this.state;
    let labelSelected = placeholder || 'Select item';
    // let checkWidth: any;

    if (value) {
      data.forEach((item: any) => {
        if (value === item[valueKey || 'value']) {
          labelSelected = item[labelKey || 'label'];
        }
      });
    } else {
      labelSelected = placeholder || 'Select item';
    }

    const textStyles = StyleSheet.flatten([
      styles.textInput,
      { color: placeholderColor || 'red' },
      textStyle,
    ]);

    const isNotSelectedStyles = StyleSheet.flatten([
      styles.isNotSelected,
      { backgroundColor: inActiveColor || 'purple' },
    ]);

    return (
      <View>
        <View style={{ zIndex: 10 }}>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ rotateIcon: !rotateIcon })}
          >
            <View
              style={[
                styles.containerInput,
                { backgroundColor: 'red' },
                containerStyle,
              ]}
            >
              <View style={styles.infoViewStyles}>
                <Text numberOfLines={1} style={[{ fontSize: 16 }, textStyles]}>
                  {labelSelected}
                </Text>
              </View>
              <View
                style={[
                  rotateIcon && styles.rotateIcon,
                  { justifyContent: 'center' },
                ]}
              >
                {iconComponent || (
                  <Icon
                    name="chevron-down"
                    size={iconSize || 24}
                    color={iconColor || 'red'}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {rotateIcon ? (
            <View
              style={[
                styles.containerDropdownStyles,
                { backgroundColor: 'red' },
                dropdownStyles,
              ]}
            >
              <ScrollView>
                {data.map((item: any) => (
                  <TouchableOpacity
                    key={item[valueKey || 'value']}
                    onPress={this.setValue(item[valueKey || 'value'])}
                  >
                    <View
                      style={
                        value === item[valueKey || 'value']
                          ? [
                            styles.isSelected,
                            activeColor
                              ? { backgroundColor: activeColor }
                              : {
                                backgroundColor: 'red',
                              },
                          ]
                          : isNotSelectedStyles
                      }
                    >
                      <Text
                        style={
                          value === item[valueKey || 'value']
                            ? activeTextColor
                              ? { color: activeTextColor }
                              : { color: 'yellow' }
                            : {
                              color:
                                  inActiveTextColor || 'green',
                            }
                        }
                      >
                        {item[labelKey || 'label']}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
        {rotateIcon ? (
          <TouchableWithoutFeedback
            onPress={() => this.setState({ rotateIcon: !rotateIcon })}
          >
            <View
              style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                // opacity: 0.5,
                // backgroundColor: 'black',
                backgroundColor: 'transparent',
                width,
                height,
                justifyContent: 'center',
              }}
            >
              {/* <ActivityIndicator /> */}
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }
}
// export default Dropdown;
export default Dropdown;
