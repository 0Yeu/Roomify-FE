import React from 'react';
import { Avatar, Body, QuickView } from '@components';
import ImageSource from '@images';
import LoginForm from './LoginForm';

export default function LoginScreen() {
  return (
    <Body fullHeight backgroundImage={{ source: ImageSource.loginBackground }} dismissKeyboard>
      <QuickView marginBottom={20} marginTop={60} center>
        <Avatar
          size="xlarge"
          rounded
          source={{
            uri:
      'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
          }}
          title="M"
          marginBottom={10}
        />
      </QuickView>
      <QuickView marginTop={20}>
        <LoginForm />
      </QuickView>
    </Body>
  );
}
