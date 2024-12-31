/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  TouchableOpacity,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import withModalProvider from '@components/Hoc/withModalProvider';

import { createLocationListMockData } from '@containers/Example/Modal/utilities';
import QuickView from '@components/Common/View/QuickView';
import BottomSheetModal, { Indicator } from '@components/Common/BottomSheet';
import Input from '@components/Common/Input/DefaultInput';
import MapView from '@components/Common/MapView';
import RNMapView from 'react-native-maps';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import LocationItem from './components/LocationItem';
import LocationDetails, {
  LOCATION_DETAILS_HEIGHT,
} from './components/LocationDetails';
import BlurredBackground from './components/BlurredBackground';

type Location = {
  id: string;
  name: string;
  address: string;
  photos: string[];
};

const SEARCH_HANDLE_HEIGHT = 50;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapExample = () => {
  const [selectedItem, setSelectedItem] = useState<Location>();

  // refs
  const mapRef = useRef<RNMapView>(null);
  const poiListModalRef = useRef<BottomSheetModalMethods>(null);
  const poiDetailsModalRef = useRef<BottomSheetModalMethods>(null);

  // hooks
  const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // #region variables
  const data = useMemo(() => createLocationListMockData(15), []);
  const poiListSnapPoints = useMemo(
    () => [
      bottomSafeArea + SEARCH_HANDLE_HEIGHT,
      LOCATION_DETAILS_HEIGHT + bottomSafeArea,
      '80%',
    ],
    [bottomSafeArea]
  );
  const poiDetailsSnapPoints = useMemo(
    () => [
      LOCATION_DETAILS_HEIGHT + bottomSafeArea + SEARCH_HANDLE_HEIGHT,
      '80%',
    ],
    [bottomSafeArea]
  );
  const mapInitialCamera = useMemo(
    () => ({
      center: {
        latitude: 52.3791,
        longitude: 4.9003,
      },
      heading: 0,
      pitch: 0,
      zoom: 0,
      altitude: 40000,
    }),
    []
  );
  // #endregion

  // #region animated variables
  const animatedPOIListIndex = useSharedValue<number>(0);
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT);
  const animatedPOIDetailsIndex = useSharedValue<number>(0);
  const animatedPOIDetailsPosition = useSharedValue<number>(SCREEN_HEIGHT);

  // #endregion

  // #region callbacks
  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);
  const handleCloseLocationDetails = useCallback(() => {
    setSelectedItem(undefined);
    poiDetailsModalRef.current?.dismiss();
  }, []);
  const handlePresentLocationDetails = useCallback((item: Location) => {
    setSelectedItem(item);
    poiDetailsModalRef.current?.present();
  }, []);
  // #endregion

  // #region styles
  const scrollViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animatedPOIListIndex.value,
  }));
  const scrollViewStyle = useMemo(
    () => [styles.scrollView, scrollViewAnimatedStyle],
    [scrollViewAnimatedStyle]
  );
  const scrollViewContentContainer = useMemo(
    () => [
      styles.scrollViewContentContainer,
      { paddingBottom: bottomSafeArea },
    ],
    [bottomSafeArea]
  );
  // #endregion

  // #region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => poiListModalRef.current?.present());
  }, []);
  // #endregion

  // renders
  const renderItem = useCallback(
    (item, index) => (
      <TouchableOpacity
        key={`${item.name}.${index}`}
        onPress={() => handlePresentLocationDetails(item)}
      >
        <LocationItem title={item.name} subTitle={item.address} />
      </TouchableOpacity>
    ),
    [handlePresentLocationDetails]
  );
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough
        pressBehavior="none"
        appearsOnIndex={2}
        disappearsOnIndex={1}
      />
    ),
    []
  );

  const renderSearchContent = useCallback(
    () => (
      <QuickView paddingHorizontal={20}>
        <Indicator style={{ marginBottom: 10 }} />
        <Input tPlaceholder="field:username" InputComponent={BottomSheetTextInput as any} />
      </QuickView>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialCamera={mapInitialCamera}
        zoomEnabled={false}
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
        fullScreen
      />
      <BottomSheetModal
        ref={poiListModalRef}
        useBottomSheetModal
        key="PoiListSheet"
        name="PoiListSheet"
        index={1}
        snapPoints={poiListSnapPoints}
        handleHeight={SEARCH_HANDLE_HEIGHT}
        topInset={headerHeight}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        keyboardBehavior="extend"
        animatedPosition={animatedPOIListPosition}
        animatedIndex={animatedPOIListIndex}
        handleComponent={renderSearchContent}
        backdropComponent={renderBackdrop}
        backgroundComponent={BlurredBackground}
      >
        <BottomSheetScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          style={scrollViewStyle}
          contentContainerStyle={scrollViewContentContainer}
        >
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={poiDetailsModalRef}
        useBottomSheetModal
        key="PoiDetailsSheet"
        name="PoiDetailsSheet"
        snapPoints={poiDetailsSnapPoints}
        topInset={headerHeight}
        animatedIndex={animatedPOIDetailsIndex}
        animatedPosition={animatedPOIDetailsPosition}
        backgroundComponent={BlurredBackground}
      >
        <LocationDetails
          onClose={handleCloseLocationDetails}
          {...(selectedItem as Location)}
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
});

export default withModalProvider(MapExample);
