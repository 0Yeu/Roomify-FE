/* eslint-disable max-len */
import React from 'react';
import ComponentHelper from '@utils/component';
import { withTheme } from 'react-native-elements';
import { Formik, Field, FormikProps } from 'formik';
import _ from 'lodash';
import { View } from 'react-native';
import ErrorText from '@components/Custom/Text/ErrorText';
import Picker, { PickerProps } from '@components/Common/Picker';
import DateTimePicker, { DateTimePickerProps } from '@components/Common/DateTimePicker';
import EditableImage from '@components/Common/Image/EditableImage';
import Button, { ButtonProps } from '@components/Common/Button/DefaultButton';
import Image from '@components/Common/Image/DefaultImage';
import Input, { InputProps } from '@components/Common/Input/DefaultInput';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';
import RNImagePicker from 'react-native-image-crop-picker';
import Text from '@components/Common/Text';
import Api from '@utils/api';
import AppHelper from '@utils/appHelper';

export type CustomType = {
};

export interface FormInput extends Omit<InputProps, 'customType'>,
  Omit<DateTimePickerProps, 'accessibilityActions' | 'accessibilityElementsHidden' | 'accessibilityHint' | 'accessibilityIgnoresInvertColors' | 'accessibilityLabel' | 'accessibilityLiveRegion' | 'accessibilityRole' | 'accessibilityState' | 'accessibilityValue' | 'accessibilityViewIsModal' | 'accessible' | 'collapsable' | 'customType' | 'focusable' | 'hasTVPreferredFocus' | 'hitSlop' | 'importantForAccessibility' | 'isTVSelectable' | 'nativeID' | 'needsOffscreenAlphaCompositing' | 'onAccessibilityAction' | 'onAccessibilityEscape' | 'onAccessibilityTap' | 'onBlur' | 'onChange' | 'onFocus' | 'onLayout' | 'onMagicTap' | 'onMoveShouldSetResponder' | 'onMoveShouldSetResponderCapture' | 'onResponderEnd' | 'onResponderGrant' | 'onResponderMove' | 'onResponderReject' | 'onResponderRelease' | 'onResponderStart' | 'onResponderTerminate' | 'onResponderTerminationRequest' | 'onStartShouldSetResponder' | 'onStartShouldSetResponderCapture' | 'onTouchCancel' | 'onTouchEnd' | 'onTouchEndCapture' | 'onTouchStart' | 'onTouchMove' | 'placeholderTextColor' | 'pointerEvents' | 'removeClippedSubviews' | 'renderToHardwareTextureAndroid' | 'shouldRasterizeIOS' | 'style' | 'testID' | 'tvParallaxMagnification' | 'tvParallaxProperties' | 'tvParallaxShiftDistanceX' | 'tvParallaxShiftDistanceY' | 'tvParallaxTiltAngle' | 'value'>,
  Omit<PickerProps, 'mode' | 'onPress' | 'placeholderTextColor' | 'onFocus' | 'ref' | 'tPlaceholder' | 'onBlur'>{
  name: string;
  type: 'name' | 'text' | 'number' | 'textarea' | 'picker' | 'dateTimePicker' | 'image' | 'email' | 'password' | 'confirmPassword' | 'none';
  tField: string;
  initialValue?: any;
  customType?: any;
}

export interface FormProps {
  data: FormInput[];
  url: string;
  method?: 'post' | 'put' | 'patch';
  handleDataOnPreSubmit?: (data: any) => any;
  onSubmitSuccess?: (result: any) => any;
  showSuccessMessage?: boolean;
  submitButtonProps?: ButtonProps;
  customType?: keyof CustomType
}
interface State {
  loading: boolean;
  error: any;
  success: boolean;
  showImage: boolean;
}

class Form extends React.PureComponent<FormProps, State> {
  static defaultProps = {
    method: 'post',
    showSuccessMessage: true
  };

  constructor(props: any) {
    super(props);
    const { data } = this.props;
    data.forEach((e) => {
      // @ts-ignore
      this[e.name] = React.createRef();
    });
    this.state = {
      loading: false,
      error: null,
      success: false,
      showImage: false
    };
  }

