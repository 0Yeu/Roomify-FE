import IconSource from '@assets/icons';
import ComponentHelper, { IComponentBase, TReturnGetProps } from '@utils/component';
import React from 'react';
import {
  Icon as EIcon,
  IconProps as EIconProps,
  withTheme,
} from 'react-native-elements';
import { SvgProps } from 'react-native-svg';
import QuickView from '../View/QuickView';

export type CustomType = {
  goToExample: IconProps
};

interface ISvg {
  name: keyof typeof IconSource;
  type: 'svg';
}

interface IIconProps extends Omit<EIconProps, 'name' | 'type' | 'color'>, Omit<SvgProps, 'style' | 'color'>, IComponentBase<CustomType> {
  circle?: boolean;
}

// eslint-disable-next-line max-len
export type IconProps = IIconProps & (ISvg | IDefault | IMaterial | IMaterialCommunity | ISimpleLineIcon | IZocial | IOcticon | IFontAwesome | IFontAwesome5 | IIonicon | IFoundation | IEvilicon | IEntypo | IAntdesign);

class Icon extends React.PureComponent<IconProps> {
  private handleProps = () => {
    const props = ComponentHelper.getProps<IconProps>({
      initialProps: this.props,
      themeKey: 'Icon',
      keys: ['containerStyle', 'iconStyle', 'onPress', 'name', 'theme', 'circle']
    });
    ComponentHelper.handleCommonProps(props, 'style');
    this.handleCircleStyle(props);
    return props;
  };

  handleCircleStyle = (props: TReturnGetProps<IconProps>) => {
    if (props.circle) {
      const borderRadius = props.size || 25;
      const containerStyle: any = props.containerStyle || {};
      props.containerStyle = {
        ...containerStyle,
        borderRadius,
        padding: 5,
        backgroundColor: props.theme.colors.grey4
      };
    }
  };

  render() {
    const props = this.handleProps();

    if (props.color) props.otherProps.fill = props.color;

    // @ts-ignore
    if (props.otherProps.type === 'svg') {
      const Component = IconSource[props.name as keyof typeof IconSource];
      return (
        <QuickView
          style={props.containerStyle}
          hitSlop={props.onPress ? { top: 20, bottom: 20, left: 20, right: 20 } : undefined}
          onPress={props.onPress}
        >
          <Component {...props.otherProps} />
        </QuickView>
      );
    }
    if (props.name) {
      return (
        <QuickView
          hitSlop={props.onPress ? { top: 20, bottom: 20, left: 20, right: 20 } : undefined}
          onPress={props.onPress}
        >
          <EIcon
            {...props.otherProps}
            name={props.name}
            color={props.color}
            containerStyle={props.containerStyle}
          />
        </QuickView>
      );
    }
    return null;
  }
}

export default withTheme(Icon as any, '') as unknown as React.ComponentClass<IconProps>;
