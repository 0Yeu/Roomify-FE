import React from 'react';
import { Header, Body, QuickView, Text } from '@components';

export default function TextExample() {
  return (
    <>
      <Header customType="example" title="Text" />
      <Body scrollable>
        <QuickView style={{ marginBottom: 15, marginTop: 10 }}>
          <Text tText="auth:login" />
          <Text margin={10}>Text Component with margin=10</Text>
        </QuickView>
        <QuickView style={{ marginBottom: 15 }}>
          <Text success>Success Text</Text>
          <Text warning>Warning Text</Text>
          <Text error>Error Text</Text>
          <Text color="blue">Text with custom color</Text>
        </QuickView>
        <QuickView style={{ marginBottom: 15 }}>
          <Text thin>Thin Text</Text>
          <Text thin italic>Thin Italic Text</Text>
          <Text>Normal Text</Text>
          <Text italic>Italic Text</Text>
          <Text bold>Bold Text</Text>
          <Text bold italic>Bold Italic Text</Text>
          <Text underline>Underline Text</Text>
          <Text fontSize={25}>Text with custom fontSize</Text>
          <Text fontFamily="GoogleSans-Regular">Text with custom fontFamily</Text>
        </QuickView>
        <QuickView style={{ marginBottom: 15 }}>
          <Text h1>H1</Text>
          <Text h2>H2</Text>
          <Text h3>H3</Text>
          <Text>Normal</Text>
          <Text subtitle>Subtitle</Text>
        </QuickView>
        <QuickView style={{ marginBottom: 15 }}>
          <Text icon={{ name: 'account', size: 18 }}>Text with Icon</Text>
          <Text icon={{ name: 'account', size: 18 }} iconRight>Text with Icon on the right side</Text>
          <Text icon={{ name: 'account', color: 'orange', size: 18 }}>Text with Custom Icon</Text>
        </QuickView>
      </Body>
    </>
  );
}
