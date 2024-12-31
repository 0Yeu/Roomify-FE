/* eslint-disable max-len */
import { i18n, TFunction } from 'i18next';
import _ from 'lodash';
import { Animated, StyleProp, ViewStyle, LayoutChangeEvent, StyleSheet } from 'react-native';
import { Theme } from 'react-native-elements';
import AppView from './appView';
import Helper from './helper';
/**
 * Serialized animation as generated from After Effects
 */
interface AnimationObject {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

type ColorFilter = {
  keypath: string;
  color: string;
};

/**
 * Properties of the AnimatedLottieView component
 */
export interface AnimatedLottieViewProps {
  /**
   * The source of animation. Can be referenced as a local asset by a string, or remotely
   * with an object with a `uri` property, or it can be an actual JS object of an
   * animation, obtained (for example) with something like
   * `require('../path/to/animation.json')`
   */
  source: string | AnimationObject | { uri: string };

  /**
   * A number between 0 and 1, or an `Animated` number between 0 and 1. This number
   * represents the normalized progress of the animation. If you update this prop, the
   * animation will correspondingly update to the frame at that progress value. This
   * prop is not required if you are using the imperative API.
   */
  progress?: number | Animated.Value | Animated.AnimatedInterpolation;

  /**
   * The speed the animation will progress. This only affects the imperative API. The
   * default value is 1.
   */
  speed?: number;

  /**
   * The duration of the animation in ms. Takes precedence over speed when set.
   * This only works when source is an actual JS object of an animation.
   */
  duration?: number;

  /**
   * A boolean flag indicating whether or not the animation should loop.
   */
  loop?: boolean;

  /**
   * Style attributes for the view, as expected in a standard `View`:
   * http://facebook.github.io/react-native/releases/0.39/docs/view.html#style
   * CAVEAT: border styling is not supported.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * [Android] Relative folder inside of assets containing image files to be animated.
   * Make sure that the images that bodymovin export are in that folder with their names unchanged (should be img_#).
   * Refer to https://github.com/airbnb/lottie-android#image-support for more details.
   * @platform android
   */
  imageAssetsFolder?: string;

  /**
   * [Android]. Uses hardware acceleration to perform the animation. This should only
   * be used for animations where your width and height are equal to the composition width
   * and height, e.g. you are not scaling the animation.
   * @platform android
   */
  hardwareAccelerationAndroid?: boolean;

  /**
   * Determines how to resize the animated view when the frame doesn't match the raw image
   * dimensions.
   * Refer to https://facebook.github.io/react-native/docs/image.html#resizemode
   */
  resizeMode?: 'cover' | 'contain' | 'center';

  /**
   * Determines how Lottie should render
   * Refer to LottieAnimationView#setRenderMode(RenderMode) for more information.
   */
  renderMode?: 'AUTOMATIC' | 'HARDWARE' | 'SOFTWARE';

  /**
   * [Android]. A boolean flag indicating whether or not the animation should caching. Defaults to true.
   * Refer to LottieAnimationView#setCacheComposition(boolean) for more information.
   */
  cacheComposition?: boolean;

  /**
   * [Android]. Allows to specify kind of cache used for animation. Default value weak.
   * strong - cached forever
   * weak   - cached as long it is in active use
   * none   - not cached
   */
  cacheStrategy?: 'strong' | 'weak' | 'none';

  /**
   * A boolean flag indicating whether or not the animation should start automatically when
   * mounted. This only affects the imperative API.
   */
  autoPlay?: boolean;

  /**
   * A boolean flag indicating whether or not the animation should size itself automatically
   * according to the width in the animation's JSON. This only works when source is an actual
   * JS object of an animation.
   */
  autoSize?: boolean;

  /**
   * A boolean flag to enable merge patching in android.
   */
  enableMergePathsAndroidForKitKatAndAbove?: boolean;

  /**
   * A callback function which will be called when animation is finished. Note that this
   * callback will be called only when `loop` is set to false.
   */
  onAnimationFinish ?: (isCancelled: boolean) => void;

  /**
   * A callback function which will be called when the view has been laid out.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * An array of layers you want to override its color filter.
   */
  colorFilters ?: Array<ColorFilter>;

