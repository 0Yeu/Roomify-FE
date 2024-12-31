import React from 'react';
import RNImagePicker, { Image as TImage, ImageOrVideo as TImageOrVideo } from 'react-native-image-crop-picker';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'react-native-elements';
import { PERMISSIONS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import withPermission from '../../../Hoc/withPermission';
import QuickView from '../../View/QuickView';
import Button, { ButtonProps } from '../DefaultButton';

interface IImage{
  uri: string;
  width: number;
  height: number;
  mime?: string;
}

export interface ImagePickerButtonProps extends Omit<ButtonProps, 'onPress'> {
  cropType?: 'freeStyle' | 'rectangle' | 'circular';
  multiple?: boolean;
  dataSource?: 'camera' | 'gallery';
  mediaType?: 'photo' | 'video';
  invisible?: boolean;
  buttonChildren?: any;
  imageOutput?: 'path' | 'base64'
  imageWidth?: number;
  imageHeight?: number;
  pickSuccess?: (media: TImageOrVideo[]) => any;
  handleException?: (e: any) => any;
  requestPermission?: (index?: number) => Promise<any>;
  theme?: any;
  onPress?: () => any | Promise<any>;
}

interface State {
  images: IImage[] | null;
}
class ImagePickerButton extends React.PureComponent<ImagePickerButtonProps, State> {
  static defaultProps = {
    dataSource: 'camera',
    mediaType: 'photo',
    imageOutput: 'path'
  };

  constructor(props: any) {
    super(props);
    this.state = {
      images: null,
    };
  }

  // componentWillUnmount() {
  //   RNImagePicker.clean()
  //     .then(() => {})
  //     .catch((e) => this.customHandleException(e));
  // }

  isImage = (media: TImageOrVideo) => media.mime && media.mime.toLowerCase().indexOf('video/') === -1;

  pickSingleWithCamera = () => {
    const { cropType, mediaType, imageOutput, imageWidth, imageHeight, theme } = this.props;
    const cropping = !!cropType || !!imageWidth || !!imageHeight;
    const cropperCircleOverlay = cropType === 'circular';
    const freeStyleCropEnabled = cropType === 'freeStyle';
    const includeBase64 = mediaType === 'photo' && imageOutput === 'base64';

    const width = cropType === 'freeStyle' ? undefined : imageWidth;
    const height = cropType === 'freeStyle' ? undefined : imageHeight;

    const cropperStatusBarColor = theme.Header.backgroundColor;
    const cropperToolbarColor = theme.Header.backgroundColor;
    const cropperToolbarWidgetColor = theme.Header.centerColor;
    const cropperActiveWidgetColor = theme.colors.primary;
    RNImagePicker.openCamera({
      cropping,
      width,
      height,
      freeStyleCropEnabled,
      cropperCircleOverlay,
      // includeExif: true,
      includeBase64,
      cropperStatusBarColor,
      cropperToolbarColor,
      cropperActiveWidgetColor,
      cropperToolbarWidgetColor,
      mediaType,
    })
      .then((media: TImageOrVideo) => {
        this.customPickSuccess([media]);
        if (includeBase64 && this.isImage(media)) {
          const image: TImage = media;
          this.setState({
            images: [{
              uri: `data:${image.mime};base64,${image.data}`,
              width: image.width,
              height: image.height,
            }],
          });
        } else {
          this.setState({
            images: [{
              uri: media.path,
              width: media.width,
              height: media.height,
              mime: media.mime,
            }],
          });
        }
      })
      .catch((e) => this.customHandleException(e));
  };

  pickSingleWithGallery = () => {
    const { cropType, mediaType, imageOutput, imageWidth, imageHeight, theme } = this.props;
    const cropping = !!cropType || !!imageWidth || !!imageHeight;
    const cropperCircleOverlay = cropType === 'circular';
    const freeStyleCropEnabled = cropType === 'freeStyle';
    const includeBase64 = mediaType === 'photo' && imageOutput === 'base64';

    const width = cropType === 'freeStyle' ? undefined : imageWidth;
    const height = cropType === 'freeStyle' ? undefined : imageHeight;

    const cropperStatusBarColor = theme.Header.backgroundColor;
    const cropperToolbarColor = theme.Header.backgroundColor;
    const cropperToolbarWidgetColor = theme.Header.centerColor;
    const cropperActiveWidgetColor = theme.colors.primary;

    RNImagePicker.openPicker({
      width,
      height,
      cropping,
      cropperCircleOverlay,
      freeStyleCropEnabled,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.8,
      compressVideoPreset: 'MediumQuality',
      // includeExif: true,
      cropperStatusBarColor,
      cropperToolbarColor,
      cropperActiveWidgetColor,
      cropperToolbarWidgetColor,
      includeBase64,
      mediaType,
    })
      .then((media: TImageOrVideo) => {
        this.customPickSuccess([media]);
        this.setState({
          images: [{
            uri: media.path,
            width: media.width,
            height: media.height,
            mime: media.mime,
          }],
        });
      })
      .catch((e) => this.customHandleException(e));
  };

  pickMultipleWithGallery = (): void => {
    RNImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      width: 100,
      height: 100,
      // includeExif: true,
      forceJpg: true,

    })
      .then((images) => {
        this.customPickSuccess(images);
        this.setState({
          images: images.map((i) => ({
            uri: i.path,
            width: i.width,
            height: i.height,
            mime: i.mime,
          })),
        });
      })
      .catch((e) => this.customHandleException(e));
  };

  // cropLast = () => {
  //   const { images } = this.state;
  //   if (!image) {
  //     return Alert.alert(
  //       'No image',
  //       'Before open cropping only, please select image'
  //     );
  //   }

  //   RNImagePicker.openCropper({
  //     path: image.uri,
  //     width: 200,
  //     height: 200,
  //     mediaType: 'photo',
  //   })
  //     .then((image: TImage) => {
  //       this.customPickSingleSuccess(image);
  //       this.setState({
  //         image: {
  //           uri: image.path,
  //           width: image.width,
  //           height: image.height,
  //           mime: image.mime,
  //         },
  //         images: null,
  //       });
  //     })
  //     .catch((e) => this.customHandleException(e));
  //   return true;
  // };

  scaledHeight = (oldW: number, oldH: number, newW: number) => (oldH / oldW) * newW;

  getData = () => {
    const { images } = this.state;
    return images;
  };

  // renderVideo = (video: any) => {
  //   console.log('rendering video');
  //   return (
  //     <View style={{ height: 300, width: 300 }}>
  //       <RNVideo
  //         source={{ uri: video.uri, type: video.mime }}
  //         style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
  //         rate={1}
  //         paused={false}
  //         volume={1}
  //         muted={false}
  //         resizeMode="cover"
  //         onError={(e) => console.log(e)}
  //         onLoad={(load) => console.log(load)}
  //         repeat
  //       />
  //     </View>
  //   );
  // };

  // renderImage(image: TImage) {
  //   return (
  //     <Image
  //       style={{ width: 300, height: 300, resizeMode: 'contain' }}
  //       source={image}
  //     />
  //   );
  // }

  // renderAsset(media: TImageOrVideo) {
  //   if (media.mime && media.mime.toLowerCase().indexOf('video/') !== -1) {
  //     return this.renderVideo(media);
  //   }

  //   return this.renderImage(media);
  // }

  customPickSuccess = (medias: TImageOrVideo[]) => {
    // Custom Action...
    const { pickSuccess } = this.props;
    if (pickSuccess) pickSuccess(medias);
  };

  customHandleException = (e: any) => {
    // Custom Action...
    const { handleException } = this.props;
    if (handleException) handleException(e);
  };

  open = async () => {
    const { dataSource, multiple, onPress, requestPermission: requestPermissionProp } = this.props;
    let granted = false;
    const requestPermission: any = requestPermissionProp;
    if (multiple) {
      granted = await requestPermission(1);
      if (granted) {
        this.pickMultipleWithGallery();
      }
    } else {
      switch (dataSource) {
        case 'camera':
          granted = await requestPermission(0);
          if (granted) {
            this.pickSingleWithCamera();
          }
          break;
        default:
          granted = await requestPermission(1);
          if (granted) {
            this.pickSingleWithGallery();
          }
          break;
      }
    }

    if (onPress) await onPress();
  };

  render() {
    const { invisible, buttonChildren, ...otherProps } = this.props;

    return (
      <QuickView>
        {
          invisible ? (
            <TouchableOpacity onPress={() => this.open()}>
              {buttonChildren}
            </TouchableOpacity>
          )
            : <Button {...otherProps} onPress={this.open} />
        }
      </QuickView>
    );
  }
}

export default (
  withPermission(
    [
      {
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
        tDeniedMessage: ['permission_denied:camera', { appName: DeviceInfo.getApplicationName() }]
      },
      {
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        tDeniedMessage: ['permission_denied:camera', { appName: DeviceInfo.getApplicationName() }]
      }
    ]
  )(withTheme(ImagePickerButton as any, '') as unknown as React.ComponentClass<ImagePickerButtonProps>)
);
