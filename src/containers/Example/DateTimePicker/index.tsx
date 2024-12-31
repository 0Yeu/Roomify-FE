/* eslint-disable no-console */
import React, { useRef } from 'react';
import { Header, Body, DateTimePicker, Button } from '@components';
import { Platform } from 'react-native';
import Section from '../Section';

export default function DateTimePickerExample() {
  const dateTimePickerRef = useRef<any>(null);
  return (
    <>
      <Header customType="example" title="DateTimePicker" />
      <Body scrollable fullView>
        <Section title="Basic DateTimePicker (Default)">
          <DateTimePicker
            placeholder="Pick a date"
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker placeholder="Pick a time" mode="time" />
          <DateTimePicker placeholder="Pick a datetime" mode="datetime" />
        </Section>
        <Section title="Basic DateTimePicker (Spinner)">
          <DateTimePicker
            placeholder="Pick a date"
            display="spinner"
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker
            placeholder="Pick a time"
            display="spinner"
            mode="time"
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker
            placeholder="Pick a datetime"
            display="spinner"
            mode="datetime"
            onSubmit={(date: Date) => console.log('Date', date)}
          />
        </Section>
        {Platform.OS === 'ios'
        && (
        <>
          <Section title="Basic DateTimePicker (Compact)">
            <DateTimePicker
              placeholder="Pick a date"
              display="compact"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
            <DateTimePicker
              placeholder="Pick a time"
              display="compact"
              mode="time"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
            <DateTimePicker
              placeholder="Pick a datetime"
              display="compact"
              mode="datetime"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
          </Section>
          <Section title="Basic DateTimePicker (Inline)">
            <DateTimePicker
              placeholder="Pick a date"
              display="inline"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
            <DateTimePicker
              placeholder="Pick a time"
              display="inline"
              mode="time"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
            <DateTimePicker
              placeholder="Pick a datetime"
              display="inline"
              mode="datetime"
              onSubmit={(date: Date) => console.log('Date', date)}
            />
          </Section>
        </>
        )}
        <Section title="Custom DateTimePicker">
          <DateTimePicker
            ref={dateTimePickerRef}
            placeholder="Custom Color"
            placeholderTextColor="#bdc6cf"
            titleColor="black"
            color="darkmagenta"
            width={200}
            shadow
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker
            ref={dateTimePickerRef}
            value={new Date('2019-01-01')}
            // minimumDate={new Date('2020-08-12')}
            maximumDate={new Date('2020-08-20')}
            placeholder="Pick a date"
            width={200}
            shadow
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker
            ref={dateTimePickerRef}
            value={new Date('2019-01-01')}
            minimumDate={new Date('2020-08-12')}
            maximumDate={new Date('2020-08-20')}
            placeholder="Pick a date"
            center
            shadow
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <DateTimePicker mode="time" ref={dateTimePickerRef} />
          <DateTimePicker
            mode="datetime"
            ref={dateTimePickerRef}
            onSubmit={(date: Date) => console.log('Date', date)}
          />
          <Button
            title="Clear value"
            titlePaddingHorizontal={25}
            shadow
            onPress={() => dateTimePickerRef.current?.clear()}
          />
          <Button
            title="Log getText"
            titlePaddingHorizontal={25}
            shadow
            onPress={() => console.log(dateTimePickerRef.current?.getText())}
          />
          <Button
            title="Log getValue"
            titlePaddingHorizontal={25}
            shadow
            onPress={() => console.log(dateTimePickerRef.current?.getValue())}
          />
        </Section>
      </Body>
    </>
  );
}