  private handleProps = () => {
    const props = ComponentHelper.getProps<FormProps>({
      initialProps: this.props,
      themeKey: 'Form',
      keys: ['data', 'method', 'url', 'submitButtonProps', 'handleDataOnPreSubmit', 'onSubmitSuccess', 'showSuccessMessage']
    });
    return props;
  };

  getFieldValidationShape = (input: FormInput) => {
    const { t } = this.handleProps();

    switch (input.type) {
      case 'text':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }));
      case 'name':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }))
          .matches(/^[^0-9()[\]{}*&^%$#@!]*$/, t('validator:invalid', { field: t(input.tField) }))
          .max(40, ({ max }) => t('validator:max', { field: t(input.tField), max }));
      case 'number':
        return Yup.number()
          .typeError(t('validator:is_number', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }));
      case 'textarea':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }))
          .min(20, ({ min, value }) => t('validator:min', { remain: min - value.length }));
      case 'picker':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }));
      case 'dateTimePicker':
        return Yup.date()
          .typeError(t('validator:is_datetime', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }));
      case 'image':
        return Yup.object()
          .typeError(t('validator:is_object', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }));
      case 'email':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }))
          .email(t('validator:invalid_email'));
      case 'password':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }))
          .min(6, t('validator:too_short'));
      case 'confirmPassword':
        return Yup.string()
          .typeError(t('validator:is_string', { field: t(input.tField) }))
          .required(t('validator:required', { field: t(input.tField) }))
          .oneOf([Yup.ref('password')], t('validator:not_match'));
        // Yup.string()
        // .required('Required')
        // .test(
        //   'confirm-password-test',
        //   'Password and confirm password should match',
        //   function compare(value) {
        //     return value === this.parent.password;
        //   },
        // ),
      default:
        return null;
    }
  };

  getFormValidationSchema = () => {
    const { data } = this.handleProps();
    const shape: any = {};
    data?.forEach((e) => {
      shape[e.name] = this.getFieldValidationShape(e);
    });

    return Yup.object().shape(shape);
  };

  getInitialValues = () => {
    const { data } = this.handleProps();
    const initialValues: any = {};
    data?.forEach((e) => {
      initialValues[e.name] = e.initialValue;
    });

    return initialValues;
  };

  onSubmit = async (values: any) => {
    this.setState({ loading: true, error: null });
    const props = this.handleProps();
    if (props.handleDataOnPreSubmit) {
      values = props.handleDataOnPreSubmit(values);
    }
    // eslint-disable-next-line no-console
    console.log('Values: ', values);
    let result = null;
    try {
      switch (props.method) {
        case 'post':
          result = await Api.post(props.url as string, values);
          break;
        case 'put':
          result = await Api.put(props.url as string, values);
          break;
        case 'patch':
          result = await Api.patch(props.url as string, values);
          break;
        default:
      }
      if (props.onSubmitSuccess) {
        props.onSubmitSuccess(result);
      }
      this.setState({ success: true, loading: false });
    } catch (error) {
      this.setState({ error: AppHelper.handleException(error), loading: false });
    }
  };

  renderError = (error?: string) => {
    if (error) return <ErrorText error={error} center={false} fontSize={12} marginTop={-10} />;
    return null;
  };

  renderItem = (input: FormInput, index: number, formikProps: FormikProps<any>) => {
    const props = this.handleProps();
    const { showImage } = this.state;
    let nextFieldRef: any = null;
    // @ts-ignore
    if (props.data[index + 1]) nextFieldRef = this[props.data[index + 1].name];

    const otherProps: any = _.omit(input, 'name', 'type');
    switch (input.type) {
      case 'text':
      case 'name':
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            nextFieldRef={nextFieldRef}
          />
        );
      case 'number':
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            nextFieldRef={nextFieldRef}
            keyboardType="number-pad"
          />
        );
      case 'textarea':
        return (
          <Field
            key={index.toString()}
            numberOfLines={3}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            multiline
            nextFieldRef={nextFieldRef}
          />
        );
      case 'picker':
        return (
          <React.Fragment key={index.toString()}>
            <Picker
              {...otherProps} // @ts-ignore
              ref={this[input.name]}
              customType="input"
              onClose={() => { formikProps.setFieldTouched(input.name, true); }}
              onValueChange={(value) => {
                formikProps.setFieldTouched(input.name, true);
                formikProps.setFieldValue(input.name, value);
                if (nextFieldRef.current) nextFieldRef.current.focus();
              }}
            />
            {formikProps.touched[input.name] && this.renderError(formikProps.errors[input.name] as string | undefined)}
          </React.Fragment>
        );
      case 'dateTimePicker':
        return (
          <React.Fragment key={index.toString()}>
            <DateTimePicker
              {...otherProps} // @ts-ignore
              ref={this[input.name]}
              mode="datetime"
              display="spinner"
              customType="input"
              onSubmit={(date: Date) => {
                formikProps.setFieldTouched(input.name, true);
                formikProps.setFieldValue(input.name, date);
              }}
              onClose={() => { formikProps.setFieldTouched(input.name, true); }}
            />
            {formikProps.touched[input.name] && this.renderError(formikProps.errors[input.name] as string | undefined)}
          </React.Fragment>
        );
      case 'image':
        return (
          <React.Fragment key={index.toString()}>
            {!showImage && (
            <EditableImage
              {...otherProps} // @ts-ignore
              ref={this[input.name]}
              buttonChildren={(
                <Button
                  tTitle="placeholder:cover_image"
                  TouchableComponent={View}
                  titlePaddingVertical={3} // for TouchableComponent = View
                  customType="input"
                />
                  )}
              folderPrefix="images"
              uploadCallback={() => {}}
              imagePickerButtonProps={{
                imageWidth: 500,
                imageHeight: 500,
              }}
              onClose={() => { formikProps.setFieldTouched(input.name, true); }}
              pickSuccess={(value) => {
                formikProps.setFieldTouched(input.name, true);
                if (_.isArray(value)) {
                  formikProps.setFieldValue(input.name, value[0]);
                }
                this.setState({ showImage: true });
              }}
            />
            )}
            {formikProps.touched[input.name] && this.renderError(formikProps.errors[input.name] as string | undefined)}
            {formikProps.values.coverImage && showImage && (
            <Image
              // @ts-ignore
              source={{ uri: formikProps.values.coverImage?.path }}
              marginVertical={5}
              viewEnable
              onClose={() => {
                formikProps.setFieldValue('coverImage', undefined);
                this.setState({ showImage: false });
                RNImagePicker.clean();
              }}
            />
            )}
          </React.Fragment>
        );
      case 'email':
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            keyboardType="email-address"
            textContentType="emailAddress"
            nextFieldRef={nextFieldRef}
          />
        );
      case 'password':
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            secureTextEntry
            textContentType="password"
            nextFieldRef={nextFieldRef}
          />
        );
      case 'confirmPassword':
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            secureTextEntry
            nextFieldRef={nextFieldRef}
          />
        );
      default:
        return (
          <Field
            key={index.toString()}
            {...otherProps} // @ts-ignore
            innerRef={this[input.name]}
            component={Input}
            name={input.name}
            nextFieldRef={nextFieldRef}
          />
        );
    }
  };

  render() {
    const props = this.handleProps();
    const formValidationSchema = this.getFormValidationSchema();
    const initialValues = this.getInitialValues();
    const { loading, success, error } = this.state;
    // @ts-ignore
    // eslint-disable-next-line prefer-destructuring
    const data: any = props.data;
    return (
      <>
        {props.showSuccessMessage && success ? <Text success center h3 tText="submit_success" marginVertical={10} /> : null}
        {error ? <ErrorText error={error} /> : null}
        <Formik
          key={props.i18n.language}
          validationSchema={formValidationSchema}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
        >
          {(formikProps) => (
            <>
              {props.data?.map((e, index) => this.renderItem(
                e, index, formikProps
              ))}
              <Button
                onPress={formikProps.handleSubmit}
                tTitle="submit"
                disabled={!formikProps.isValid || !formikProps.values[data[0].name]}
                loading={loading}
                {...props.submitButtonProps}
              />
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(
  Form as any, ''
)) as unknown as React.ComponentClass<FormProps>;
