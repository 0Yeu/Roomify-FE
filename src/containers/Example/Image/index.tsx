/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import {
  QuickView, Header, Body, Image, Text, Icon, Button, Loading, EditableImage,
} from '@components';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { IBase, IImage } from '@utils/appHelper';
import ImageSource from '@images';
import AppView from '@utils/appView';
import Section from '../Section';

interface Props extends IBase {}

const uriSample = [
  'https://picsum.photos/500/500',
  'https://picsum.photos/1000/1000',
  'https://source.unsplash.com/x58soEovG_M/1024x1024',
  'https://sample-videos.com/img/Sample-png-image-200kb.png',
  'https://sample-videos.com/img/Sample-jpg-image-1mb.jpg'
];

const ImageExample: React.FC<Props> = (props) => {
  const [loadingMultiple, setLoadingMultiple] = useState<any>(false);
  const multiplePickerRef = useRef<any>(null);
  const uploadCallback = (data: IImage[]) => {
    console.log('UploadCallBack: ', data);
    setLoadingMultiple(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pickSuccess = (media: ImageOrVideo[]) => {
    setLoadingMultiple(true);
  };

  return (
    <>
      <Header customType="example" title="ImageExample" />
      <Body scrollable fullView>
        <Section title="Default Image">
          <Image
            source={{
              uri: 'https://picsum.photos/2000/2300',
              cache: 'web',
            }}
            width={200}
            height={200}
            center
            viewEnable
          />
        </Section>
        <Section title="Image with Custom Loading">
          <QuickView row>
            <Image
              source={{
                uri: uriSample[3],
                cache: 'web',
              }}
              width={AppView.bodyWidth / 2 - 10}
              height={AppView.bodyWidth / 2 - 10}
              center
              loadingColor="orange"
              disablePlaceholder
              loadingSize={100}
              viewEnable
            />
            <QuickView width={20} />
            <Image
              source={{
                uri: uriSample[3],
                cache: 'web',
              }}
              width={AppView.bodyWidth / 2 - 10}
              height={AppView.bodyWidth / 2 - 10}
              center
              customType="barLoading"
              viewEnable
            />
          </QuickView>
          <QuickView row justifyContent="space-between" marginTop={20}>
            <Image
              source={{
                uri: uriSample[3],
                cache: 'web',
              }}
              width={AppView.bodyWidth / 2 - 10}
              height={AppView.bodyWidth / 2 - 10}
              center
              customType="pieLoading"
              viewEnable
            />
            <QuickView width={20} />
            <Image
              source={{
                uri: uriSample[3],
                cache: 'web',
              }}
              width={AppView.bodyWidth / 2 - 10}
              height={AppView.bodyWidth / 2 - 10}
              center
              customType="circleLoading"
              viewEnable
            />
          </QuickView>
        </Section>
        <Section title="Basic Image">
          <Text h3 center marginVertical={5}>Remote Image (auto width, height)</Text>
          <Image
            source={{
              uri: 'https://picsum.photos/1000/1000',
              cache: 'web',
            }}
            loadingColor="#6435C9"
          />
          <Text h3 center marginBottom={5} marginTop={25}>Remote Image (auto height)</Text>
          <Image
            source={{
              uri: 'https://picsum.photos/1000/1100',
              cache: 'web',
            }}
            width={100}
            center
          />
          <Text h3 center marginBottom={5} marginTop={25}>
            Remote Rounded Image (static width, height)
          </Text>
          <Image
            source={{
              uri: 'https://picsum.photos/1000/1200',
              cache: 'web',
            }}
            width={100}
            height={100}
            rounded
            center
          />
          <Text h3 center marginBottom={5} marginTop={25}>Sharp</Text>
          <Image
            source={{
              uri: 'https://picsum.photos/1000/1200',
              cache: 'web',
            }}
            width={100}
            height={100}
            sharp
            center
          />
          <Text h3 center marginBottom={5} marginTop={25}>Circle</Text>
          <Image
            source={{
              uri: 'https://picsum.photos/1000/1200',
              cache: 'web',
            }}
            width={100}
            circle
            center
          />
          <Text h3 center marginBottom={5} marginTop={25}>Remote Image (viewEnable)</Text>
          <Image
            source={{
              uri: 'https://picsum.photos/2000/2000',
              cache: 'web',
            }}
            width={100}
            height={100}
            center
            viewEnable
          />
          <Text h3 center marginBottom={5} marginTop={25}>Touchable Image without Source</Text>
          <Image
            width={100}
            height={100}
            center
              // eslint-disable-next-line no-console
            onPress={() => console.log('Touchable Image without source')}
          />
          <Text h3 center marginBottom={5} marginTop={25}>Error Image</Text>
          <Image
            source={{
              uri: 'https://picsum.photoss/2000/2100',
              cache: 'web',
            }}
            width={100}
            height={100}
            center
            viewEnable
          />
          <Text h3 center marginBottom={5} marginTop={25}>Local Image</Text>
          <Image
            source={ImageSource.loginBackground}
            width={200}
            center
            viewEnable
          />
        </Section>
        <Section title="Image with Multiple Resources">
          <Image
            source={{
              uri: uriSample[2],
              cache: 'web',
            }}
            multipleSources={[{ uri: 'https://picsum.photos/500/1000' }, { uri: uriSample[2] }, { uri: 'https://picsum.photos/400/400' }, { uri: 'https://picsum.photos/500/500' }]}
            width={200}
            height={200}
            center
            loadingColor="#51d96c"
            loadingSize={60}
            viewEnable
          />
        </Section>
        <Section title="Gif Image">
          <Image
            source={{
              uri: 'https://i.chzbgr.com/full/8370322944/hADACEF88/im-gonna-kiss-you-then-bite-you',
            }}
            width={300}
            height={300}
            center
            loadingColor="#51d96c"
            loadingSize={60}
            viewEnable
          />
        </Section>
        <Section title="Editable Image">
          <EditableImage
            folderPrefix="avatar"
            source={{
              uri: 'https://picsum.photos/600/600',
            }}
            uploadCallback={uploadCallback}
            imagePickerButtonProps={{
              cropType: 'circular',
              imageWidth: 100,
              imageHeight: 100,
            }}
            width={100}
            height={100}
            circle
            center
            loadingSize={60}
          />
          <Text h3 center marginVertical={5}>Custom Editable Image (Single)</Text>
          <EditableImage
            buttonChildren={<Icon name="image" size={30} />}
            folderPrefix="images"
            uploadCallback={uploadCallback}
            pickSuccess={pickSuccess}
            imagePickerButtonProps={{
              imageWidth: 100,
              imageHeight: 100,
            }}
            width={100}
            height={100}
          />
          <Text h3 center marginVertical={5}>Editable Image (Multiple)</Text>
          {loadingMultiple ? <Loading marginBottom={10} /> : null}
          <EditableImage
            ref={multiplePickerRef}
            buttonChildren={loadingMultiple ? <QuickView /> : <Icon name="folder-multiple-image" size={30} type="material-community" />}
            folderPrefix="images"
            pickSuccess={pickSuccess}
            uploadCallback={uploadCallback}
            multiple
            width={200}
            height={200}
            center
            loadingSize={60}
          />
          <Text h3 center marginVertical={5}>{'Editable Image\n(Multiple with custom resizer => 1 size)'}</Text>
          {loadingMultiple ? <Loading marginBottom={10} /> : null}
          <EditableImage
            ref={multiplePickerRef}
            buttonChildren={loadingMultiple ? <QuickView /> : <Icon name="folder-multiple-image" size={30} type="material-community" />}
            folderPrefix="images"
            pickSuccess={pickSuccess}
            uploadCallback={uploadCallback}
            multiple
            resizedImageWidth={500}
            width={200}
            height={200}
            center
            loadingSize={60}
          />
          <Text h3 center marginVertical={5}>{'Editable Image\n(Multiple with custom resizer => 3 sizes)'}</Text>
          {loadingMultiple ? <Loading marginBottom={10} /> : null}
          <EditableImage
            ref={multiplePickerRef}
            buttonChildren={loadingMultiple ? <QuickView /> : <Icon name="folder-multiple-image" size={30} type="material-community" />}
            folderPrefix="images"
            pickSuccess={pickSuccess}
            uploadCallback={uploadCallback}
            multiple
            resizedImageWidth={{
              origin: 800,
              medium: 400,
              thumbnail: 200,
            }}
            width={200}
            height={200}
            center
            loadingSize={60}
          />
          <Button marginVertical={10} title="Get Current Image Urls" onPress={() => { console.log(multiplePickerRef.current?.getData()); }} />
        </Section>
      </Body>

    </>
  );
};

export default ImageExample;
