import React, { useRef } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { Button, ErrorText, Input } from '@components';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Field, Formik } from 'formik';
import { login } from './redux/slice';

export default function LoginForm() {
  const passwordInput = useRef<any>(null);
  const [loading, error] = useAppSelector(
    (state) => [
      state.auth.loginLoading,
      state.auth.loginError,
    ]
  );
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const onLogin = (value: { email: string, password: string }) => dispatch(login(value));

  const formValidationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('validator:required', { field: t('field:email') }))
      .email(t('validator:invalid_email')),
    password: Yup.string()
      .required(t('validator:required', { field: t('field:password') }))
      .min(6, t('validator:too_short')),
  });

  return (
    <View>
      <ErrorText error={error} />
      <Formik
        key={i18n.language}
        validationSchema={formValidationSchema}
        initialValues={{
          email: 'admin@gmail.com',
          password: '123456',
        }}
        onSubmit={onLogin}
      >
        {(formikProps) => (
          <>
            <Field
              component={Input}
              name="email"
              tPlaceholder="placeholder:email"
              keyboardType="email-address"
              textContentType="emailAddress"
              defaultValue="admin@gmail.com"
              leftIcon={{ type: 'antdesign', name: 'mail' }}
              nextFieldRef={passwordInput}
            />
            <Field
              innerRef={passwordInput}
              component={Input}
              name="password"
              tPlaceholder="placeholder:password"
              secureTextEntry
              defaultValue="123456"
              leftIcon={{ type: 'antdesign', name: 'lock' }}
              textContentType="password"
            />
            <Button
              title="Login"
              onPress={formikProps.handleSubmit}
              marginTop={10}
              loading={loading}
            />
            <Button title="Register" onPress={() => {}} outline />
          </>
        )}
      </Formik>
    </View>
  );
}
