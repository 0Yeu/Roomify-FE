/* eslint-disable react/no-children-prop */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header, Body, Button, QuickView, Text, ModalButton, BottomSheet, Input } from '@components';
import { BottomSheetView, useBottomSheetModal, useBottomSheetDynamicSnapPoints, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import { useTheme } from 'react-native-elements';
import withModalProvider from '@components/Hoc/withModalProvider';
import { Global } from '@utils/appHelper';
import i18next from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AppView from '@utils/appView';
import { Indicator } from '@components/Common/BottomSheet';
import Section from '../Section';
import ContactList from './components/ContactList';
import createDummyScreen from './components/DummyScreen';

const Stack = createStackNavigator();
const ScreenA = createDummyScreen({
  title: 'FlatList Screen',
  nextScreen: 'ScrollView Screen',
  type: 'FlatList',
});

const ScreenB = createDummyScreen({
  title: 'ScrollView Screen',
  nextScreen: 'SectionList Screen',
  type: 'ScrollView',
  count: 25,
});

const ScreenC = createDummyScreen({
  title: 'SectionList Screen',
  nextScreen: 'View Screen',
  type: 'SectionList',
  count: 20,
});

const ScreenD = createDummyScreen({
  title: 'View Screen',
  nextScreen: 'FlatList Screen',
  type: 'View',
  count: 5,
});

const Navigator = () => {
  const { theme } = useTheme();

  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: true,
      cardStyle: {
        backgroundColor: theme.colors.surface,
        overflow: 'visible',
      },
      headerStyle: {
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.borderBottom,
        borderBottomWidth: 0.5,
      },
      headerTitleStyle: {
        fontSize: 22,
        color: theme.colors.black,
        fontFamily: AppView.fontFamily,
      },
      headerLeftContainerStyle: { marginLeft: 10 },
      headerStatusBarHeight: 0,
    }),
    [theme]
  );

  const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
  return (
    <NavigationContainer independent>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="FlatList Screen"
          options={screenAOptions}
          component={ScreenA}
        />
        <Stack.Screen name="ScrollView Screen" component={ScreenB} />
        <Stack.Screen name="SectionList Screen" component={ScreenC} />
        <Stack.Screen name="View Screen" component={ScreenD} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ModalExample: React.FC<any> = () => {
  // Refs
  const customChildrenRef = useRef<any>(null);
  const customBackdropRef = useRef<any>(null);
  const fancyModalRef = useRef<any>(null);
  const bottomSheetModalARef = useRef<BottomSheetModalMethods>(null);
  const bottomSheetModalBRef = useRef<BottomSheetModalMethods>(null);
  const bottomSheetModalCRef = useRef<BottomSheetModalMethods>(null);
  const bottomSheetModalWithKeyboardRef = useRef<BottomSheetModalMethods>(null);

  // State
  const [isVisible, setIsVisible] = useState(false);

  // Hooks
  const { theme } = useTheme();
  const { dismiss, dismissAll } = useBottomSheetModal();

  // Callbacks
  const handlePresentAPress = useCallback(() => {
    if (bottomSheetModalARef.current) {
      bottomSheetModalARef.current.present();
    }
  }, []);
  const handlePresentBPress = useCallback(() => {
    if (bottomSheetModalBRef.current) {
      bottomSheetModalBRef.current.present();
    }
  }, []);
  const handlePresentCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.present();
    }
  }, []);
  const handleDismissCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.dismiss();
    }
  }, []);
  const handlePresentWithKeyboardPress = useCallback(() => {
    if (bottomSheetModalWithKeyboardRef.current) {
      bottomSheetModalWithKeyboardRef.current.present();
    }
  }, []);
  const handleDismissAllPress = useCallback(() => {
    dismissAll();
  }, [dismissAll]);

  const handleDismissByHookPress = useCallback(() => {
    dismiss('A');
  }, [dismiss]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBottomSheetContent = useCallback(
    (type = 'FlatList', onPress) => (
      <ContactList type={type} onItemPress={onPress} />
    ),
    []
  );
  const renderSearchContent = useCallback(
    () => (
      <QuickView paddingHorizontal={20} paddingTop={10}>
        <Indicator style={{ marginBottom: 10 }} />
        <Input tPlaceholder="field:username" InputComponent={BottomSheetTextInput as any} />
      </QuickView>
    ),
    []
  );

  // UseEffect
  useEffect(() => {
    Global.bottomSheet.props = {
      name: 'FlatList',
      title: 'FlatList',
      snapPoints: ['25%', '75%'],
      headerProps: { onPressCloseIcon: Global.bottomSheet.close },
      children: renderBottomSheetContent('FlatList', () => {
        Global.bottomSheet.props = {
          title: 'SectionList',
          snapPoints: ['90%'],
          children: renderBottomSheetContent('SectionList', null),
          headerProps: { onPressCloseIcon: Global.bottomSheet.close }
        };
        Global.bottomSheet.present();
      })
    };
  }, []);

  // Dynamic Snap points
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBottomSheetView = useCallback(
    () => (
      <BottomSheetView
        style={{
          paddingTop: 12,
          paddingBottom: 6,
          paddingHorizontal: 24,
        }}
        onLayout={handleContentLayout}
      >
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          marginBottom: 12,
          textAlign: 'center'
        }}
        >
          This sheet can resize to its content height
        </Text>
        <QuickView style={{
          overflow: 'hidden',
          justifyContent: 'center',
          height: 300,
        }}
        >
          <Text style={{
            fontSize: 156,
            textAlign: 'center',
            alignSelf: 'center',
          }}
          >
            😍
          </Text>
        </QuickView>
      </BottomSheetView>
    ),
    []
  );

  const handlePresentDynamicModalPress = () => {
    Global.bottomSheet.props = {
      key: 'DynamicSnapPoints', // Need for Refresh bottom sheet
      name: 'DynamicSnapPoints',
      title: 'Dynamic Snap Points',
      snapPoints: animatedSnapPoints,
      handleHeight: animatedHandleHeight,
      contentHeight: animatedContentHeight,
      headerProps: { onPressCloseIcon: Global.bottomSheet.close },
      children: renderBottomSheetView(),
    };
    Global.bottomSheet.present();
  };

  const handlePresentStackModalPress = () => {
    Global.bottomSheet.props = {
      key: 'StackBottomSheet', // Need for Refresh bottom sheet
      name: 'StackBottomSheet',
      snapPoints: ['25%', '50%', '90%'],
      enablePanDownToClose: true,
      children: <Navigator />,
    };
    Global.bottomSheet.present();
  };
  // Variables
  // const data = useMemo(() => {
  //   const items: any = [];
  //   [50].map((i) => Array(i).fill(i).map(
  //     (item: any, index: number) => (items.push(`Hi 👋 ${index} !`))
  //   ));
  //   return items;
  // }, []);

  return (
    <>
      <Header customType="example" title="Modal" shadow={false} />
      <Body scrollable fullView>
        <Section title="Basic Modal">
          <Button title="Native Modal" onPress={() => setIsVisible(!isVisible)} />
          <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
          >
            <Button title="Native Modal" onPress={() => setIsVisible(!isVisible)} />
          </Modal>
          <ModalButton
            ref={customChildrenRef}
            title="Modal Button with custom Children"
          >
            <QuickView
              backgroundColor={theme.colors.white}
              borderRadius={10}
              padding={30}
              center
            >
              <Text center>Hi 👋!</Text>
              <Button
                title="Close"
                marginTop={20}
                width={100}
                onPress={() => customChildrenRef.current.close()}
              />
            </QuickView>
          </ModalButton>
          <ModalButton
            title="Notification Modal Button"
            modalProps={{
              title: 'Successful 🚀',
              onOkButtonPress: () => console.log('Successful')
            }}
          />
          <ModalButton
            title="Confirmation Modal Button"
            modalProps={{
              title: i18next.t('auth:login'),
              type: 'confirmation',
              onOkButtonPress: () => console.log('Confirm')
            }}
          />
          <ModalButton
            title="Bottom-Half Modal"
            modalProps={{ type: 'bottom-half' }}
          >
            <SafeAreaView style={{ backgroundColor: theme.colors.grey5 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  maxHeight: 300,
                  marginTop: 20,
                  backgroundColor: theme.colors.grey5
                }}
              >
                {
                  [20].map((i) => Array(i).fill(i).map(
                    (item: any, index: number) => <Text key={index.toString()} center>Hi 👋!</Text>
                  ))
                }
              </ScrollView>
            </SafeAreaView>
          </ModalButton>
          <ModalButton
            title="Full Screen Modal"
            modalProps={{ type: 'fullscreen' }}
          >
            <>
              <Header backIcon title="ExampleScreen" />
              <Body>
                <QuickView>
                  <Text center>Example Screen</Text>
                </QuickView>
              </Body>
            </>
          </ModalButton>
          <ModalButton
            ref={customBackdropRef}
            title="No Backdrop"
            modalProps={{
              title: i18next.t('auth:login'),
              type: 'confirmation',
              onOkButtonPress: () => console.log('Confirm'),
              hasBackdrop: false,
            }}
          />
          <ModalButton
            ref={customBackdropRef}
            title="Custom Backdrop Modal"
            modalProps={{
              title: i18next.t('auth:login'),
              type: 'confirmation',
              onOkButtonPress: () => console.log('Confirm'),
              customBackdrop: <QuickView backgroundColor="orange" height="100%" onPress={() => customBackdropRef.current.close()} />,
            }}
          />
          <ModalButton
            ref={fancyModalRef}
            title="Fancy Modal"
            modalProps={{
              title: i18next.t('auth:login'),
              type: 'confirmation',
              onOkButtonPress: () => console.log('Confirm'),
              backdropColor: '#B4B3DB',
              backdropOpacity: 0.8,
              animationIn: 'zoomInDown',
              animationOut: 'zoomOutUp',
              animationInTiming: 600,
              animationOutTiming: 600,
              backdropTransitionInTiming: 600,
              backdropTransitionOutTiming: 600,
              swipeDirection: ['up', 'left', 'right', 'down'],
              onSwipeComplete: () => fancyModalRef.current.close()
            }}
          />
        </Section>
        <Section title="Global Bottom Sheet">
          <Button
            title="Present Global Modal"
            onPress={() => {
              Global.bottomSheet.present();
            }}
          />
          <Button
            title="Dismiss Global Modal"
            onPress={() => {
              Global.bottomSheet.close();
            }}
          />
          <Button title="Present Dynamic Modal" onPress={handlePresentDynamicModalPress} />
          <Button title="Present Stack Modal" onPress={handlePresentStackModalPress} />
        </Section>
        <Section title="Screen Bottom Sheet">
          <Button title="Present Modal A" onPress={handlePresentAPress} />
          <Button title="Dismiss All Modal" onPress={handleDismissAllPress} />
          <Button title="Dismiss A By Hook" onPress={handleDismissByHookPress} />
          <Button title="Present Modal WithKeyboard " onPress={handlePresentWithKeyboardPress} />
        </Section>

        <>
          <BottomSheet
            name="FlatList"
            title="FlatList"
            ref={bottomSheetModalARef}
            useBottomSheetModal
            useBackdrop={false}
            onChange={handleSheetChanges}
            children={renderBottomSheetContent('FlatList', handlePresentBPress)}
            useAnimatedIndicator
          />
          <BottomSheet
            name="ScrollView"
            // title="ScrollView"
            ref={bottomSheetModalBRef}
            children={renderBottomSheetContent('ScrollView', handlePresentCPress)}
            useBottomSheetModal
            backdropPressBehavior="close"
          />
          <BottomSheet
            name="SectionList"
            title="SectionList"
            ref={bottomSheetModalCRef}
            index={1}
            useBottomSheetModal
            children={renderBottomSheetContent('SectionList', handleDismissCPress)}
          />
          <BottomSheet
            ref={bottomSheetModalWithKeyboardRef}
            snapPoints={[100, '80%']}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            useBottomSheetModal
            handleComponent={renderSearchContent}
          >
            <ContactList count={12} type="FlatList" />
          </BottomSheet>
        </>

      </Body>
    </>
  );
};

export default withModalProvider(ModalExample);
