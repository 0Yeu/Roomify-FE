import React from 'react';
import ComponentHelper, { IComponentBase, TReturnGetProps } from '@utils/component';
import {
  Input as ElementInput,
  InputProps as EInputProps,
  withTheme,
} from 'react-native-elements';
import { Keyboard, NativeSyntheticEvent, Platform, StyleSheet, TextInputFocusEventData, TextInputSubmitEditingEventData } from 'react-native';
import AppView from '@utils/appView';
import Helper from '@utils/helper';
import { withTranslation } from 'react-i18next';
import Icon from '@components/Common/Icon';
import { FieldInputProps, useFormik } from 'formik';
import _ from 'lodash';
import { Font } from '@fonts';

export type CustomType = {
};

export interface InputProps extends IComponentBase<CustomType>, Omit<EInputProps, 'renderErrorMessage' | 'placeholderTextColor'> {
  innerRef?: any;
  outerRef?: any;
  outline?: boolean;
  clear?: boolean;
  nextFieldRef?: any;
  labelColor?: string;
  tLabel?: string;
  tPlaceholder?: string;
  borderColor?: string;
  placeholderTextColor?: string;
  forwardedRef?: any;
  fontFamily?: Font;
  // Formik
  field?: FieldInputProps<any>;
  form?: ReturnType<typeof useFormik>;
}

interface State {
  isSecure: boolean;
  value?: string;
}

class Input extends React.Component<InputProps, State> {
  static defaultProps = {
    fontFamily: AppView.fontFamily,
  };

  constructor(props: any) {
    super(props);
    const { secureTextEntry, value } = props;
    this.state = {
      isSecure: secureTextEntry || false,
      value
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.value !== prevState.value) {
      return {
        ...prevState,
        value: nextProps.value,
        language: nextProps.i18n.language
      };
    }
    return prevState;
  }

  private handleProps = () => {
    const props = ComponentHelper.getProps<InputProps>({
      initialProps: this.props,
      themeKey: 'Input',
      keys: [
        'inputContainerStyle', 'inputStyle', 'borderColor', 'labelColor', 'labelStyle',
        'placeholderTextColor', 'outline', 'clear', 'label', 'tLabel', 'placeholder', 'tPlaceholder',
        'errorMessage', 'errorStyle', 'forwardedRef', 'secureTextEntry', 'leftIcon',
        'rightIcon', 'field', 'form', 'multiline', 'numberOfLines', 'onChangeText', 'onBlur',
        'onSubmitEditing', 'nextFieldRef', 'fontFamily'
      ]
    });
    ComponentHelper.handleCommonProps(props, 'containerStyle');
    props.otherProps.fontFamily = props.fontFamily as any;
    if (props.secureTextEntry) props.otherProps.blurOnSubmit = false;

    this.handleElement(props);
    this.translate(props);
    this.handleStyle(props);

    return props;
  };

  handleElement = (props: TReturnGetProps<InputProps>) => {
    /**
     * Handle Error
     */
    if (props.form && props.field) {
      const hasError = props.form.errors[props.field.name] && props.form.touched[props.field.name];
      if (hasError) {
        const formError = props.form.errors[props.field.name];
        if (_.isArray(formError)) {
          // eslint-disable-next-line prefer-destructuring
          props.errorMessage = formError[0] as string;
        }
        props.errorMessage = formError as string;
      }
    }

    /**
     * Handle Icon
     */
    const defaultLeftIcon = {
      color: props.placeholderTextColor || props.theme.colors.grey3,
      type: 'material-community',
    };
    if (props.leftIcon) {
      props.leftIcon = _.merge(defaultLeftIcon, props.leftIcon);
    }

    const defaultRightIcon = {
      color: props.placeholderTextColor || props.theme.colors.grey3,
      type: 'material-community',
    };
    if (props.rightIcon) {
      props.rightIcon = _.merge(defaultRightIcon, props.rightIcon);
    }

    if (props.secureTextEntry && !props.rightIcon) {
      const { isSecure } = this.state;
      props.rightIcon = (
        <Icon
          name={isSecure ? 'ios-eye' : 'ios-eye-off'}
          type="ionicon"
          onPress={() => this.setState({ isSecure: !isSecure })}
          color={defaultRightIcon.color as any}
        />
      );
    }
  };

  translate = (props: TReturnGetProps<InputProps>) => {
    /**
     * Translation
     */
    if (!props.label && props.tLabel) {
      if (typeof props.tLabel === 'string') {
        props.label = props.t(props.tLabel);
      } else if (typeof props.tLabel === 'object') {
        props.label = props.t(props.tLabel[0], props.tLabel[1]);
      }
    }
    if (!props.placeholder && props.tPlaceholder) {
      if (typeof props.tPlaceholder === 'string') {
        props.placeholder = props.t(props.tPlaceholder);
      } else if (typeof props.tPlaceholder === 'object') {
        props.placeholder = props.t(props.tPlaceholder[0], props.tPlaceholder[1]);
      }
    }
  };

