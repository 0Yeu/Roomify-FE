import React, {useEffect, useState} from 'react';
import {QuickView, Text, Header, Body, Input, Button, Loading} from '@components';
import {Global, IBase} from '@utils/appHelper';
import {useTheme} from 'react-native-elements';
import colors from '@themes/Color/colors';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {NavigationService} from '@utils/navigation';
import IconSource from '@icons';
import {DeviceEventEmitter, Keyboard, KeyboardAvoidingView, Platform, View} from 'react-native';
import Routes from '@containers/routes';
import Api from '@utils/api';
import Toast from 'react-native-toast-message';
import {useAppDispatch, useAppSelector} from '@utils/redux';
import {fetchCities, setSelectedCity} from '@containers/Main/redux/slice';
import {EVENT_APP_EMIT} from '@utils/constant';
import {login} from '../components/Login/redux/slice';

interface Props extends IBase {}

const LoginScreen: React.FC<Props> = (props: Props) => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {t, i18n} = useTranslation();
  const leftComponent = {
    icon: 'arrowleft',
    type: 'antdesign',
    size: 25,
    color: colors.white,
    onPress: () => NavigationService.goBack(),
    style: {
      width: 25,
      height: 25,
    },
    containerStyle: {
      padding: 8,
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  };
  const formValidationSchema = Yup.object().shape({
    username: Yup.string().required(t('validator:required', {field: t('field:username')})),
    password: Yup.string()
      .required(t('validator:required', {field: t('field:password')}))
      .min(6, t('validator:too_short')),
  });

  const handleOnLogin = async (values: any) => {
    setLoading(true);
    Keyboard.dismiss();
    dispatch(login({...values, registrationToken: Global.fcmToken}))
      .then((res: any) => {
        dispatch(fetchCities()).then(res1 => {
          DeviceEventEmitter.emit(EVENT_APP_EMIT.RELOAD_SAVED);
          if ((res1?.payload?.result || [])?.length > 0) {
            dispatch(setSelectedCity(res1?.payload?.result[0]));
          }
        });
        // return;
        // Global.token = res?.token;
        if (!res?.payload?.error) {
          const isPermitted = res?.payload?.data?.role?.map((d: any) => d?.name);
          if ((isPermitted || [])?.includes('USER') || (isPermitted || [])?.includes('OWNER')) {
            NavigationService.goBack();
          } else {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Lỗi',
              text2: 'Bạn ko có quyền truy cập ứng dụng!',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 40,
              bottomOffset: 40,
              onShow: () => {},
              onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
              onPress: () => {},
              props: {}, // any custom props passed to the Toast component
            });
          }
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Lỗi',
            text2: res.payload.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
            onPress: () => {},
            props: {}, // any custom props passed to the Toast component
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('handleOnLogin Error :>> ', err);
        setLoading(false);
      });
  };
  return (
    <>
      <Header leftComponent={leftComponent} backgroundColor={colors.white} />
      <Body dismissKeyboard backgroundColor={colors.white}>
        <QuickView flex={1}>
          <Text center bold fontSize={36} color={colors.primary} tText="auth:login" />
          <QuickView marginBottom={50} center>
            <IconSource.AppTempIcon />
          </QuickView>
        </QuickView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={200}
          style={{flex: 1}}>
          <Formik
            // key={i18n.language}
            validationSchema={formValidationSchema}
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={handleOnLogin}>
            {formikProps => (
              <>
                <QuickView verticalCenter flex={1.5}>
                  <Field
                    component={Input}
                    name="username"
                    errorStyle={{marginTop: 10}}
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
                    // keyboardType="email-address"
                    textContentType="username"
                  />
                  <Field
                    errorStyle={{marginTop: 10}}
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
                    name="password"
                    tPlaceholder="placeholder:password"
                    secureTextEntry
                    // defaultValue="123456"
                    // leftIcon={{ type: 'antdesign', name: 'lock' }}
                    textContentType="password"
                  />
                </QuickView>
                <QuickView flex={0.5}>
                  <Button
                    title="Đăng nhập"
                    onPress={formikProps.handleSubmit}
                    marginTop={10}
                    borderRadius={24}
                    height={60}
                    bold
                    icon={{name: 'arrowright', size: 18, type: 'antdesign'}}
                    iconRight
                    style={{borderRadius: 50}}
                  />
                  {/* <Button title="Register" onPress={() => {}} outline /> */}
                </QuickView>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
        <QuickView center flex={1}>
          <QuickView onPress={() => NavigationService.navigate(Routes.SIGNUP_SCREEN)} center>
            <Text tText="auth:have_account" />
            <Text color={colors.primary} tText="auth:signup" />
          </QuickView>
        </QuickView>
      </Body>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default LoginScreen;
