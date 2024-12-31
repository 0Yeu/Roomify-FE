import React, { PureComponent } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { withTheme } from 'react-native-elements';
import AppView from '@utils/appView';
import QuickView, { QuickViewProps } from '../QuickView';

export interface BodyProps extends QuickViewProps {
  secondary?: boolean;
  primary?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullView?: boolean;
}

class Body extends PureComponent<BodyProps> {
  static defaultProps = {
    primary: true,
  };

  render() {
    const {
      backgroundColor: backgroundColorProp,
      paddingHorizontal: paddingHorizontalProp,
      secondary,
      fullView,
      fullWidth,
      fullHeight,
      style: styleProp,
      children,
      ...otherProps
    } = this.props;

    let backgroundColor = backgroundColorProp || 'transparent';
    const paddingHorizontal = fullWidth || fullView
      ? 0
      : paddingHorizontalProp || AppView.bodyPaddingHorizontal;

    const { backgroundImage } = this.props;
    if (backgroundImage) backgroundColor = 'transparent';

    const style = StyleSheet.flatten([
      { backgroundColor, paddingHorizontal, flex: 1 },
      styleProp,
    ]);

    if (fullHeight || fullView) {
      return (
        <QuickView {...otherProps} style={style}>
          {children}
        </QuickView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <QuickView {...otherProps} style={style}>
          {children}
        </QuickView>
      </SafeAreaView>
    );
  }
}

export default withTheme(Body, '');
