import React from 'react';
import { Body, Header, Avatar, EditableImage } from '@components';
import { IImage } from '@utils/appHelper';
import Section from '../Section';

export default function AvatarExample() {
  const uploadCallback = (data: IImage[]) => {
    // eslint-disable-next-line no-console
    console.log('UploadCallBack: ', data);
  };

  return (
    <>
      <Header customType="example" title="Avatar" />
      <Body scrollable fullView>
        <Section title="Basic Avatar">
          <Avatar
            source={{
              uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            }}
            marginBottom={10}
            title="A1"
          />
          <Avatar
            size="small"
            rounded
            source={{
              uri: 'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
            }}
            title="S"
            marginBottom={10}
          />
          <Avatar
            size="medium"
            rounded
            source={{
              uri: 'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
            }}
            title="M"
            marginBottom={10}
          />
          <Avatar
            size="large"
            rounded
            source={{
              uri: 'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
            }}
            title="L"
            marginBottom={10}
          />
          <Avatar
            size="xlarge"
            rounded
            source={{
              uri: 'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
            }}
            title="XL"
            marginBottom={10}
          />
          <Avatar
            rounded
            size="large"
            source={{
              uri: 'https://www.easy-profile.com/support.html?controller=attachment&task=download&tmpl=component&id=2883',
            }}
            title="L"
            accessory={{
              name: 'pencil',
              type: 'font-awesome',
              size: 20,
            }}
          />
        </Section>
        <Section title="Editable Avatar">
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
        </Section>
      </Body>
    </>
  );
}
