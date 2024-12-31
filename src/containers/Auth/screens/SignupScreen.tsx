import React, { useState } from 'react';
import {
  QuickView, Text, Header, Body, Input, Button, Loading,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import { Field, Formik } from 'formik';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@utils/redux';
import Toast from 'react-native-toast-message';
import { signup } from '../components/Login/redux/slice';

interface Props extends IBase {}

const SignupScreen: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const leftComponent = {
    icon: 'arrowleft',
    type: 'antdesign',
    size: 25,
    color: colors.white,
    onPress: () => (
      NavigationService.goBack()
    ),
    style: {
      width: 25,
      height: 25,
    },
    containerStyle: {
      padding: 8,
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
  };

  const formValidationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(t('validator:required', { field: t('placeholder:full_name') })),
    username: Yup.string()
      .required(t('validator:required', { field: t('field:username') })),
    phone: Yup.string()
      .nullable(true)
      .required(t('validator:required', { field: t('placeholder:phone') }))
      .matches(
        /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
        t('validator:invalid_phone')
      ),
    password: Yup.string()
      .required(t('validator:required', { field: t('field:password') }))
      .min(6, t('validator:too_short')),
    confirmPassword: Yup.string()
      .required(t('validator:required', { field: t('field:confirm_password') }))
      .oneOf([Yup.ref('password')], t('validator:not_match')),
  });

  const handleOnSignUp = (values: any) => {
    setLoading(true);
    Keyboard.dismiss();
    // console.log('values :>> ', values);
    const { confirmPassword, ...body } = values;
    dispatch(signup(body))
      .then((res) => {
        // console.log('res :>> ', res);
        if (!res?.payload?.error) { NavigationService.goBack(); } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: res.payload.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
            onPress: () => {},
            props: {} // any custom props passed to the Toast component
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('error :>> ', err);
        setLoading(false);
      });
  };

  return (
    <>
      <Header leftComponent={leftComponent} backgroundColor={colors.white} />
      <Body dismissKeyboard backgroundColor={colors.white}>
        <QuickView>
          <Text center bold fontSize={36} color={colors.primary} tText="auth:signup" />
        </QuickView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={50}
          style={{ flex: 1 }}
        >
          <Formik
        // key={i18n.language}
            validationSchema={formValidationSchema}
            initialValues={{
              fullName: '',
              username: '',
              phone: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={handleOnSignUp}
          >
            {(formikProps) => (
              <>
                <QuickView verticalCenter flex={1.5}>
                  <Field
                    component={Input}
                    name="fullName"
                    errorStyle={{ marginTop: 10 }}
                    inputContainerStyle={{
                      backgroundColor: colors.white,
                      shadowColor: 'rgba(78, 79, 114, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 10,
                    }}
                    tPlaceholder="placeholder:full_name"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <Field
                    component={Input}
                    name="username"
                    errorStyle={{ marginTop: 10 }}
                    inputContainerStyle={{
                      backgroundColor: colors.white,
                      shadowColor: 'rgba(78, 79, 114, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 10,
                    }}
                    tPlaceholder="placeholder:username"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <Field
                    component={Input}
                    name="phone"
                    errorStyle={{ marginTop: 10 }}
                    inputContainerStyle={{
                      backgroundColor: colors.white,
                      shadowColor: 'rgba(78, 79, 114, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 10,
                    }}
                    tPlaceholder="placeholder:phone"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <Field
                    component={Input}
                    name="password"
                    errorStyle={{ marginTop: 10 }}
                    inputContainerStyle={{
                      backgroundColor: colors.white,
                      shadowColor: 'rgba(78, 79, 114, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 10,
                    }}
                    secureTextEntry
                    tPlaceholder="placeholder:password"
                    // keyboardType="email-address"
                    textContentType="password"
                  />
                  <Field
                    errorStyle={{ marginTop: 10 }}
                  // innerRef={passwordInput}
                    component={Input}
                    inputContainerStyle={{
                      backgroundColor: colors.white,
                      shadowColor: 'rgba(78, 79, 114, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,

                      elevation: 10,
                    }}
                    name="confirmPassword"
                    tPlaceholder="placeholder:confirm_password"
                    secureTextEntry
                  // defaultValue="123456"
                  // leftIcon={{ type: 'antdesign', name: 'lock' }}
                    textContentType="password"
                  />
                </QuickView>
                <QuickView flex={0.5}>
                  <Button
                    tTitle="auth:signup"
                    onPress={formikProps.handleSubmit}
                    marginTop={10}
                    borderRadius={24}
                    height={60}
                    bold
                    icon={{ name: 'arrowright', size: 18, type: 'antdesign' }}
                    iconRight
                    style={{ borderRadius: 50 }}
                  />
                  {/* <Button title="Register" onPress={() => {}} outline /> */}
                </QuickView>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Body>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default SignupScreen;
