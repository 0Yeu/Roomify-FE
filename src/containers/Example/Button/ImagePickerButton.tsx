/* eslint-disable no-console */
import React from 'react';
import { Header, Body, ImagePickerButton, Text } from '@components';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { Alert } from 'react-native';
import Section from '../Section';

export default function ImagePickerButtonExample() {
  const pickSuccess = (media: ImageOrVideo[]) => {
    console.log('------------------------------------------------------');
    media.forEach((item: ImageOrVideo) => {
      console.log('item', item);
    });
  };

  const pickSuccessAlert = (media: ImageOrVideo[]) => {
    console.log('------------------------------------------------------');
    media.forEach((item: ImageOrVideo) => {
      console.log('item', item);
      Alert.alert('Picture: ', JSON.stringify(item));
    });
  };

  const handleException = (e: any) => {
    // eslint-disable-next-line no-console
    console.log('Error: ', e);
  };

  return (
    <>
      <Header customType="example" title="ImagePicker Button" />
      <Body scrollable fullView>
        <Section title="With Camera">
          <ImagePickerButton title="Select Single Image" pickSuccess={pickSuccessAlert} />
          <ImagePickerButton title="Select Single Image (Base64)" imageOutput="base64" />
          <ImagePickerButton title="Select Single Video" mediaType="video" />
        </Section>
        <Section title="With Camera & Crop">
          <ImagePickerButton title="Select Single Image (Free Style Crop)" cropType="freeStyle" pickSuccess={pickSuccessAlert} />
          <ImagePickerButton title="Select Single Image (500x500 Crop)" cropType="rectangle" imageWidth={500} imageHeight={500} pickSuccess={pickSuccessAlert} />
          <ImagePickerButton title="Select Single Image (Circular Crop)" cropType="circular" pickSuccess={pickSuccessAlert} />
        </Section>
        <Section title="With Gallery">
          <ImagePickerButton
            title="Select Single Image (Log)"
            dataSource="gallery"
            pickSuccess={pickSuccess}
            handleException={handleException}
          />
          <ImagePickerButton
            title="Select Single Video (Log)"
            dataSource="gallery"
            mediaType="video"
            pickSuccess={pickSuccess}
            handleException={handleException}
          />
          <ImagePickerButton
            title="Select Multiple Media (Log)"
            dataSource="gallery"
            multiple
            pickSuccess={pickSuccess}
            handleException={handleException}
          />
        </Section>
        <Section title="With Gallery & Crop">
          <ImagePickerButton title="Select Single Image (Free Style Crop)" dataSource="gallery" cropType="freeStyle" pickSuccess={pickSuccessAlert} />
          <ImagePickerButton title="Select Single Image (500x500 Crop)" dataSource="gallery" cropType="rectangle" imageWidth={500} imageHeight={500} pickSuccess={pickSuccessAlert} />
          <ImagePickerButton title="Select Single Image (Circular Crop)" dataSource="gallery" cropType="circular" pickSuccess={pickSuccessAlert} />
        </Section>
        <Section title="Invisible Select Single Image">
          <ImagePickerButton
            invisible
            dataSource="gallery"
            buttonChildren={<Text center success h2>Invisible Select Single Image</Text>}
          />
        </Section>
      </Body>
    </>
  );
}
