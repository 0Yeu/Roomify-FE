/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Theme, withTheme } from 'react-native-elements';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import Api from '@utils/api';
import Helper from '@utils/helper';
import AppView from '@utils/appView';
import { dataPrefix } from '@utils/server';
import Icon from '../../Icon';
import Input, { InputProps } from '../DefaultInput';
import Text from '../../Text';

export interface AutoCompleteInputProps extends Omit<InputProps, 'ref'> {
  autoCompleteData?: Array<string>;
  autoCompleteBackgroundColor?: string;
  // this component will replace :value in url
  server?: {
    url: string;
    field: string;
  };
  autoCompleteZIndex?: number;
  autoCompleteContainerStyle?: StyleProp<ViewStyle>;
  onAutoCompleteItemPress?: (item: string, index: number) => any;
}

interface State {
  hasFocus: boolean;
  isEmpty: boolean;
  cancelButtonWidth: number | null;
  data: any;
  autoCompleteDataState: any;
  value: string;
  showAutoCompleteResult: boolean;
  loading: boolean;
  paddingRight: number;
  previousSearchText: string;
}

class AutoCompleteInput extends Component<AutoCompleteInputProps & { theme: Theme }, State> {
  static defaultProps = {
    showCancel: true,
    value: '',
    autoCompleteZIndex: 1,
  };

  private input: any;

  search = _.debounce(async (text) => {
    const { server } = this.props;
    const url = _.replace(
      // @ts-ignore
      server.url,
      ':value',
      text,
    );

    try {
      const currentValue = this.getValue();
      if (!currentValue) {
        this.setState({
          loading: true,
        });
        const data = await Api.get(url);
        this.setState({
          data: data[dataPrefix],
          autoCompleteDataState: Helper.selectFields(
            data[dataPrefix],
            // @ts-ignore
            server.field,
          ),
          loading: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  }, 500);

  constructor(props: any) {
    super(props);
    const { value, autoCompleteData, server } = props;
    let showAutoCompleteResult = false;
    if (autoCompleteData || server?.url) showAutoCompleteResult = true;
    this.state = {
      hasFocus: false,
      isEmpty: value ? value === '' : true,
      cancelButtonWidth: null,
      data: [],
      autoCompleteDataState: [],
      value: value || '',
      showAutoCompleteResult,
      loading: false,
      paddingRight: 0,
      previousSearchText: '',
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.value) {
      return {
        ...prevState,
        loading: nextProps.showLoading,
      };
    }
    return prevState;
  }

  getValue = () => {
    const { server } = this.props;
    const { data, value } = this.state;

    if (server?.field) {
      const values = Helper.selectCollectionField(data, server.field);
      const selectedIndex = _.findIndex(values, (o: any) => o.toLowerCase() === value.toLowerCase());

      if (selectedIndex !== -1) {
        return data[selectedIndex];
      }
    }
    return null;
  };

  clear = () => {
    this.input.setText('');
    this.customOnChangeText('');
    this.setState({ showAutoCompleteResult: false });
  };

  customOnFocus = (event: any) => {
    const { onFocus } = this.props;
    const { value } = this.state;
    if (onFocus) onFocus(event);

    this.setState({
      hasFocus: true,
      isEmpty: value === '',
      paddingRight: 30,
    });
  };

  customOnBlur = (event: any) => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(event);
    // this.setState({
    //   showAutoCompleteResult: false,
    // });
  };

  customOnChangeText = async (text: string) => {
    const {
      onChangeText,
      autoCompleteData,
      server,
    } = this.props;
    if ((server?.url || autoCompleteData) && text) {
      this.setState({ showAutoCompleteResult: true });
    }
    let autoCompleteDataState: Array<string> = [];
    this.setState({ value: text, isEmpty: text === '' });

    /**
     * autoCompleteData
     */
    if (autoCompleteData && text) {
      // eslint-disable-next-line max-len
      autoCompleteDataState = _.filter(autoCompleteData, (item) => _.includes(_.lowerCase(item), _.lowerCase(text)));
      this.setState({ autoCompleteDataState });
    }

    /**
     * url
     */
    if (server?.url && server?.field && text) {
      this.search(text);
    }

    if (onChangeText) onChangeText(text);
  };

  customOnAutoCompleteItemPress = (item: string, index: any) => {
    const { onAutoCompleteItemPress } = this.props;
    this.customOnChangeText(item);
    this.setState({ value: item, showAutoCompleteResult: false });
    this.input.setText(item);
    if (onAutoCompleteItemPress) onAutoCompleteItemPress(item, index);
  };

  renderList = () => {
    const { autoCompleteDataState } = this.state;
    return autoCompleteDataState.map((item: any, index: number) => (
      <TouchableOpacity
        onPress={() => this.customOnAutoCompleteItemPress(item, index)}
        key={index.toString()}
      >
        <Text marginVertical={8} marginHorizontal={10} numberOfLines={1}>
          {item}
        </Text>
        {/* <Divider style={{ height: 1, width: '80%', alignSelf: 'center' }} /> */}
      </TouchableOpacity>
    ));
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const {
      inputContainerStyle: inputContainerStyleProp,
      disabled: buttonDisabled,
      height: heightProp,
      autoCompleteBackgroundColor: autoCompleteBackgroundColorProp,
      autoCompleteZIndex,
      width,
      leftIcon,
      autoCompleteContainerStyle,
      theme,
      ...otherProps
    } = this.props;
    const {
      isEmpty,
      value,
      showAutoCompleteResult,
      loading,
      paddingRight,
    } = this.state;

    /**
     * containerStyle
     */
    const height = heightProp;
    const autoCompleteBackgroundColor = autoCompleteBackgroundColorProp || theme.colors.surface;

    return (
      <View style={{ zIndex: autoCompleteZIndex }}>
        <Input
          {...otherProps}
          outerRef={(ref: any) => {
            this.input = ref;
          }}
          width={width}
          onFocus={this.customOnFocus}
          onBlur={this.customOnBlur}
          onChangeText={this.customOnChangeText}
          value={value}
          height={height}
          inputStyle={{
            paddingRight,
          }}
          disabled={buttonDisabled}
          // leftIcon={{
          //   type: 'ionicon',
          //   size: 20,
          //   name: 'ios-search',
          //   color: Color.lightPrimary,
          // }}
          rightIcon={(
            <View style={{ flexDirection: 'row' }}>
              {loading && (
                <ActivityIndicator
                  key="loading"
                  style={StyleSheet.flatten([{ marginRight: 5 }])}
                />
              )}
              {(!isEmpty && !buttonDisabled) ? (
                <TouchableOpacity key="cancel" onPress={this.clear} style={{ marginRight: -5 }}>
                  <Icon name="cancel" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
        {
          showAutoCompleteResult ? (
            <View
              style={StyleSheet.flatten([
                {
                  width: width || '100%',
                  backgroundColor: autoCompleteBackgroundColor,
                  borderRadius: AppView.roundedBorderRadius,
                  marginTop: -5,
                  marginBottom: 10,
                },
                AppView.shadow(),
                autoCompleteContainerStyle,
              ]) as any}
            >
              {this.renderList()}
            </View>
          ) : null
        }
      </View>
    );
  }
}

export default withTheme(
  AutoCompleteInput as any, ''
) as unknown as React.ComponentClass<AutoCompleteInputProps>;
