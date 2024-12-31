import React, { PureComponent } from 'react';
import {
  View,
  ImageBackgroundProps,
  ImageBackground,
  StyleSheet,
  ViewProps,
  TouchableOpacityProps,
  TouchableOpacity,
  ScrollView,
  ScrollViewProps,
  TouchableWithoutFeedback,
  Keyboard,
  GestureResponderEvent,
  Platform,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import AppView from '@utils/appView';
import ComponentHelper, { IComponentBase } from '@utils/component';
import Helper from '@utils/helper';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';

export interface QuickViewProps extends ViewProps, TouchableOpacityProps, Omit<ScrollViewProps, 'scrollEnabled'>, KeyboardAvoidingViewProps, KeyboardAwareScrollViewProps, IComponentBase {
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  position?: 'absolute' | 'relative';
  zIndex?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  center?: boolean;
  horizontalCenter?: boolean;
  verticalCenter?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: any;
  row?: boolean;
  column?: boolean;
  rowReverse?: boolean;
  columnReverse?: boolean;
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
  alignSelf?: 'auto' | 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  alignItems?: 'auto' | 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  backgroundImage?: ImageBackgroundProps;
  backgroundImageStyle?: StyleProp<ImageStyle>;
  sharp?: boolean;
  rounded?: boolean;
  circle?: boolean;
  scrollable?: boolean;
  touchableComponent?: 'TouchableOpacity' | 'TouchableWithoutFeedback';
  dismissKeyboard?: boolean;
  shadow?: boolean;
  keyboardAvoidingView?: boolean;
  keyboardAwareScrollView?: boolean;
}

class QuickView extends PureComponent<QuickViewProps> {
  static defaultProps = {
    column: true,
    touchableComponent: 'TouchableOpacity',
    borderRadius: 0,
    enableOnAndroid: true
  };

  renderSubChildren = (containerStyle: any, otherProps: any) => {
    const {
      onPress: onPressProp,
      touchableComponent: touchableComponentProp,
      dismissKeyboard,
      scrollable,
      keyboardAwareScrollView,
      children
    } = this.props;
    let onPress: any = onPressProp;
    let touchableComponent = touchableComponentProp;
    if (dismissKeyboard) {
      if (!scrollable) {
        onPress = (event: GestureResponderEvent) => {
          Keyboard.dismiss();
          if (onPressProp) onPressProp(event);
        };
        touchableComponent = 'TouchableWithoutFeedback';
      }
    }

    let Component: any;
    if (onPress) {
      switch (touchableComponent) {
        case 'TouchableWithoutFeedback':
          Component = TouchableWithoutFeedback;
          break;
        default:
          Component = TouchableOpacity;
          break;
      }
    } else if (scrollable) {
      if (keyboardAwareScrollView) {
        Component = KeyboardAwareScrollView;
      } else {
        Component = ScrollView;
      }
    } else {
      Component = View;
    }

    return (
      <Component
        {...otherProps}
        onPress={onPress}
        style={containerStyle}
      >
        {touchableComponent === 'TouchableWithoutFeedback' ? (
          <View
            {...otherProps}
            style={containerStyle}
          >
            {children}
          </View>
        ) : children}
      </Component>
    );
  };

  renderChildren = (containerStyle: any, otherProps: any) => {
    const { keyboardAvoidingView } = this.props;
    if (keyboardAvoidingView) {
      return (
        <KeyboardAvoidingView
          {...otherProps}
          style={containerStyle}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {this.renderSubChildren(containerStyle, otherProps)}
        </KeyboardAvoidingView>
      );
    }
    return this.renderSubChildren(containerStyle, otherProps);
  };

  render() {
    const props = ComponentHelper.getProps<QuickViewProps>({
      initialProps: this.props,
      keys: [
        'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
        'position', 'zIndex', 'top', 'bottom', 'left', 'right',
        'horizontalCenter', 'verticalCenter', 'center',
        'style', 'row', 'column', 'rowReverse', 'columnReverse',
        'justifyContent', 'alignSelf', 'backgroundImage', 'backgroundImageStyle',
        'sharp', 'rounded', 'circle', 'scrollable', 'touchableComponent',
        'dismissKeyboard', 'shadow', 'keyboardAvoidingView', 'onPress'
      ]
    });
    ComponentHelper.handleCommonProps(props, 'style');
    ComponentHelper.handleShape(props);

    /**
     * containerStyle
     */
    let { row, rowReverse, column, columnReverse } = props;
    if (row || rowReverse) {
      column = false;
      columnReverse = false;
    }
    if (column || columnReverse) {
      row = false;
      rowReverse = false;
    }

    /**
     * containerStyle
     */
    const containerStyle: any = StyleSheet.flatten([
      props.style,
      Helper.compact({
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderTopRightRadius: props.borderTopLeftRadius,
        borderBottomLeftRadius: props.borderTopLeftRadius,
        borderBottomRightRadius: props.borderTopLeftRadius,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        justifyContent: props.justifyContent,
        alignSelf: props.alignSelf,
        alignItems: props.alignItems,
        zIndex: props.zIndex
      }),
      props.shadow && AppView.shadow(),
      props.center && {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      ((props.horizontalCenter && !(row || rowReverse))
      || (props.verticalCenter && (row || rowReverse))) && {
        alignItems: 'center',
      },
      ((props.horizontalCenter && (row || rowReverse))
      || (props.verticalCenter && !(row || rowReverse))) && {
        justifyContent: 'center',
      },
      row && { flexDirection: 'row' },
      column && { flexDirection: 'column' },
      rowReverse && { flexDirection: 'row-reverse' },
      columnReverse && { flexDirection: 'column-reverse' }
    ]);

    if (props.backgroundImage) {
      const backgroundStyle: any = [
        {
          flex: 1,
          resizeMode: 'cover',
        },
        props.backgroundImageStyle,
      ];
      return (
        <ImageBackground
          style={backgroundStyle}
          {...props.backgroundImage}
        >
          {this.renderChildren(containerStyle, props.otherProps)}
        </ImageBackground>
      );
    }
    return this.renderChildren(containerStyle, props.otherProps);
  }
}

export default QuickView;
