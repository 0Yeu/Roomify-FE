import React, { useRef, useState } from 'react';
import { Body, Header, QuickView, Input, Button, Picker, DateTimePicker, ErrorText, EditableImage, Text, Image, Form } from '@components';
import RNImagePicker from 'react-native-image-crop-picker';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import _ from 'lodash';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@components/Common/Form';
import Api from '@utils/api';
import AppHelper, { TError } from '@utils/appHelper';

export default function FormExample() {
  const data: FormInput[] = [
    {
      name: 'title',
      type: 'text',
      tField: 'field:title',
      tPlaceholder: 'placeholder:title'
    },
    {
      name: 'birthday',
      type: 'dateTimePicker',
      tField: 'field:birthday',
      tPlaceholder: 'placeholder:title'
    },
    {
      name: 'email',
      type: 'email',
      tField: 'field:email',
      tPlaceholder: 'placeholder:email'
    },
    {
      name: 'language',
      type: 'picker',
      labels: ['Java', 'Javascript'],
      values: ['java', 'js'],
      tField: 'field:programming_language',
      tPlaceholder: 'placeholder:programming_language'
    },
    {
      name: 'post',
      type: 'textarea',
      tField: 'field:post',
      tPlaceholder: 'placeholder:post'
    },
    {
      name: 'username',
      type: 'text',
      tField: 'field:username',
      tPlaceholder: 'placeholder:username'
    },
    {
      name: 'password',
      type: 'password',
      tField: 'field:password',
      tPlaceholder: 'placeholder:password'
    },
    {
      name: 'confirmPassword',
      type: 'confirmPassword',
      tField: 'field:confirm_password',
      tPlaceholder: 'placeholder:confirm_password'
    },
    {
      name: 'coverImage',
      type: 'image',
      tField: 'field:cover_image',
      tPlaceholder: 'placeholder:cover_image'
    },
  ];

  return (
    <>
      <Header customType="example" title="Form" />
      <Body scrollable keyboardAwareScrollView>
        <QuickView marginVertical={10}>
          <Form data={data} url="/users" />
        </QuickView>
      </Body>
    </>
  );
}

