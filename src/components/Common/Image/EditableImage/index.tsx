import React, { Component } from 'react';
import AppHelper, { IResizedImage, IImage } from '@utils/appHelper';
import { FlatList, Platform, TouchableOpacity } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import Helper from '@utils/helper';
import _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import { withTheme } from 'react-native-elements';
import Server from '@utils/server';
import { i18n, TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import Button from '../../Button/DefaultButton';
import Icon from '../../Icon';
import Image, { ImageProps } from '../DefaultImage';
import ImagePickerButton, { ImagePickerButtonProps } from '../../Button/ImagePickerButton';
import QuickView from '../../View/QuickView';
import Picker from '../../Picker';

export interface EditableImageProps extends ImageProps {
  imagePickerButtonProps?: ImagePickerButtonProps;
  folderPrefix?: string;
  uploadCallback?: (data: IImage[]) => Promise<any> | any;
  buttonChildren?: any;
  onClose?: () => any;
  pickSuccess?: (media: ImageOrVideo[]) => Promise<any> | any;
  handleException?: (e: any) => any;
  resizedImageWidth?: {
    'origin': number,
    'medium': number,
    'thumbnail': number
  } | number;
  multiple?: any;
}

interface State {
  loading: boolean;
  data: IImage[];
  imageUrls: string[];
}

class EditableImage extends Component<EditableImageProps & { t: TFunction, i18n: i18n }, State> {
  static defaultProps = {
    folderPrefix: 'images'
  };

  pickerRef: any;

  pickerCamera: any;

  pickerGallery: any;

  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      imageUrls: [
        // 'https://airtravel.s3.us-east-2.amazonaws.com/images/img0005-2020103108093228.JPG',
        // 'https://airtravel.s3.us-east-2.amazonaws.com/images/img0006-2020103108093229.HEIC'
      ],
      data: []
    };
  }

  pickSuccess = async (medias: ImageOrVideo[]) => {
    this.pickerRef?.close();

    const {
      pickSuccess: pickSuccessProp,
      resizedImageWidth: resizedImageWidthProp,
      folderPrefix,
      uploadCallback,
    } = this.props;
    if (pickSuccessProp) pickSuccessProp(medias);
    // console.log('medias', medias[0].path);
    try {
      if (resizedImageWidthProp) {
        // Resize the photo to 3 different sizes
        if (_.has(resizedImageWidthProp, 'origin') && _.has(resizedImageWidthProp, 'medium') && _.has(resizedImageWidthProp, 'thumbnail')) {
          this.setState({ loading: true });
          const resizedImageWidth: any = resizedImageWidthProp;
          await Promise.all(medias.map(async (media: ImageOrVideo) => {
            const originImage = await AppHelper.resize(media, resizedImageWidth.origin);
            const mediumImage = await AppHelper.resize(media, resizedImageWidth.medium);
            const thumbnailImage = await AppHelper.resize(media, resizedImageWidth.thumbnail);
            const resizedImage: IResizedImage = {
              origin: originImage,
              medium: mediumImage,
              thumbnail: thumbnailImage,
            };
            resizedImage.origin.name = `${resizedImage.origin.name.replace(`.${resizedImage.origin.name.split('.').pop()}` || '', `-origin.${resizedImage.origin.name.split('.').pop()}`)}`;
            resizedImage.medium.name = `${resizedImage.medium.name.replace(`.${resizedImage.medium.name.split('.').pop()}` || '', `-medium.${resizedImage.medium.name.split('.').pop()}`)}`;
            resizedImage.thumbnail.name = `${resizedImage.thumbnail.name.replace(`.${resizedImage.thumbnail.name.split('.').pop()}` || '', `-thumbnail.${resizedImage.thumbnail.name.split('.').pop()}`)}`;

            const { data } = this.state;
            // Upload to S3
            // eslint-disable-next-line max-len
            const resizedReturnUrl = await Server.uploadResizedImageToS3(folderPrefix, resizedImage);

            const name: string = media.filename || media.path.split('/').pop() || '';

            // For Setting State
            const image: IImage = {
              name,
              mime: media.mime,
              width: media.width,
              height: media.height,
              size: media.size,
              path: media.path,
              sourceUrl: media.sourceURL,
            };

            data.push({
              ...image,
              remoteUrl: resizedReturnUrl.medium,
              resizedImageUrl: resizedReturnUrl,
            });

            // Clear Cache
            RNFetchBlob.fs.unlink(originImage.path);
            RNFetchBlob.fs.unlink(mediumImage.path);
            RNFetchBlob.fs.unlink(thumbnailImage.path);

            this.setState((previousState: any) => ({
              data,
              imageUrls: [...previousState.imageUrls, resizedReturnUrl.thumbnail]
            }));
          }));
        }

        // Resize the photo to 1 size
        if (typeof resizedImageWidthProp === 'number') {
          this.setState({ loading: true });
          const resizedImageWidth: any = resizedImageWidthProp;
          await Promise.all(medias.map(async (media: ImageOrVideo) => {
            const resizedImage: IImage = await AppHelper.resize(media, resizedImageWidth);
            const name: string = media.filename || media.path.split('/').pop() || '';

            // For Setting State
            const image: IImage = {
              name,
              mime: media.mime,
              width: media.width,
              height: media.height,
              size: media.size,
              path: media.path,
              sourceUrl: media.sourceURL,
            };
            const { data } = this.state;
            // Upload to S3
            const returnUrl = await Server.uploadImageToS3(folderPrefix, resizedImage);

            data.push({
              ...image,
              remoteUrl: returnUrl,
            });

            this.setState((previousState: any) => ({
              data,
              imageUrls: [...previousState.imageUrls, returnUrl],
            }));

            // Clear Cache
            RNFetchBlob.fs.unlink(resizedImage.path);
          }));
        }
      } else {
        this.setState({ loading: true });
        await Promise.all(medias.map(async (media: ImageOrVideo) => {
          const name: string = media.filename || media.path.split('/').pop() || '';

          // convert ImageOrVideo to IImage
          const image: IImage = {
            name,
            mime: media.mime,
            width: media.width,
            height: media.height,
            size: media.size,
            path: media.path,
            sourceUrl: media.sourceURL,
          };
          const { data } = this.state;

          // Upload to S3
          const returnUrl = await Server.uploadImageToS3(folderPrefix, image);
          data.push({
            ...image,
            remoteUrl: returnUrl,
          });

          this.setState((previousState: any) => ({
            data,
            imageUrls: [...previousState.imageUrls, returnUrl],
          }));
        }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('UploadError:', error);
    }

    const { data } = this.state;
    if (uploadCallback) await uploadCallback(data);
    this.setState({ loading: false });
  };

  handleException = (e: any) => {
    const { handleException: handleExceptionProp } = this.props;
    if (handleExceptionProp) handleExceptionProp(e);

    // eslint-disable-next-line no-console
    console.log('Error: ', e);
    this.pickerRef?.close();
  };

  openCamera = () => this.pickerCamera.open();

  openGallery = () => this.pickerGallery.open();

  removeImageItem = (imageUrl: string) => {
    const { imageUrls, data } = this.state;
    this.setState({
      imageUrls: imageUrls.filter((item: string) => item !== imageUrl),
      data: data.filter((item: IImage) => item.remoteUrl !== imageUrl)
    });
  };

  renderImageItem = ({ item }: any) => {
    // Just for getting ...otherProps
    const { multiple, source: sourceProp, buttonChildren, ...otherProps } = this.props;
    const { loading, imageUrls } = this.state;
    const source = { uri: item };
    return (
      <QuickView>
        <Image
          isLoading={loading}
          source={source}
          containerStyle={{ marginHorizontal: 5 }}
          viewEnable
          multipleSources={Helper.assignKeyToPlainArray(imageUrls, 'uri')}
          {...otherProps}
        />
        <Button
          icon={{ name: 'close', size: 25 }}
          width={35}
          titlePaddingHorizontal={0}
          titlePaddingVertical={0}
          circle
          backgroundColor="#E6E9F0"
          containerStyle={{ position: 'absolute', right: 15, top: 5 }}
          onPress={() => this.removeImageItem(item)}
        />
      </QuickView>
    );
  };

  renderPickerOrFlatList = () => {
    const {
      multiple,
      source: sourceProp,
      buttonChildren: buttonChildrenProp,
      t,
      i18n,
      onClose,
      ...otherProps
    } = this.props;
    const { loading, imageUrls } = this.state;

    // Single Image
    if (!multiple) {
      const source = !_.isEmpty(imageUrls) ? { uri: imageUrls[0] } : sourceProp;

      const buttonChildren = buttonChildrenProp || (
        <Image
          isLoading={loading}
          source={source}
          {...otherProps}
        />
      );
      const values = [t('component:editable_image:take_photo'), t('component:editable_image:select_from_album')];

      return (
        <Picker
          key={i18n.language}
          ref={(ref: any) => { this.pickerRef = ref; }}
          values={values}
          width={150}
          height={40}
          shadow
          pickerType={Platform.OS !== 'ios' ? 'modal' : 'default'}
          modalProps={{ swipeDirection: 'down' }}
          modalHeight={130}
          invisible
          onClose={onClose}
          buttonChildren={buttonChildren}
          onValuePress={(value, index) => {
            switch (index) {
              case 0:
                this.openCamera();
                break;
              default:
                this.openGallery();
            }
          }}
        />
      );
    }

    // Multiple Images
    const buttonChildren = buttonChildrenProp || (
      <Icon name="folder-multiple-image" size={30} type="material-community" />
    );

    if (_.isEmpty(imageUrls)) {
      return (
        <TouchableOpacity onPress={() => this.openGallery()}>
          {buttonChildren}
        </TouchableOpacity>
      );
    }
    return (
      <FlatList
        data={imageUrls}
        renderItem={this.renderImageItem}
        horizontal
        contentContainerStyle={{ marginHorizontal: -5 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  };

  getData = () => {
    const { data } = this.state;
    return data;
  };

  focus = () => this.pickerRef.focus();

  render() {
    const {
      imagePickerButtonProps,
      multiple,
    } = this.props;

    return (
      <QuickView>
        {this.renderPickerOrFlatList()}
        <ImagePickerButton
          ref={(ref: any) => { this.pickerCamera = ref; }}
          {...imagePickerButtonProps}
          invisible
          pickSuccess={this.pickSuccess}
          handleException={this.handleException}
        />
        <ImagePickerButton
          ref={(ref: any) => { this.pickerGallery = ref; }}
          {...imagePickerButtonProps}
          invisible
          dataSource="gallery"
          multiple={multiple}
          pickSuccess={this.pickSuccess}
          handleException={this.handleException}
        />
      </QuickView>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(
  EditableImage as any, ''
)) as unknown as React.ComponentClass<EditableImageProps>;
