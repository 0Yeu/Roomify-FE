/* eslint-disable max-len */
import React, { useState } from 'react';
import { Header, Body, Loading, Button } from '@components';
import AppView from '@utils/appView';
import Section from '../Section';

export default function LoadingExample() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Header customType="example" title="Loading" />
      <Body scrollable fullView>
        <Section title="Default Loading">
          <Loading marginVertical={5} />
        </Section>
        <Section title="Loading with parent state">
          <Button title="Trigger Loading" onPress={() => setLoading(!loading)} />
          <Loading visible={loading} color="orange" marginVertical={5} />
          <Loading visible={loading} color="orange" marginVertical={5} size="large" />
        </Section>
        <Section title={"Loading with timeout\n(Listen to current State instead of parent's State)"}>
          <Loading visible={loading} color="red" marginVertical={5} timeout={4000} />
          {/* <Loading visible={loading} color="red" marginVertical={5} timeout={1000} overlay animatedLottieLoading="loader" /> */}
          <Loading visible={loading} color="red" marginVertical={5} timeout={2000} overlay />
        </Section>
        <Section title="Custom Loading with animation">
          <Loading animatedLottieLoading="loader" style={{ width: 50 }} />
          <Loading animatedLottieLoading="listLoader" style={{ width: AppView.screenWidth }} />
        </Section>
      </Body>
    </>
  );
}