export function PureForm() {
  const { t, i18n } = useTranslation();

  const formValidationSchema = Yup.object().shape({
    title: Yup.string()
      .required(t('validator:required', { field: t('field:title') })),
    birthday: Yup.date()
      .required(t('validator:required', { field: t('field:birthday') })),
    email: Yup.string()
      .required(t('validator:required', { field: t('field:email') }))
      .email(t('validator:invalid_email')),
    language: Yup.string()
      .required(t('validator:required', { field: t('field:programming_language') })),
    post: Yup.string()
      .required(t('validator:required', { field: t('field:post') }))
      .min(20, ({ min, value }) => t('validator:min', { remain: min - value.length })),
    username: Yup.string()
      .required(t('validator:required', { field: t('field:username') }))
      .min(5, ({ min, value }) => t('validator:min', { remain: min - value.length })),
    password: Yup.string()
      .required(t('validator:required', { field: t('field:password') }))
      .min(6, t('validator:too_short')),
    confirmPassword: Yup.string()
      .required(t('validator:required', { field: t('field:confirm_password') }))
      .oneOf([Yup.ref('password')], t('validator:not_match')),
    coverImage: Yup.object()
      .required(t('validator:required', { field: t('field:cover_image') })),

    // confirmPassword: Yup.string()
    //   .required('Required')
    //   .test(
    //     'confirm-password-test',
    //     'Password and confirm password should match',
    //     function compare(value) {
    //       return value === this.parent.password;
    //     },
    //   ),
  });

  const titleInput = useRef<any>(null);
  const dateTimeInput = useRef<any>(null);
  const emailInput = useRef<any>(null);
  const pickerInput = useRef<any>(null);
  const textAreaInput = useRef<any>(null);
  const usernameInput = useRef<any>(null);
  const passwordInput = useRef<any>(null);
  const confirmPasswordInput = useRef<any>(null);
  const chooseImageInput = useRef<any>(null);

  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<TError>();

  const onSubmit = async (values: {
    title: string;
    post: string;
    language: string;
    birthday: string;
    coverImage: undefined;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    // eslint-disable-next-line no-console
    console.log('Values: ', values);
    try {
      await Api.post('/users', values);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(AppHelper.handleException(error));
    }
  };

  const renderError = (error?: string) => {
    if (error) return <ErrorText error={error} center={false} fontSize={12} marginTop={-10} />;
    return null;
  };

  return (
    <>
      <Header customType="example" title="Form" />
      <Body scrollable keyboardAwareScrollView>
        <QuickView marginVertical={15}>
          {success ? <Text success center h3 tText="submit_success" marginVertical={10} /> : null}
          <ErrorText error={error} />
          <Formik
            key={i18n.language}
            validationSchema={formValidationSchema}
            initialValues={{
              title: '',
              birthday: '',
              email: '',
              language: '',
              post: '',
              username: '',
              password: '',
              confirmPassword: '',
              coverImage: undefined
            }}
            onSubmit={onSubmit}
          >
            {(formikProps) => (
              <>

                <Field
                  innerRef={titleInput}
                  component={Input}
                  name="title"
                  tPlaceholder="placeholder:title"
                  nextFieldRef={dateTimeInput}
                />

                <DateTimePicker
                  ref={dateTimeInput}
                  mode="datetime"
                  display="spinner"
                  customType="input"
                  onSubmit={(date: Date) => {
                    formikProps.setFieldTouched('birthday', true);
                    formikProps.setFieldValue('birthday', date);
                  }}
                  onClose={() => { formikProps.setFieldTouched('birthday', true); }}
                />
                {formikProps.touched.birthday && renderError(formikProps.errors.birthday)}

                <Field
                  innerRef={emailInput}
                  component={Input}
                  name="email"
                  tPlaceholder="placeholder:email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  nextFieldRef={pickerInput}
                />

                <Picker
                  ref={pickerInput}
                  labels={['Java', 'Javascript']}
                  values={['java', 'js']}
                  tPlaceholder="placeholder:programming_language"
                  customType="input"
                  onClose={() => { formikProps.setFieldTouched('language', true); }}
                  onValueChange={(value) => {
                    formikProps.setFieldTouched('language', true);
                    formikProps.setFieldValue('language', value);
                    textAreaInput.current.focus();
                  }}
                />
                {formikProps.touched.language && renderError(formikProps.errors.language)}

                <Field
                  innerRef={textAreaInput}
                  component={Input}
                  name="post"
                  tPlaceholder="placeholder:post"
                  multiline
                  numberOfLines={3}
                  nextFieldRef={usernameInput}
                />

                <Field
                  innerRef={usernameInput}
                  component={Input}
                  name="username"
                  tPlaceholder="placeholder:username"
                  textContentType="username"
                  nextFieldRef={passwordInput}
                />

                <Field
                  innerRef={passwordInput}
                  component={Input}
                  name="password"
                  tPlaceholder="placeholder:password"
                  secureTextEntry
                  textContentType="password"
                  nextFieldRef={confirmPasswordInput}
                />

                <Field
                  innerRef={confirmPasswordInput}
                  component={Input}
                  name="confirmPassword"
                  tPlaceholder="placeholder:confirm_password"
                  secureTextEntry
                  nextFieldRef={chooseImageInput}
                />

                {!showImage && (
                <EditableImage
                  ref={chooseImageInput}
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
                  onClose={() => { formikProps.setFieldTouched('coverImage', true); }}
                  pickSuccess={(value) => {
                    formikProps.setFieldTouched('coverImage', true);
                    if (_.isArray(value)) {
                      formikProps.setFieldValue('coverImage', value[0]);
                    }
                    setShowImage(true);
                  }}
                />
                )}
                {formikProps.touched.coverImage && renderError(formikProps.errors.coverImage)}

                {formikProps.values.coverImage && showImage && (
                  <Image
                    // @ts-ignore
                    source={{ uri: formikProps.values.coverImage?.path }}
                    marginVertical={5}
                    viewEnable
                    onClose={() => {
                      formikProps.setFieldValue('coverImage', undefined);
                      setShowImage(false);
                      RNImagePicker.clean();
                    }}
                  />
                )}

                <Button
                  onPress={formikProps.handleSubmit}
                  tTitle="submit"
                  disabled={!formikProps.isValid || formikProps.values.title === ''}
                  loading={loading}
                />
              </>
            )}
          </Formik>
        </QuickView>
      </Body>
    </>
  );
}
