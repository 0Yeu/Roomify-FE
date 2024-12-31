/* eslint-disable no-console */
import React, { useRef } from 'react';
import {
  Header, Body, Picker, Button, Image
} from '@components';
import Helper from '@utils/helper';
import AppView from '@utils/appView';
import dataCity from './dataCity';
import Section from '../Section';

export default function PickerExample() {
  const pickerRef = useRef<any>(null);
  const pickerMultipleRef = useRef<any>(null);
  const pickerModalRef = useRef<any>(null);
  const customPickerModalRef = useRef<any>(null);
  const pickerServerDefaultRef = useRef<any>(null);
  const pickerServerModalRef = useRef<any>(null);
  const pickerServerFullScreenRef = useRef<any>(null);

  return (
    <>
      <Header customType="example" title="Picker" />
      <Body scrollable fullView>
        <Section title="Default Picker">
          <Picker
            labels={['Java', 'Javascript']}
            values={['java', 'js']}
            tPlaceholder="component:picker:choose_language"
            customType="input"
            width="100%"
            // selectedIndex={1}
            // selectedValue="js"
            ref={pickerRef}
            onValueChange={(value) => {
              console.log('onValueChange: ', value);
            }}
          />
          <Picker
            labels={['Java', 'Javascript']}
            values={['java', 'js']}
            width={200}
            height={60}
            shadow
            tPlaceholder="component:picker:choose_language"
            // selectedIndex={1}
            // selectedValue="js"
            ref={pickerRef}
            onValueChange={(value) => {
              console.log('onValueChange: ', value);
            }}
          />
          <Button
            title="Log Value"
            width={150}
            marginTop={20}
            onPress={() => {
            // console.log('pickerRef: ', pickerRef);
              console.log('SelectedIndex: ', pickerRef.current?.getIndex());
              console.log('SelectedValue: ', pickerRef.current?.getValue());
              console.log('getText: ', pickerRef.current?.getText());
            }}
          />
          <Button
            title="Clear Value"
            width={150}
            onPress={() => pickerRef.current?.clear()}
          />
        </Section>
        <Section title="Multiple Picker">
          <Picker
            labels={Helper.selectFields(dataCity, 'name')}
            values={Helper.selectFields(dataCity, 'id')}
            multiple
            // selectedIndexes={[0, 1]}
            shadow
            width={300}
            tPlaceholder="component:picker:choose_province"
            ref={pickerMultipleRef}
            onValuesChange={(values, indexes) => {
              console.log('onValueChange Values:', values, '| Indexes:', indexes);
            }}
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndexes: ', pickerMultipleRef.current?.getIndexes());
              console.log('SelectedValues: ', pickerMultipleRef.current?.getValues());
              console.log('getText: ', pickerMultipleRef.current?.getText());
            }}
          />
          <Button
            title="Clear Value"
            width={150}
            onPress={() => pickerMultipleRef.current?.clear()}
          />
        </Section>
        <Section title="Modal Picker">
          <Picker
            labels={Helper.selectFields(dataCity, 'name')}
            values={Helper.selectFields(dataCity, 'id')}
            // selectedValue={0}
            width={200}
            height={40}
            shadow
            pickerType="modal"
            tPlaceholder="component:picker:choose_province"
            ref={pickerModalRef}
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndex: ', pickerModalRef.current?.getIndex());
              console.log('SelectedValue: ', pickerModalRef.current?.getValue());
              console.log('getText: ', pickerModalRef.current?.getText());
            }}
          />
          <Button
            title="Clear Value"
            width={150}
            onPress={() => pickerModalRef.current?.clear()}
          />
        </Section>
        <Section title="Modal Picker (Custom RenderItem)">
          <Picker
            labels={Helper.selectFields(dataCity, 'name')}
            values={Helper.selectFields(dataCity, 'id')}
            // selectedValue={0}
            width={200}
            height={40}
            shadow
            pickerType="modal"
            tPlaceholder="component:picker:choose_province"
            ref={customPickerModalRef}
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
            flatListProps={{
              renderItem: ({ item, index }: any, renderItemProps: any) => (
                <Button
                  marginHorizontal={AppView.bodyPaddingHorizontal}
                  title={item.toString()}
                  titleStyle={{ textAlign: 'left' }}
                  bold={false}
                  titlePosition="left"
                  onPress={() => renderItemProps.onPressItem(index)}
                  clear={renderItemProps.selectedIndex === index}
                />
              )
            }}
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndex: ', customPickerModalRef.current?.current?.getIndex());
              console.log('SelectedValue: ', customPickerModalRef.current?.current?.getValue());
              console.log('getText: ', customPickerModalRef.current?.current?.getText());
            }}
          />
        </Section>
        <Section title="Server Picker (Default)">
          <Picker
            width={200}
            height={40}
            shadow
            tPlaceholder="component:picker:choose_title"
            ref={pickerServerDefaultRef}
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
            server={{
              url: 'https://vlnestbase.herokuapp.com/v1/posts',
              valueField: 'id',
              labelField: 'enTitle',
            }}
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndex: ', pickerServerDefaultRef.current?.getIndex());
              console.log('SelectedValue: ', pickerServerDefaultRef.current?.getValue());
              console.log('getText: ', pickerServerDefaultRef.current?.getText());
            }}
          />
        </Section>
        <Section title="Server Picker (Modal)">
          <Picker
            width={200}
            height={40}
            shadow
            tPlaceholder="component:picker:choose_title"
            ref={pickerServerModalRef}
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
            server={{
              url: 'https://vlnestbase.herokuapp.com/v1/posts',
              valueField: 'id',
              labelField: 'enTitle',
              loadMore: true // If loadMore is true, pickerType is modal
            }}
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndex: ', pickerServerModalRef.current?.getIndex());
              console.log('SelectedValue: ', pickerServerModalRef.current?.getValue());
              console.log('getText: ', pickerServerModalRef.current?.getText());
            }}
          />
        </Section>
        <Section title={'Server Picker with Search\n(pickerType = "fullscreen")'}>
          <Picker
            width={200}
            height={40}
            shadow
            tPlaceholder="component:picker:choose_title"
            ref={pickerServerFullScreenRef}
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
            server={{
              url: 'https://vlnestbase.herokuapp.com/v1/posts',
              valueField: 'id',
              labelField: 'enTitle',
              loadMore: true // If loadMore is true, pickerType is modal
            }}
            pickerType="fullscreen"
          />
          <Button
            title="Log Value"
            width={150}
            onPress={() => {
              console.log('SelectedIndex: ', pickerServerFullScreenRef.current?.getIndex());
              console.log('SelectedValue: ', pickerServerFullScreenRef.current?.getValue());
              console.log('getText: ', pickerServerFullScreenRef.current?.getText());
            }}
          />
        </Section>
        <Section title="Invisible Modal Picker">
          <Picker
            labels={Helper.selectFields(dataCity, 'name')}
            values={Helper.selectFields(dataCity, 'id')}
            width={200}
            height={40}
            shadow
            pickerType="modal"
            invisible
            buttonChildren={(
              <Image
                source={{
                  uri: 'https://picsum.photos/1000/1000',
                  cache: 'web',
                }}
                containerStyle={{ marginVertical: 15 }}
              />
            )}
            tPlaceholder="component:picker:choose_province"
            onValueChange={(value, index) => {
              console.log('onValueChange Value:', value, '| Index:', index);
            }}
          />
        </Section>
      </Body>
    </>
  );
}
