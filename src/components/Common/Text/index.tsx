import React, { PureComponent } from 'react';
import {
  Text as EText,
  Icon as EIcon,
  IconProps as EIconProps,
  TextProps as ETextProps,
  withTheme
} from 'react-native-elements';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { withTranslation } from 'react-i18next';
import { Font } from '@fonts';
import Helper from '@utils/helper';
import ComponentHelper, { IComponentBase } from '@utils/component';
import QuickView from '../View/QuickView';

export interface TextProps extends Omit<ETextProps, 'fontFamily'>, IComponentBase {
  fontFamily?: Font;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;
  center?: boolean;
  iconRight?: boolean;
  thin?: boolean;
  bold?: boolean;
  semibold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: any;
  icon?: EIconProps;
  iconContainerStyle?: any;
  tText?: string | Array<any>;
}

class Text extends PureComponent<TextProps> {
  private handleProps = () => {
    const props = ComponentHelper.getProps<TextProps>({
      initialProps: this.props,
      themeKey: 'Text',
      keys: ['fontFamily', 'fontSize', 'fontWeight', 'success', 'warning', 'error', 'center', 'iconRight', 'thin', 'bold', 'italic', 'underline', 'children', 'icon', 'iconContainerStyle', 'style', 'tText']
    });
    ComponentHelper.handleCommonProps(props, 'style');
    return props;
  };

  render() {
    const props = this.handleProps();

    /**
     * style
     */
    const style: StyleProp<TextStyle> = StyleSheet.flatten([
      Helper.compact({
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        fontStyle: props.italic ? 'italic' : 'normal',
        // eslint-disable-next-line no-nested-ternary
        fontWeight: props.fontWeight || (props.thin ? '200' : props.bold ? 'bold' : 'normal'),
        textAlign: props.center ? 'center' : 'auto',
        textDecorationLine: props.underline ? 'underline' : 'none',
      }),
      props.style,
    ]);

    /**
     * iconStyle
     */
    const iconStyle = StyleSheet.flatten([
      style,
      { marginRight: props.iconRight ? 0 : 2 },
      { marginLeft: props.iconRight ? 2 : 0 },
      props.iconContainerStyle,
    ]);

    /**
     * Translation
     */
    let text = props.children;
    if (typeof props.children === 'string' || typeof props.children === 'undefined') {
      if (props.tText) {
        const additionalText = typeof props.children === 'string' ? props.children : '';
        if (typeof props.tText === 'string') {
          text = `${props.t(props.tText)}${additionalText}`;
        } else if (typeof props.tText === 'object') {
          text = `${props.t(props.tText[0], props.tText[1])}${additionalText}`;
        }
      }
      props.children = text;
    }

    if (props.icon) {
      return (
        <QuickView row={!props.iconRight} rowReverse={props.iconRight} justifyContent={props.iconRight ? 'flex-end' : 'flex-start'}>
          <QuickView style={iconStyle}>
            <EIcon {...props.icon} name={props.icon.name} type={props.icon.type || 'material-community'} size={props.icon.size || 15} color={props.icon.color || props.color} />
          </QuickView>
          <QuickView>
            <EText {...props.otherProps} style={style}>
              {props.children}
            </EText>
          </QuickView>
        </QuickView>
      );
    }

    return (
      <EText {...props.otherProps} style={style}>
        {props.children}
      </EText>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(Text as any, '')) as unknown as React.ComponentClass<TextProps>;
