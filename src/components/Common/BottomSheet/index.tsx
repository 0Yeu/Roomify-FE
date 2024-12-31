/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo } from 'react';
import { useTheme } from 'react-native-elements';
import NativeBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal as NativeBottomSheetModal,
  BottomSheetModalProps as NativeBottomSheetModalProps,
  BottomSheetProps as NativeBottomSheetProps
} from '@gorhom/bottom-sheet';
import { View, ViewProps } from 'react-native';
import AppView from '@utils/appView';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { toRad } from 'react-native-redash';
import Header, { HeaderProps } from '../Header';
import { transformOrigin } from './utilities/transformOrigin';

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const { theme } = useTheme();

  // render
  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: AppView.bottomSheetBorderRadius,
      borderTopRightRadius: AppView.bottomSheetBorderRadius,
    }}
    />
  );
};

interface IBottomSheetProps extends Omit<NativeBottomSheetProps, 'snapPoints'> {
  useBottomSheetModal?: boolean;
}

interface IBottomSheetModalProps extends Omit<NativeBottomSheetModalProps, 'snapPoints'> {
  useBottomSheetModal: true;
}

export const Indicator = (
  props: ViewProps & {
    useAnimatedIndicator?: boolean,
    animatedIndex?: Animated.SharedValue<number>
  }
) => {
  const { style, useAnimatedIndicator, animatedIndex } = props;
  const customStyle = style || {} as any;
  const containerStyle = {
    alignSelf: 'center',
    height: 5,
    backgroundColor: '#AAA',
    ...customStyle,
  };

  if (useAnimatedIndicator && animatedIndex) {
    const indicatorTransformOriginY = useDerivedValue(
      () => interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP)
    );
    const containerAnimatedStyle = useAnimatedStyle(() => {
      const borderTopRadius = interpolate(
        animatedIndex.value,
        [1, 2],
        [20, 0],
        Extrapolate.CLAMP
      );
      return {
        borderTopLeftRadius: borderTopRadius,
        borderTopRightRadius: borderTopRadius,
      };
    });

    const leftIndicatorStyle = useMemo(
      () => ({
        ...containerStyle,
        position: 'absolute',
        width: 12,
        marginTop: 9,
        borderTopStartRadius: 4,
        borderBottomStartRadius: 4,
      }),
      []
    );

    const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
      const leftIndicatorRotate = interpolate(
        animatedIndex.value,
        [0, 1, 2],
        [toRad(-30), 0, toRad(30)],
        Extrapolate.CLAMP
      );
      return {
        transform: transformOrigin(
          { x: 0, y: indicatorTransformOriginY.value },
          {
            rotate: `${leftIndicatorRotate}rad`,
          },
          {
            translateX: -6,
          }
        ),
      };
    });
    const rightIndicatorStyle = useMemo(
      () => ({
        ...containerStyle,
        position: 'absolute',
        width: 12,
        marginTop: 9,
        borderTopEndRadius: 4,
        borderBottomEndRadius: 4,
      }),
      []
    );
    const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
      const rightIndicatorRotate = interpolate(
        animatedIndex.value,
        [0, 1, 2],
        [toRad(30), 0, toRad(-30)],
        Extrapolate.CLAMP
      );
      return {
        transform: transformOrigin(
          { x: 0, y: indicatorTransformOriginY.value },
          {
            rotate: `${rightIndicatorRotate}rad`,
          },
          {
            translateX: 6,
          }
        ),
      };
    });
    return (
      <Animated.View
        style={[containerStyle, { marginVertical: 5 }, containerAnimatedStyle]}
        renderToHardwareTextureAndroid
      >
        <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
        <Animated.View
          style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
        />
      </Animated.View>
    );
  }

  return (
    <View style={[containerStyle, { width: 24, borderRadius: 4, marginTop: 10 }]} />
  );
};

interface Props {
  key?: string;
  ref?: any;
  forwardedRef?: any;
  title?: string;
  tTitle?: string | Array<any>;
  headerProps?: HeaderProps;
  snapPoints?: Array<string | number> | Animated.SharedValue<Array<string | number>>;
  backdropPressBehavior?: 'none' | 'close' | 'collapse';
  showIndicator?: boolean;
  useBackdrop?: boolean;
  useAnimatedIndicator?: boolean;
}

export type BottomSheetProps = Props & (IBottomSheetProps | IBottomSheetModalProps);
const BottomSheetFC: React.FC<BottomSheetProps> = (props: BottomSheetProps) => {
  const {
    forwardedRef,
    title,
    tTitle,
    headerProps: headerPropsProp,
    snapPoints,
    useBackdrop,
    backdropPressBehavior,
    showIndicator,
    useBottomSheetModal,
    useAnimatedIndicator,
    ...otherProps
  } = props;

  // Variables
  const headerProps = useMemo(
    () => {
      const result = headerPropsProp || {};
      if (title) result.title = title;
      if (tTitle) result.tTitle = tTitle;
      if (!title && !tTitle) {
        result.closeIcon = false;
        result.borderBottomColor = 'transparent';
        result.marginTop = -5;
        result.height = 0;
      } else { result.closeIcon = true; }
      return result;
    },
    [title, tTitle, headerPropsProp]
  );
  const Component = useBottomSheetModal ? NativeBottomSheetModal : NativeBottomSheet;

  // Renders
  const renderIndicator = useCallback((props) => {
    if (!showIndicator) return null;
    return (
      <Indicator useAnimatedIndicator={useAnimatedIndicator} {...props} />
    );
  }, [showIndicator, useAnimatedIndicator]);

  const renderHeaderHandle = useCallback(
    (props) => (
      <View style={{
        borderTopLeftRadius: AppView.bottomSheetBorderRadius,
        borderTopRightRadius: AppView.bottomSheetBorderRadius,
      }}
      >
        {renderIndicator(props)}
        <Header
          customType="bottomSheet"
          onPressCloseIcon={forwardedRef?.current?.close}
          barStyle={null as any}
          {...headerProps}
        />
      </View>
    ),
    [headerProps]
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
    ),
    [backdropPressBehavior]
  );

  return (
    <Component
      ref={forwardedRef}
      backgroundComponent={CustomBackground}
      style={AppView.shadow(20)}
      handleComponent={renderHeaderHandle}
      snapPoints={snapPoints as any}
      backdropComponent={useBackdrop ? renderBackdrop : undefined}
      {...otherProps}
    />
  );
};

BottomSheetFC.defaultProps = {
  snapPoints: ['25%', '50%', '90%'],
  animateOnMount: true,
  backdropPressBehavior: 'none',
  useBackdrop: true,
  showIndicator: true,
  // useAnimatedIndicator: true,
};

const BottomSheet = React.forwardRef((props: any, ref) => (
  <BottomSheetFC {...props} forwardedRef={ref} />
));

export default BottomSheet as React.FC<BottomSheetProps>;
