import React from 'react';
import ComponentHelper, { IComponentBase } from '@utils/component';
import { SearchBar, withTheme } from 'react-native-elements';
import { withTranslation } from 'react-i18next';
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import AppView from '@utils/appView';
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';
import _ from 'lodash';

export interface SearchInputProps extends IComponentBase, Omit<SearchBarBaseProps, 'platform'> {
  tPlaceholder?: string | Array<any>;
  platform?: 'android' | 'ios' | 'default';
  debounceTime?: number; // only affect with onSearch Fn
  onSearch?: (text: string) => Promise<any>
}

interface State {
  text: string;
  loading: boolean;
}

class SearchInput extends React.PureComponent<SearchInputProps & { t: any }, State> {
  static defaultProps = {
    platform: Platform.OS,
    marginVertical: 5,
    debounceTime: 500,
  };

  search = _.debounce(async (text) => {
    const { onSearch } = this.props;
    if (onSearch) {
      this.switchLoading();
      if (onSearch) await onSearch(text);
      this.switchLoading();
    }
  // eslint-disable-next-line react/destructuring-assignment
  }, this.props.debounceTime);

  constructor(props: any) {
    super(props);
    const { value } = this.props;
    this.state = {
      text: value || '',
      loading: false,
    };
  }

  updateSearch = (text: string) => {
    const { onChangeText } = this.props;
    this.setState({ text });
    if (onChangeText) onChangeText(text);
    this.search(text);
  };

  switchLoading = (isLoading?: boolean) => {
    if (typeof isLoading !== 'undefined') this.setState({ loading: isLoading });
    else {
      const { loading } = this.state;
      this.setState({ loading: !loading });
    }
  };

  render() {
    const { text, loading } = this.state;
    const props = ComponentHelper.getProps<SearchInputProps>({
      initialProps: this.props,
      keys: ['placeholder', 'platform', 'containerStyle']
    });
    ComponentHelper.handleCommonProps(props, 'containerStyle');

    let platformStyle = {};
    if (props.platform === 'android') {
      if (props.theme.colors.themeMode === 'light') {
        platformStyle = AppView.shadow(2);
      }
    } else if (props.platform === 'ios') {
      platformStyle = {
        marginLeft: -8,
        marginRight: -8,
      };
    } else {
      platformStyle = { width: '100%' };
    }

    // Customize
    const lightTheme = props.theme.colors.themeMode === 'light';
    let backgroundColor = props.theme.colors.grey3;
    const placeholderTextColor = props.theme.colors.grey5;
    switch (props.platform) {
      case 'android':
        backgroundColor = props.theme.colors.white;
        break;
      case 'ios':
        backgroundColor = 'transparent';
        break;
      default:
    }

    const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
      {
        backgroundColor,
        padding: 0,
        paddingBottom: 0,
        paddingTop: 0,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      },
      platformStyle,
      props.containerStyle,
    ]);

    return (
      <SearchBar
        {...props.otherProps}
        placeholder={props.placeholder || props.t('component:input:search_placeholder')}
        placeholderTextColor={placeholderTextColor}
        // @ts-ignore
        onChangeText={this.updateSearch}
        containerStyle={containerStyle}
        value={text}
        lightTheme={lightTheme}
        platform={props.platform as any}
        showLoading={loading}
        autoCorrect={false}
        // onFocus={() => console.log('focus')}
        // onBlur={() => console.log('blur')}
        // onCancel={() => console.log('cancel')}
        // onClear={() => console.log('clear')}
      />
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(SearchInput as any, '')) as unknown as React.ComponentClass<SearchInputProps>;
