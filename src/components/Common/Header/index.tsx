import React, { PureComponent } from 'react';
import {
  StyleSheet, Image
} from 'react-native';
import {
  withTheme,
  Header as EHeader,
  HeaderProps as EHeaderProps,
  Icon } from 'react-native-elements';
import { NavigationService } from '@utils/navigation';
import AppView from '@utils/appView';
import ImageSource from '@images';
import Helper from '@utils/helper';
import ComponentHelper, { IComponentBase } from '@utils/component';
import { withTranslation } from 'react-i18next';
import { Font } from '@fonts';
import SwitchChangeTheme from '@containers/Config/components/SwitchChangeTheme';
import QuickView from '../View/QuickView';
import StatusBar from '../StatusBar';

export type CustomType = {
  example: HeaderProps
  bottomSheet: HeaderProps
};

export interface HeaderProps extends EHeaderProps, IComponentBase<CustomType> {
  backgroundColor?: string;
  borderBottomColor?: string;
  borderBottomWidth?: number;
  transparent?: boolean;
  backIcon?: boolean;
  leftIconBackgroundColor?: string;
  closeIcon?: boolean;
  title?: string;
  tTitle?: string | Array<any>;
  logo?: boolean;
  switchTheme?: boolean;
  shadow?: boolean;
  leftColor?: string;
  centerColor?: string;
  rightColor?: string;
  fontFamily?: Font;
  onPressBackIcon?: () => any;
  onPressCloseIcon?: () => any;
}

const styles = StyleSheet.create({
  defaultLogoStyle: {
    width: 84,
    height: 30,
    resizeMode: 'contain',
  },
});

class Header extends PureComponent<HeaderProps> {
  static defaultProps = {
    barStyle: 'light-content',
  };

  private handleProps = () => {
    const props = ComponentHelper.getProps<HeaderProps>({
      initialProps: this.props,
      themeKey: 'Header',
      keys: [
        'transparent', 'backIcon', 'leftIconBackgroundColor', 'closeIcon', 'title', 'tTitle',
        'leftColor', 'centerColor', 'rightColor', 'borderBottomColor',
        'borderBottomWidth', 'placement', 'logo', 'containerStyle',
        'leftContainerStyle', 'leftComponent', 'centerContainerStyle',
        'centerComponent', 'shadow', 'switchTheme', 'theme', 'statusBarProps',
        'barStyle', 'fontFamily', 'onPressBackIcon', 'onPressCloseIcon', 'rightComponent'
      ]
    });
    ComponentHelper.handleCommonProps(props, 'containerStyle');
    return props;
  };

  render() {
    const props = this.handleProps();

    let { leftColor, centerColor } = props;
    if (props.color) {
      leftColor = props.color;
      centerColor = props.color;
    }

    const backgroundColor = props.transparent ? 'transparent' : props.backgroundColor;
    let { borderBottomColor } = props;
    // eslint-disable-next-line react/destructuring-assignment
    if (props.shadow || this.props.elevated) borderBottomColor = 'transparent';
    else if (!borderBottomColor) {
      borderBottomColor = props.theme.colors.borderBottom;
    }

    const containerStyle = StyleSheet.flatten([
      Helper.compact({
        borderBottomColor,
        borderBottomWidth: props.borderBottomWidth,
        backgroundColor,
        paddingHorizontal: AppView.headerPaddingHorizontal,
      }),
      props.shadow ? AppView.shadow() : {},
      props.containerStyle,
    ]);

    /**
     * Left Component
     */
    const leftContainerStyle = StyleSheet.flatten([
      {
        paddingRight: ((props.backIcon || props.closeIcon)) ? 10 : 0,
      },
      props.leftContainerStyle,
    ]);
    // eslint-disable-next-line prefer-destructuring
    let leftComponent: any = props.leftComponent;
    if (props.backIcon) {
      leftComponent = {
        icon: 'arrowleft',
        type: 'antdesign',
        size: 25,
        color: leftColor,
        onPress: () => (
          props.onPressBackIcon ? props.onPressBackIcon() : NavigationService.goBack()
        ),
        style: {
          width: 25, height: 25,
        },
        containerStyle: props.leftIconBackgroundColor !== 'transparent' ? {
          padding: 8, backgroundColor: props.leftIconBackgroundColor, borderRadius: 20,
        } : null,
        hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
      };
    } else if (props.closeIcon) {
      leftComponent = {
        icon: 'close',
        type: 'antdesign',
        size: 25,
        color: leftColor,
        onPress: () => (
          props.onPressCloseIcon ? props.onPressCloseIcon() : NavigationService.goBack()
        ),
        style: {
          width: 25, height: 25,
        },
        containerStyle: props.leftIconBackgroundColor !== 'transparent' ? {
          padding: 8, backgroundColor: props.leftIconBackgroundColor, borderRadius: 20,
        } : null,
        hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
      };
    }

    /**
     * Center Component
     */
    // eslint-disable-next-line prefer-destructuring
    let centerComponent: any = props.centerComponent;
    if (props.title || props.tTitle) {
      /**
       * Translation
       */
      let { title } = props;
      if (!props.title && props.tTitle) {
        if (typeof props.tTitle === 'string') {
          title = props.t(props.tTitle);
        } else if (typeof props.tTitle === 'object') {
          title = props.t(props.tTitle[0], props.tTitle[1]);
        }
      }
      centerComponent = {
        text: title,
        style: StyleSheet.flatten([
          Helper.compact({
            // eslint-disable-next-line no-nested-ternary
            marginLeft: props.backIcon || props.closeIcon ? -10 : (props.placement === 'left' ? -15 : 0),
            color: centerColor,
            fontFamily: props.fontFamily,
            width: '100%',
            textAlign: props.placement
          }),
        ]),
      };
    } else if (props.logo) {
      centerComponent = (
        <QuickView marginLeft={(props.backIcon && props.placement === 'center') || (props.closeIcon && props.placement === 'center') ? -20 : 0}>
          <Image
            style={styles.defaultLogoStyle}
            source={ImageSource.logo}
          />
        </QuickView>
      );
    }

    /**
     * Right Component
     */
    let { rightComponent } = props;
    if (props.switchTheme) {
      rightComponent = (
        <QuickView row center>
          <Icon name="theme-light-dark" type="material-community" style={{ marginRight: 5 }} color="white" />
          <SwitchChangeTheme />
        </QuickView>
      );
    }

    return (
      <>
        {props.barStyle || props.statusBarProps
          ? <StatusBar {...props.statusBarProps} barStyle={props.barStyle} /> : null}
        <EHeader
          {...props.otherProps}
          placement={props.placement}
          leftComponent={leftComponent}
          centerComponent={centerComponent}
          rightComponent={rightComponent}
          containerStyle={containerStyle}
          leftContainerStyle={leftContainerStyle}
        />
      </>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(Header as any, '')) as unknown as React.ComponentClass<HeaderProps>;
