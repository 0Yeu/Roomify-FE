import React from 'react';
import { Header, Body, Button } from '@components';
import LinearGradient from 'react-native-linear-gradient';
import Section from '../Section';

export default function ButtonExample() {
  return (
    <>
      <Header customType="example" title="Button" />
      <Body scrollable fullView>
        <Section title="Basic Button" center={false}>
          <Button
            title="Clear Button"
            sharp
            clear
            titlePaddingHorizontal={0}
            titlePaddingVertical={0}
            containerStyle={{ alignSelf: 'flex-start' }}
          />
          <Button tTitle="auth:login" containerStyle={{ alignSelf: 'flex-start' }} />
          <Button width={250} title="Button with width = 250" />
          <Button height={70} title="Button with height = 70" />
          <Button width={250} center title="Button with center = true" />
          <Button marginVertical={10} title="Button with marginVertical = 10" />
          <Button titlePaddingVertical={20} title="Button with titlePaddingVertical = 20" />
        </Section>
        <Section title="Custom Color/Type Button">
          <Button title="Nulled Button" />
          <Button title="Button with custom color" titleColor="yellow" backgroundColor="darkmagenta" />
          <Button color="orange" title="Button with color = 'orange'" />
          <Button title="Shadow Button" shadow />
          <Button success title="Success Button" />
          <Button warning title="Warning Button" />
          <Button error title="Error Button" />

          <Button outline title="Nulled Outline Button" />
          <Button success outline title="Success Outline Button" />
          <Button warning outline title="Warning Outline Button" />
          <Button error outline title="Error Outline Button" />

          <Button clear title="Nulled Clear Button" />
          <Button success clear title="Success Clear Button" />
          <Button warning clear title="Warning Clear Button" />
          <Button error clear title="Error Clear Button" />

          <Button
            title="Linear Button"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 },
              locations: [0, 1, 1],
              colors: ['#63B064', '#3E613E', 'rgba(100, 184, 101, 0)'],
            }}
          />

          <Button title="Button with Bold Title" bold />
          <Button title="Active Button" customType="active" />
        </Section>
        <Section title="Custom Shape Button">
          <Button sharp title="Sharp Button" />
          <Button rounded title="Rounded Button" />
          <Button width={100} circle center title="Ok" />
        </Section>
        <Section title="Icon Button">
          <Button icon={{ name: 'arrow-left', style: { marginTop: 3 } }} center title="Icon button" />
          <Button icon={{ name: 'arrow-right', style: { marginTop: 3 } }} iconRight center title="Button with right Icon" />
          <Button icon={{ name: 'arrow-right', style: { marginTop: 3, marginLeft: -1 } }} center circle />
        </Section>
      </Body>
    </>
  );
}
