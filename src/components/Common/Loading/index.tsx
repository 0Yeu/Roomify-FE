/* eslint-disable react/no-did-update-set-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { ActivityIndicatorProps, ActivityIndicator, StyleSheet } from 'react-native';
import Spinner, { SpinnerProps } from 'react-native-loading-spinner-overlay';
import { withTheme } from 'react-native-elements';
import { TFunction } from 'i18next';
import LottieView from 'lottie-react-native';
import AnimatedLottieLoading from '@assets/animations';
import ComponentHelper, { AnimatedLottieViewProps, IComponentBase } from '@utils/component';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

export interface LoadingProps extends Omit<ActivityIndicatorProps, 'size' | 'color'>, Omit<SpinnerProps, 'color' | 'size' | 'visible' >, IComponentBase {
  size?: 'small' | 'large';
  overlay?: boolean;
  timeout?: number;
  visible?: boolean | null;
  textColor?: string;
  animatedLottieLoading?: keyof typeof AnimatedLottieLoading;
  animatedLottieLoadingProps?: AnimatedLottieViewProps;
}

interface State {
  visibleState?: boolean | null;
}
class Loading extends Component<LoadingProps & { t: TFunction }, State> {
  static defaultProps = {
    visible: true,
    marginVertical: 10
  };

  timeout: any;

  constructor(props: any) {
    super(props);
    const { visible, timeout } = this.props;
    this.state = {
      visibleState: visible,
    };
    if (timeout && visible) {
      setTimeout(() => this.setState({ visibleState: false }), timeout);
    }
  }

  componentDidUpdate(prevProps: LoadingProps) {
    const { visible, timeout } = this.props;
    const { visibleState } = this.state;

    if (timeout) {
      if (visible) {
        if (visibleState) {
          this.timeout = setTimeout(() => {
            // eslint-disable-next-line react/destructuring-assignment
            if (this.state.visibleState) {
              this.setState({ visibleState: false });
            }
          }, timeout);
        }
      }
      if (visible !== prevProps.visible) {
        if (!visible && timeout) {
          clearTimeout(this.timeout);
        }
        this.setState({ visibleState: visible });
      }
    } else if (visible !== visibleState) {
      this.setState({ visibleState: visible });
    }
  }

  trigger = (visible: boolean = true) => {
    const { timeout } = this.props;
    this.setState({ visibleState: visible });
    if (timeout) {
      setTimeout(() => this.setState({ visibleState: false }), timeout);
    }
  };

  render() {
    const props = ComponentHelper.getProps<LoadingProps>({
      initialProps: this.props,
      themeKey: 'Text',
      keys: ['overlay', 'textColor', 'color', 'style', 'textStyle', 'animatedLottieLoading', 'animatedLottieLoadingProps', 'timeout', 'theme']
    });
    ComponentHelper.handleCommonProps(props, 'style');

    const { visibleState } = this.state;
    /**
     * Color & Style
     */
    const color = props.color || props.theme.colors.primary;
    const textColor = props.textColor || props.theme.colors.primary;

    const style: any = StyleSheet.flatten([
      props.style,
      {
        alignSelf: 'center',
        color
      },
    ]);

    const textStyle = StyleSheet.flatten([
      props.textStyle,
      {
        color: textColor,
      },
    ]);

    /**
     * TextContent
     */
    if (visibleState) {
      if (!props.overlay) {
        if (props.animatedLottieLoading) {
          return (
            <LottieView
              source={AnimatedLottieLoading[props.animatedLottieLoading]}
              loop
              autoPlay
              autoSize
              {...props.animatedLottieLoadingProps}
              style={_.omit(style, 'color')}
            />
          );
        }
        return <ActivityIndicator {...props.otherProps} color={color} style={style} />;
      }

      // Overlay
      if (props.animatedLottieLoading) {
        return (
          <Spinner
            {...props.otherProps}
            visible={visibleState}
            textContent={props.t('component:loading:loading')}
            textStyle={textStyle}
            color={color}
            customIndicator={(
              <LottieView
                source={AnimatedLottieLoading[props.animatedLottieLoading]}
                loop
                autoPlay
                autoSize
                {...props.animatedLottieLoadingProps}
                style={style}
              />
            )}
          />
        );
      }
      return (
        <Spinner
          {...props.otherProps}
          visible={visibleState}
          textContent={props.t('component:loading:loading')}
          textStyle={textStyle}
          color={color}
        />
      );
    }
    return null;
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(
  Loading as any, ''
)) as unknown as React.ComponentClass<LoadingProps>;