  /**
   * A string to identify the component during testing
   */
  testID?: string;
}

export interface IComponentBase<CustomType={}> {
  width?: number | string;
  height?: number | string;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
  borderWidth?: number;
  backgroundColor?: string;
  color?: string;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  flex?: number;
  customType?: keyof CustomType;
}
const IComponentBaseArray = [
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'paddingVertical',
  'width', 'height', 'borderRadius', 'borderWidth', 'backgroundColor', 'color', 'success', 'warning', 'error'
];

interface IGetProps<Props>{
  initialProps: Props,
  themeKey?: keyof Theme,
  keys: Array<keyof (Props & { theme: Theme })>
}

export type TReturnGetProps<Props> = Partial<Props> & { theme: Theme, t: TFunction, i18n: i18n, otherProps: Partial<Omit<Props, 'customType'>> };

class CComponentHelper {
  private static _instance: CComponentHelper;

  private constructor() {
    // ...
  }

  public static get Instance(): CComponentHelper {
    if (!this._instance) {
      this._instance = new this();
    }
    return CComponentHelper._instance;
  }

  // Default props includes theme, t, IComponentBase
  getProps = <Props extends object>(
    { initialProps, themeKey, keys }: IGetProps<Props>
  ): TReturnGetProps<Props> => {
    // otherProps: Pick<Props, Exclude<keyof Props, keyof Props>>
    // @ts-ignore
    const themeProps = themeKey ? initialProps.theme[themeKey] : {};
    let props: Props & { theme: Theme, t: TFunction, i18n: i18n };

    // @ts-ignore
    if (themeProps?.customType && initialProps.customType) {
      // @ts-ignore
      props = { ...themeProps, ...initialProps.theme[themeKey].customType[initialProps.customType], ...initialProps };
    } else {
      props = { ...themeProps, ...initialProps };
    }

    const pickedKeys = [...keys, ...IComponentBaseArray, 'customType'];
    const otherProps = _.omit(props, pickedKeys);
    const mainProps = _.pick(props, pickedKeys);
    return { ...mainProps, theme: props.theme, t: props.t, i18n: props.i18n, otherProps };
  };

  private convertColorTheme = (props: any) => {
    if (props.theme) {
      if (props.color && _.includes(props.color, 'Color:')) props.color = props.theme.colors[props.color.split(':')[1]];
      if (props.backgroundColor && _.includes(props.backgroundColor, 'Color:')) props.backgroundColor = props.theme.colors[props.backgroundColor.split(':')[1]];
      if (props.titleColor && _.includes(props.titleColor, 'Color:')) props.titleColor = props.theme.colors[props.titleColor.split(':')[1]];
      if (props.labelColor && _.includes(props.labelColor, 'Color:')) props.labelColor = props.theme.colors[props.labelColor.split(':')[1]];
      if (props.iconColor && _.includes(props.iconColor, 'Color:')) props.iconColor = props.theme.colors[props.iconColor.split(':')[1]];
      if (props.placeholderTextColor && _.includes(props.placeholderTextColor, 'Color:')) props.placeholderTextColor = props.theme.colors[props.placeholderTextColor.split(':')[1]];
      if (props.borderColor && _.includes(props.borderColor, 'Color:')) props.borderColor = props.theme.colors[props.borderColor.split(':')[1]];
    }
  };

  handleCommonProps = (props: any, styleName: 'style' | 'containerStyle' = 'containerStyle') => {
    if (props.theme) {
      const { colors } = props.theme;
      if (props.success) props.color = colors.success;
      if (props.warning) props.color = colors.warning;
      if (props.error) props.color = colors.error;
    }
    this.convertColorTheme(props);
    props[styleName] = StyleSheet.flatten([
      Helper.compact({
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginHorizontal: props.marginHorizontal,
        marginVertical: props.marginVertical,
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        paddingHorizontal: props.paddingHorizontal,
        paddingVertical: props.paddingVertical,
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
        borderWidth: props.borderWidth,
        backgroundColor: props.backgroundColor,
        color: props.color,
        flex: props.flex
      }),
      props[styleName],
    ]);
  };

  handleShape = (props: any) => {
    if (props.circle) {
      props.rounded = false;
      props.sharp = false;
      const minDimension = _.min([props.width, props.height]) as number || 50;
      props.width = minDimension;
      props.height = minDimension;
      props.borderRadius = minDimension;
    }
    if (props.rounded && !props.borderRadius) {
      props.borderRadius = AppView.roundedBorderRadius;
    }
    if (props.sharp) {
      props.rounded = false;
      props.circle = false;
      props.borderRadius = 0;
    }
  };
}

const ComponentHelper = CComponentHelper.Instance;
export default ComponentHelper;