  handleStyle = (props: TReturnGetProps<InputProps>) => {
    /**
     * clear, outline, solid
     */
    let elementType: 'solid' | 'outline' | 'clear' = 'solid';
    if (props.outline) elementType = 'outline';
    else if (props.clear) elementType = 'clear';

    let inputContainerBackgroundColor = props.backgroundColor || props.theme.colors.grey5;
    const inputContainerPaddingHorizontal = AppView.titlePaddingHorizontal;
    let inputContainerMarginTop = 0;
    // eslint-disable-next-line no-nested-ternary
    const inputContainerMarginBottom = props.errorMessage ? 0 : (props.label ? 15 : 10);
    let inputContainerBorderBottomWidth = 0;
    let inputContainerBorderWidth = 0;
    let inputContainerBorderRadius = props.borderRadius || AppView.roundedBorderRadius;

    switch (elementType) {
      case 'outline':
        inputContainerBackgroundColor = 'transparent';
        inputContainerMarginTop = 5;
        inputContainerBorderBottomWidth = 1;
        inputContainerBorderWidth = 1;
        break;
      case 'clear':
        inputContainerBackgroundColor = 'transparent';
        inputContainerBorderBottomWidth = 1;
        inputContainerBorderWidth = 0;
        inputContainerBorderRadius = 0;
        break;
      default:
        inputContainerMarginTop = 5;
    }

    /**
     * containerStyle
     */
    // eslint-disable-next-line react/destructuring-assignment
    const containerStyleProp: any = this.props.containerStyle;
    props.containerStyle = StyleSheet.flatten([
      props.containerStyle,
      {
        backgroundColor: containerStyleProp?.backgroundColor,
        paddingHorizontal: containerStyleProp?.paddingHorizontal || 0
      }
    ]);

    /**
     * inputContainerStyle
     */
    props.inputContainerStyle = StyleSheet.flatten([
      {
        backgroundColor: inputContainerBackgroundColor,
        paddingHorizontal: inputContainerPaddingHorizontal,
        borderBottomWidth: inputContainerBorderBottomWidth,
        borderColor: props.borderColor,
        borderWidth: inputContainerBorderWidth,
        borderRadius: inputContainerBorderRadius,
        marginTop: inputContainerMarginTop,
        marginBottom: inputContainerMarginBottom,
      },
      props.inputContainerStyle,
    ]);

    /**
     * inputStyle
     */

    let inputPaddingTop = 0;
    let inputPaddingBottom = 0;
    let inputMarginBottom = 0;
    let inputHeight;
    let inputColor = props.color;
    if (props.multiline) {
      inputPaddingTop = 8;
      inputPaddingBottom = 5;
      inputMarginBottom = 5;
      props.numberOfLines = props.numberOfLines || 3;
      inputHeight = 40 * (props.numberOfLines - 1);
      if (!inputColor) inputColor = props.theme.colors.black;
    }

    props.inputStyle = StyleSheet.flatten([
      Helper.compact({
        color: inputColor,
        paddingTop: inputPaddingTop,
        paddingBottom: inputPaddingBottom,
        marginBottom: inputMarginBottom,
        height: inputHeight,
        marginLeft: Platform.OS === 'android' ? -3 : 0
      }),
      props.inputStyle,
    ]);

    /**
     * labelStyle
     */
    props.labelStyle = StyleSheet.flatten([
      Helper.compact({
        color: props.labelColor,
        fontFamily: props.fontFamily,
      }),
      props.labelStyle,
    ]);

    /**
     * errorStyle
     */
    props.errorStyle = StyleSheet.flatten([
      Helper.compact({
        marginLeft: 0,
        // textAlign: 'right'
      }),
      props.errorStyle,
    ]);
  };

  onChangeText = (text: string) => {
    const {
      onChangeText,
      field,
      // multiline
    } = this.handleProps();
    // SetState value for updating style based on theme when multiline === true
    // UI = multiline === true ? UITextView : TextInput
    // if (multiline) this.setState({ value: text });
    this.setState({ value: text });

    if (onChangeText) onChangeText(text);
    if (field) {
      field.onChange(field.name)(text);
    }
  };

  setText = (text: string) => this.setState({ value: text });

  onBlur = (e?: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const props = this.handleProps();
    if (props.onBlur) props.onBlur(e as any);
    if (props.form && props.field) {
      props.form.setFieldTouched(props.field.name);
      props.field.onBlur(props.field.name);
    }
  };

  onSubmitEditing = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const props = this.handleProps();

    if (props.onSubmitEditing) props.onSubmitEditing(e);
    if (props.secureTextEntry) {
      this.onBlur();
      Keyboard.dismiss();
    }

    if (props.nextFieldRef && props.nextFieldRef?.current?.focus && !props.multiline) {
      if (props.form && props.field) {
        const error = await props.form.validateForm();
        if (!_.has(error, props.field.name)) {
          props.nextFieldRef.current.focus();
        }
      } else {
        props.nextFieldRef.current.focus();
      }
    }
  };

  render() {
    const { isSecure, value } = this.state;
    const props = this.handleProps();
    return (
      <ElementInput
        {...props.otherProps}
        ref={props.forwardedRef}
        containerStyle={props.containerStyle}
        inputContainerStyle={props.inputContainerStyle}
        inputStyle={props.inputStyle}
        style={props.inputStyle}
        labelStyle={props.labelStyle}
        label={props.label}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        renderErrorMessage={!!props.errorMessage}
        errorMessage={props.errorMessage}
        errorStyle={props.errorStyle}
        secureTextEntry={isSecure}
        rightIcon={props.rightIcon}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        leftIcon={props.leftIcon}
        onChangeText={this.onChangeText}
        onBlur={this.onBlur}
        value={value}
        onSubmitEditing={this.onSubmitEditing}
      />
    );
  }
}

const ThemeInput: any = withTheme(Input as any, '');
const CustomInput = React.forwardRef((props: any, ref) => {
  if (ref) {
    return (
      <ThemeInput {...props} forwardedRef={ref} ref={props.outerRef} />
    );
  }
  return (
    <ThemeInput {...props} forwardedRef={props.innerRef} ref={props.outerRef} /> // For Formik
  );
});

export default withTranslation(
  undefined, { withRef: true }
)(CustomInput) as unknown as React.ComponentClass<InputProps>;
