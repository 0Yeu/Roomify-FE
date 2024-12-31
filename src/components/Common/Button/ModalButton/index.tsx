import React, { PureComponent, ReactNode } from 'react';
import Modal, { ModalProps as RNModalProps } from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import AppHelper from '@utils/appHelper';
import _ from 'lodash';
import { OrNull } from 'react-native-modal/dist/types';
import { Animation, CustomAnimation } from 'react-native-animatable';
import { NavigationService } from '@utils/navigation';
import modalStack from '@src/containers/Modal/routes';
import { Theme, withTheme } from 'react-native-elements';
import AppView from '@utils/appView';
import QuickView from '../../View/QuickView';
import Button, { ButtonProps } from '../DefaultButton';
import Text from '../../Text';

interface ModalProps extends Pick<RNModalProps, 'onSwipeStart' | 'onSwipeMove' | 'onSwipeComplete' | 'onSwipeCancel' | 'style' | 'swipeDirection' | 'onDismiss' | 'onShow' | 'hardwareAccelerated' | 'onOrientationChange' | 'presentationStyle'> {
  backdropClose?: boolean;
  type?: 'notification' | 'confirmation' | 'bottom-half' | 'fullscreen' ;
  title?: string | Element;
  onOkButtonPress?: () => any;
  onCancelButtonPress?: () => any;
  okTitle?: string | Element;
  cancelTitle?: string | Element;
  animationIn?: Animation | CustomAnimation;
  animationInTiming?: number;
  animationOut?: Animation | CustomAnimation;
  animationOutTiming?: number;
  avoidKeyboard?: boolean;
  coverScreen?: boolean;
  hasBackdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  backdropTransitionInTiming?: number;
  backdropTransitionOutTiming?: number;
  customBackdrop?: ReactNode;
  useNativeDriver?: boolean;
  deviceHeight?: number;
  deviceWidth?: number;
  hideModalContentWhileAnimating?: boolean;
  propagateSwipe?: boolean;
  isVisible?: boolean;
  onModalShow?: () => void;
  onModalWillShow?: () => void;
  onModalHide?: () => void;
  onModalWillHide?: () => void;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  swipeThreshold?: number;
  scrollTo?: OrNull<(e: any) => void>;
  scrollOffset?: number;
  scrollOffsetMax?: number;
  scrollHorizontal?: boolean;
  snapPoints?: Array<string | number>;
  theme?: any;
}

export interface ModalButtonProps extends Omit<ButtonProps, 'onPress'> {
  ref?: any;
  buttonChildren?: React.ReactNode;
  invisible?: boolean;
  modalProps?: ModalProps;
  onPress?: () => any;
  onClose?: () => any;
}

