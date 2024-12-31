import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button as ElementButton,
  ButtonProps as EButtonProps,
  withTheme,
} from 'react-native-elements';
import _ from 'lodash';
import AppView from '@utils/appView';
import { withTranslation } from 'react-i18next';
import Helper from '@utils/helper';
import ComponentHelper, { IComponentBase } from '@utils/component';
import { Font } from '@fonts';

export type CustomType = {
  active: ButtonProps,
  goToExample: ButtonProps,
  input: ButtonProps,
  logout: ButtonProps,
};

export interface ButtonProps extends Omit<EButtonProps, 'raised' | 'type' | 'title'>, IComponentBase<CustomType> {
  titlePaddingVertical?: number;
  titlePaddingHorizontal?: number;
  title?: string;
  tTitle?: string | Array<any>;
  titlePosition?: 'left' | 'center' | 'right';
  borderRadius?: number;
  center?: boolean;
  bold?: boolean;
  fontSize?: number;
  outline?: boolean;
  clear?: boolean;
  sharp?: boolean;
  rounded?: boolean;
  circle?: boolean;
  color?: string;
  titleColor?: string;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  shadow?: boolean;
  fontFamily?: Font;
}

class Button extends React.PureComponent<ButtonProps> {
  private handleProps = () => {
    const props = ComponentHelper.getProps<ButtonProps>({
      initialProps: this.props,
      themeKey: 'Button',
      keys: [
        'titlePaddingVertical', 'titlePaddingHorizontal', 'center', 'bold',
        'fontSize', 'icon', 'iconRight', 'title', 'titlePosition', 'containerStyle',
        'buttonStyle', 'titleStyle', 'iconContainerStyle', 'outline', 'clear', 'sharp',
        'rounded', 'circle', 'shadow', 'outline', 'clear', 'tTitle', 'titleColor', 'fontFamily',
        'borderRadius'
      ]
    });
    ComponentHelper.handleShape(props);
    ComponentHelper.handleCommonProps(props, 'containerStyle');
    return props;
  };

  render() {
    const props = this.handleProps();

    /**
     * clear, outline, solid
     */
    let elementType: 'solid' | 'outline' | 'clear' = 'solid';
    if (props.outline) elementType = 'outline';
    else if (props.clear) elementType = 'clear';

    /**
     * containerStyle
     */
    const containerStyle: any = StyleSheet.flatten([
      props.center && { alignSelf: 'center' },
      props.shadow && { overflow: 'visible' },
      props.shadow && AppView.shadow(5),
      props.containerStyle,
    ]);

    /**
     * buttonStyle
     */
    let buttonJustifyContent;
    switch (props.titlePosition) {
      case 'left':
        buttonJustifyContent = 'flex-start';
        break;
      case 'right':
        buttonJustifyContent = 'flex-end';
        break;
      case 'center':
        buttonJustifyContent = 'center';
        break;
      default:
    }

    const buttonStyle: any = StyleSheet.flatten([
      Helper.compact({
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        justifyContent: buttonJustifyContent
      }),
      {
        paddingHorizontal: props.titlePaddingHorizontal,
        paddingVertical: props.titlePaddingVertical,
      },
      props.buttonStyle,
    ]);

    const titleStyle: any = StyleSheet.flatten([
      Helper.compact({
        fontSize: props.fontSize,
        fontWeight: props.bold ? 'bold' : 'normal',
        color: props.titleColor,
        fontFamily: props.fontFamily,
      }),
      props.titleStyle,
    ]);

    /**
     * icon, iconContainerStyle
     */
    const iconContainerStyle: any = StyleSheet.flatten([
      props.iconContainerStyle,
      { marginLeft: 0, marginRight: 0 },
      (props.icon && !props.iconRight && props.title) && { marginRight: 5 },
      (props.icon && props.iconRight && props.title) && { marginLeft: 5 },
    ]);
    const defaultIcon = {
      size: 20,
      type: 'material-community',
      color: 'white'
    };
    const icon = props.icon ? _.merge(defaultIcon, props.icon) : undefined;

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

    return (
      <ElementButton
        {...props.otherProps}
        icon={icon}
        iconRight={props.iconRight}
        containerStyle={containerStyle}
        buttonStyle={buttonStyle}
        title={title}
        type={elementType}
        color={props.color}
        titleStyle={titleStyle}
        iconContainerStyle={iconContainerStyle}
      />
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(Button as any, '')) as unknown as React.ComponentClass<ButtonProps>;
