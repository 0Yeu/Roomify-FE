import React, { PureComponent } from 'react';
import FastImage, { FastImageProps, ImageStyle, OnProgressEvent, Source } from 'react-native-fast-image';
import {
  StyleSheet, Modal, StyleProp, ViewStyle, Image as RNImage
} from 'react-native';
import { withTheme } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import _ from 'lodash';
import AppView from '@utils/appView';
import ImageSource from '@images';
import ComponentHelper, { IComponentBase } from '@utils/component';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import Icon from '@components/Common/Icon';
import QuickView from '../../View/QuickView';
import Loading from '../../Loading';

export type CustomType = {
  circleLoading: ImageProps,
  barLoading: ImageProps,
  pieLoading: ImageProps,
};

export interface ImageProps extends Omit<FastImageProps, 'source'>, Omit<IComponentBase<CustomType>, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
  source?: Source;
  multipleSources?: any[];
  viewEnable?: boolean;
  loadingColor?: string;
  loadingSize?: number;
  isLoading?: boolean; // trigger loading from Props
  center?: boolean;
  sharp?: boolean;
  rounded?: boolean;
  circle?: boolean;
  disablePlaceholder?: boolean;
  placeholderImage?: any;
  placeholderStyle?: StyleProp<ImageStyle>;
  errorStyle?: StyleProp<ImageStyle>;
  errorImage?: any;
  containerStyle?: StyleProp<ViewStyle>;
  renderProgress?: (
    data: {
      indeterminate: boolean,
      progress: number,
      loadingColor: string,
      loadingSize?: number
      width: number
    }) => React.ReactElement;
  onPress?: () => any;
  onClose?: () => any;
}
interface State {
  progress: number;
  indeterminate: boolean;
  loading: boolean;
  renderFail: boolean;
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  viewModeOn: boolean;
}
const styles: any = {
  center: {
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  viewHeaderImages: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
};

class Image extends PureComponent<ImageProps, State> {
  static defaultProps = {
    width: AppView.screenWidth - 2 * AppView.bodyPaddingHorizontal,
    resizeMode: 'cover',
    rounded: true,
    placeholderImage: ImageSource.placeholderImage,
    errorImage: ImageSource.errorImage,
  };

  constructor(props: any) {
    super(props);
    const { source, width: widthProp, height: heightProp } = this.handleProps();
    const isRemoteImage = !!source?.uri;
    const width: any = widthProp;
    let height: any = heightProp || (isRemoteImage ? widthProp : 0);

    if (source && !isRemoteImage) {
      const { width: imageWidth, height: imageHeight } = RNImage.resolveAssetSource(source as any);
      height = (imageHeight / imageWidth) * width;
    }

    this.state = {
      progress: 0,
      indeterminate: true,
      loading: isRemoteImage,
      renderFail: false,
      viewModeOn: false,
      imageWidth: 0,
      imageHeight: 0,
      width,
      height,
    };
    this.preLoad();
  }

  private handleProps = () => {
    const props = ComponentHelper.getProps<ImageProps>({
      initialProps: this.props,
      themeKey: 'Image',
      keys: [
        'source', 'center', 'containerStyle', 'multipleSources',
        'style', 'viewEnable', 'sharp', 'rounded', 'circle',
        'loadingColor', 'loadingSize', 'renderProgress', 'theme',
        'onLoad', 'disablePlaceholder', 'placeholderImage', 'borderRadius',
        'errorImage', 'errorStyle', 'isLoading', 'onClose'
      ]
    });
    ComponentHelper.handleShape(props);
    ComponentHelper.handleCommonProps(props, 'containerStyle');

    return props;
  };

  getImageSize = () => {
    const { imageWidth, imageHeight, width, height } = this.state;
    return { imageWidth, imageHeight, width, height };
  };

  renderLoadingPlaceholder = () => {
    const { isLoading } = this.handleProps();
    const { loading, width, height } = this.state;
    const {
      disablePlaceholder,
      placeholderImage,
      placeholderStyle,
      borderRadius,
      source,
      theme
    } = this.handleProps();

    if (!source) {
      return (
        <FastImage
          style={[{
            width,
            height,
            borderRadius,
            backgroundColor: theme.colors.grey5
          }, placeholderStyle]}
          source={placeholderImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }

    if ((isLoading || loading) && !disablePlaceholder) {
      return (
        <FastImage
          style={[{
            width,
            height,
            position: 'absolute',
            borderRadius,
            backgroundColor: theme.colors.grey5
          }, placeholderStyle]}
          source={placeholderImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }

    return (
      <QuickView
        width={width}
        height={height}
        position="absolute"
        borderRadius={borderRadius}
      />
    );
  };

  renderErrorPlaceholder = () => {
    const { errorImage, errorStyle, borderRadius, theme } = this.handleProps();
    const { renderFail, width, height } = this.state;
    if (renderFail) {
      return (
        <FastImage
          style={[{
            width,
            height,
            position: 'absolute',
            borderRadius,
            backgroundColor: theme.colors.grey4
          }, errorStyle]}
          source={errorImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    return null;
  };

  renderProgress = () => {
    const { loading, width, indeterminate, progress } = this.state;
    const {
      loadingColor: loadingColorProp,
      loadingSize: loadingSizeProp,
      renderProgress,
      isLoading,
      theme
    } = this.handleProps();

    const loadingSize = loadingSizeProp || width / 4;
    const loadingColor = loadingColorProp || theme.colors.primary;
    if (isLoading || loading) {
      if (renderProgress) {
        return renderProgress({
          loadingSize: loadingSizeProp, width, indeterminate, progress, loadingColor
        });
      }
      return (
        <QuickView center position="absolute">
          <Loading color={loadingColor} size={loadingSize >= 65 ? 'large' : 'small'} />
        </QuickView>
      );
    }
    return null;
  };

  preLoad = () => {
    const { multipleSources } = this.handleProps();
    if (multipleSources) {
      multipleSources.forEach((item) => {
        // FastImage.preload([{ uri: item.uri }]);
        RNImage.prefetch(item.uri);
      });
    }
  };

  renderImageViewer = () => {
    const imageUrls: IImageInfo[] = [];
    let index = 0;
    const {
      source: sourceProp,
      multipleSources,
      loadingColor: loadingColorProp,
      theme
    } = this.handleProps();
    const { width: widthState, height: heightState } = this.state;
    const loadingColor = loadingColorProp || theme.colors.primary;
    const height = (heightState / widthState) * AppView.screenWidth;

    let source = sourceProp;
    if (sourceProp) {
      if (sourceProp.uri) { source = _.pick(sourceProp, 'uri'); }
      const { viewModeOn } = this.state;
      if (!multipleSources) {
        imageUrls.push({
          url: sourceProp.uri || '',
          props: {
            source,
          },
          width: AppView.screenWidth,
          height
        });
      } else {
        multipleSources.forEach((item) => {
          imageUrls.push({
            url: item.uri || '',
            props: {
              item,
            },
          });
        });
        index = _.findIndex(multipleSources, source);
        if (index !== -1) {
          imageUrls[index].width = AppView.screenWidth;
          imageUrls[index].height = height;
        }
      }

      return (
        <Modal visible={viewModeOn} transparent>
          <ImageViewer
            onCancel={() => this.setState({ viewModeOn: false })}
            loadingRender={() => <Loading size="large" color={loadingColor} />}
            enableSwipeDown
            index={index}
            imageUrls={imageUrls}
            enablePreload
            renderHeader={() => (
              <QuickView style={styles.viewHeaderImages}>
                <Icon
                  name="close"
                  type="antdesign"
                  size={24}
                  color="#FFFFFF"
                  onPress={() => this.setState({ viewModeOn: false })}
                />
              </QuickView>
            )}
            renderImage={(props) => this.renderImage(props)}
          />
        </Modal>
      );
    }
    return null;
  };

  onPressImage = () => {
    const { onPress, viewEnable } = this.handleProps();
    const { renderFail } = this.state;
    if (viewEnable && !renderFail) {
      this.setState({ viewModeOn: true });
    } else if (onPress) onPress();
  };

  onProgress = (e: OnProgressEvent) => {
    const { source } = this.handleProps();
    const { loading } = this.state;
    if (loading && source) {
      const { loaded, total } = e.nativeEvent;
      if (total > 0) {
        this.setState({ indeterminate: false });
        const progress = loaded / total;
        if (progress && progress > 0) {
          this.setState({ progress });
        }
      }
    }
  };

  onLoad = (e: any) => {
    const { onLoad, height: heightProp, width: widthProp, circle } = this.handleProps();

    const { width: widthState } = this.state;
    const { nativeEvent: { width, height } } = e;
    const ratio = height / width;
    const autoHeight = widthState * ratio;
    this.setState({
      imageWidth: width,
      imageHeight: height,
      loading: false,
      width: widthState,
      height: circle ? widthProp as number : heightProp as number || autoHeight,
      indeterminate: false
    });
    if (onLoad) { onLoad(e); }
  };

  onError = () => this.setState({ renderFail: true, indeterminate: false, loading: false });

  renderImage = (customProps?: any) => {
    const {
      width: widthState,
      height: heightState,
      viewModeOn
    } = this.state;
    const viewModeHeight = customProps?.style?.height
    || (heightState / widthState) * AppView.screenWidth;

    const source: any = customProps?.source || this.handleProps().source;

    if (!source) return <QuickView />;
    /**
     * style
     */
    const style: any = StyleSheet.flatten([
      {
        width: viewModeOn ? AppView.screenWidth : widthState,
        height: viewModeOn ? viewModeHeight : heightState,
        borderRadius: viewModeOn ? 0 : this.handleProps().borderRadius,
      },
      this.handleProps().style,
    ]);
    return (
      <FastImage
        {...this.handleProps().otherProps}
        style={style}
        source={source}
        onProgress={this.onProgress}
        onLoad={this.onLoad}
        onError={this.onError}
      />
    );
  };

  renderClose = () => {
    const { onClose } = this.handleProps();
    if (onClose) {
      return (
        <QuickView
          position="absolute"
          right={-5}
          top={-5}
          onPress={onClose}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          padding={5}
          borderRadius={30}
        >
          <Icon
            name="close"
            color="white"
          />
        </QuickView>
      );
    }
    return null;
  };

  render() {
    const { renderFail, loading } = this.state;
    const touchableEnable = (this.handleProps().viewEnable && !renderFail && !loading)
      || this.handleProps().onPress;

    const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
      this.handleProps().containerStyle,
      {
        alignSelf: this.handleProps().center ? 'center' : 'flex-start',
        justifyContent: 'center',
      },
    ]);

    return (
      <>
        <QuickView
          style={containerStyle}
          onPress={touchableEnable ? this.onPressImage : undefined}
        >
          { this.renderLoadingPlaceholder() }
          { this.renderErrorPlaceholder() }
          { this.renderImage() }
          { this.renderProgress() }
          { this.renderClose() }
        </QuickView>
        {this.renderImageViewer()}
      </>
    );
  }
}

export default withTheme(Image as any, '') as unknown as React.ComponentClass<ImageProps>;