interface State {
  isVisible: boolean;
  forwardData: null;
}
class ModalButton extends PureComponent<ModalButtonProps & { theme: Theme }, State> {
  children: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: false,
      forwardData: null
    };
    const { children } = this.props;
    if (children) {
      const listOfProps: any = {
        close: this.close
      };
      const nodeWithProps = React.cloneElement(
        children as any,
        listOfProps,
      );
      this.children = nodeWithProps;
    }
  }

  open = (data?: any) => {
    const { modalProps, children } = this.props;
    const { forwardData } = this.state;
    if (data && JSON.stringify(data) !== JSON.stringify(forwardData)) {
      this.setState({ forwardData: data });
      const listOfProps: any = {
        close: this.close,
        forwardData: data
      };
      const nodeWithProps = React.cloneElement(
        children as any,
        listOfProps,
      );
      this.children = nodeWithProps;
    }
    if (modalProps && modalProps.type === 'fullscreen') {
      const name = AppHelper.setModalIntoGlobal({ content: children });
      if (data) {
        NavigationService.navigate(modalStack.defaultModal, { name, data });
      }
      NavigationService.navigate(modalStack.defaultModal, { name });
    } else {
      const { onPress } = this.props;
      this.setState({ isVisible: true });
      if (onPress) onPress();
    }
  };

  renderChildren = () => {
    const { theme, modalProps, children } = this.props;
    const { forwardData } = this.state;
    if (children) {
      const listOfProps: any = {
        close: this.close
      };
      if (forwardData) listOfProps.forwardData = forwardData;
      const nodeWithProps = React.cloneElement(
        children as any,
        listOfProps,
      );
      return nodeWithProps;
    }

    if (modalProps) {
      const defaultModalProps: any = _.merge({
        backdropClose: true,
        type: 'notification',
      }, modalProps);
      const {
        type,
        title,
        onOkButtonPress,
        onCancelButtonPress,
        okTitle,
        cancelTitle,
      } = defaultModalProps;

      const titleComponent = typeof title === 'string' ? <Text h3 center marginBottom={15}>{title}</Text> : title;
      return (
        <QuickView
          backgroundColor={theme.colors.white}
          borderRadius={AppView.roundedBorderRadius}
          width={300}
          center
          padding={15}
        >
          {titleComponent}
          <QuickView row center>
            {
            type === 'notification' ? (
              <Button
                title={okTitle}
                tTitle="ok"
                width={100}
                onPress={() => {
                  this.setState({ isVisible: false });
                  if (onOkButtonPress) onOkButtonPress();
                }}
              />
            )
              : (
                <>
                  <Button
                    title={okTitle}
                    tTitle="ok"
                    titlePaddingHorizontal={15}
                    marginRight={10}
                    width={100}
                    onPress={() => {
                      this.setState({ isVisible: false });
                      if (onOkButtonPress) onOkButtonPress();
                    }}
                  />
                  <Button
                    title={cancelTitle}
                    tTitle="cancel"
                    outline
                    titlePaddingHorizontal={15}
                    width={100}
                    marginLeft={10}
                    onPress={() => {
                      this.setState({ isVisible: false });
                      if (onCancelButtonPress) onCancelButtonPress();
                    }}
                  />
                </>
              )
            }
          </QuickView>
        </QuickView>
      );
    }
    return null;
  };

  close = () => {
    const { modalProps } = this.props;
    if (modalProps?.type === 'fullscreen') {
      NavigationService.goBack();
    } else {
      this.setState({ isVisible: false });
    }
  };

  render() {
    const { isVisible } = this.state;
    const {
      modalProps,
      children,
      invisible,
      buttonChildren,
      onClose,
      ...otherProps
    } = this.props;

    let defaultModalProps: ModalProps = {
      backdropClose: true,
      type: 'notification',
    };

    if (modalProps && !_.isUndefined(modalProps.swipeDirection)) {
      defaultModalProps.swipeDirection = modalProps.swipeDirection;
    } else {
      defaultModalProps.swipeDirection = (modalProps?.type === 'notification' || modalProps?.type === 'confirmation') ? ['up', 'down'] : undefined;
    }

    // Animation
    if (modalProps?.type === 'notification' || modalProps?.type === 'confirmation') {
      defaultModalProps = _.merge(defaultModalProps, {
        animationIn: 'zoomIn',
        animationOut: 'zoomOut',
        animationInTiming: 150,
        animationOutTiming: 150,
        backdropTransitionInTiming: 150,
        backdropTransitionOutTiming: 150,
      });
    }

    if (defaultModalProps.swipeDirection) {
      defaultModalProps.onSwipeComplete = () => this.setState({ isVisible: false });
    }

    const handledModalProps = _.merge(defaultModalProps, modalProps);
    const {
      backdropClose,
      type,
      title,
      onOkButtonPress,
      style,
      ...otherModalProps
    } = handledModalProps;

    /**
     * fullscreen
     */
    if (type === 'fullscreen') {
      const { onPress, ...customOtherProps } = otherProps;
      const onPressFn = () => {
        const content = children;
        const name = AppHelper.setModalIntoGlobal({ content });
        NavigationService.navigate(modalStack.defaultModal, { name });
        if (onPress) onPress();
      };
      if (invisible) {
        return (
          <TouchableOpacity onPress={onPressFn}>
            {buttonChildren}
          </TouchableOpacity>
        );
      }
      return (
        <Button
          {...customOtherProps}
          onPress={onPressFn}
        />
      );
    }

    /**
     * Other types
     */
    let customStyle = style;
    if (type === 'bottom-half') {
      const bottomHalfStyle = {
        justifyContent: 'flex-end',
        margin: 0,
      };
      customStyle = _.merge(bottomHalfStyle, style);
    } else {
      const defaultStyle = {
        margin: 0,
      };
      customStyle = _.merge(defaultStyle, style);
    }

    return (
      <>
        {
          invisible ? (
            <TouchableOpacity onPress={() => this.open()}>
              {buttonChildren}
            </TouchableOpacity>
          )
            : <Button {...otherProps} onPress={() => this.open()} />
        }

        <Modal
          {...otherModalProps}
          isVisible={isVisible}
          onBackdropPress={() => {
            if (otherModalProps.onBackdropPress) otherModalProps.onBackdropPress();
            if (backdropClose) this.setState({ isVisible: false });
            if (onClose) onClose();
          }}
          style={customStyle}
        >
          {this.renderChildren()}
        </Modal>
      </>
    );
  }
}

export default withTheme(
  ModalButton as any, ''
) as unknown as React.ComponentClass<ModalButtonProps>;
