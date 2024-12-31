/* eslint-disable no-console */
import React, { useRef } from 'react';
import { AutoCompleteInput, Body, Button, Header, Input, QuickView, SearchInput } from '@components';
import Section from '../Section';

export default function InputExample() {
  const autoCompleteInput = useRef<any>(null);
  const onSearch = async (text: string) => {
    console.log(`"${text}"`, 'Searching...:');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Search successfully');
  };

  return (
    <>
      <Header customType="example" title="Input" />
      <Body scrollable keyboardAwareScrollView fullView>
        <Section title="Search Input">
          <SearchInput platform="default" onSearch={onSearch} />
          <SearchInput platform="android" onSearch={onSearch} />
          <SearchInput platform="ios" onSearch={onSearch} />
        </Section>
        <Section title="AutoComplete Input">
          <QuickView width="100%">
            <AutoCompleteInput
              label="AutoComplete Input"
              ref={autoCompleteInput}
              placeholder="Type here..."
              server={{
                url: '/posts?s={"enTitle":{"$contL":":value"}}',
                field: 'enTitle'
              }}
            />
          </QuickView>
          <Button title="Get AutoComplete Value" titlePaddingHorizontal={20} center onPress={() => { console.log(autoCompleteInput.current?.getValue()); }} />
        </Section>
        <Section title="Basic Input">
          <Input tLabel="field:email" tPlaceholder="field:email" keyboardType="email-address" />
          <Input tLabel="field:password" tPlaceholder="field:password" secureTextEntry />
          <Input placeholder="Center Input" textAlign="center" />
          <Input placeholder="Outline Input" outline />
          <Input placeholder="Clear Input" clear />
          <Input label="Left Icon" placeholder="Left Icon" leftIcon={{ name: 'arrow-left' }} />
          <Input label="Right Icon" placeholder="Right Icon" rightIcon={{ name: 'arrow-right' }} />
          <Input placeholder="Input with Error Message" errorMessage="Invalid field" />
          <Input label="Custom Input" placeholder="Custom Input" backgroundColor="lightblue" placeholderTextColor="plum" color="darkviolet" labelColor="orange" />
          <Input label="Multiline" placeholder="Input your multiline" multiline numberOfLines={3} />
        </Section>
      </Body>
    </>
  );
}
