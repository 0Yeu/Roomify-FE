/* eslint-disable max-classes-per-file */
import * as React from 'react';
import { StackActions, DrawerActions } from '@react-navigation/native';
import { Easing } from 'react-native';

/**
 * NavigationService
 */

class CNavigationService {
  private static _instance: CNavigationService;

  private constructor() {
    // ...
  }

  navigationRef: any = React.createRef();

  public static get Instance(): CNavigationService {
    if (!this._instance) {
      this._instance = new this();
    }
    return CNavigationService._instance;
  }

  navigate(stack: string, data?: object | { screen: string, params?: any } | string | number) {
    return this.navigationRef.current?.navigate(stack, data);
  }

  getCurrentRoute() {
    return this.navigationRef.current?.getCurrentRoute();
  }

  canGoBack() {
    return this.navigationRef.current?.canGoBack();
  }

  getRootState() {
    return this.navigationRef.current?.getRootState();
  }

  goBack() {
    return this.navigationRef.current?.goBack();
  }

  push(stack: string, screen?: any) {
    return this.navigationRef.current?.dispatch(StackActions.push(stack, screen));
  }

  pop(count: number = 1) {
    return this.navigationRef.current?.dispatch(StackActions.pop(count));
  }

  popToTop() {
    return this.navigationRef.current?.dispatch(StackActions.popToTop());
  }

  openDrawer() {
    return this.navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
  }
}
export const NavigationService = CNavigationService.Instance;

/**
 * Animation
 */
const forFade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const config = {
  animation: 'timing',
  config: {
    duration: 500,
    easing: Easing.circle,
  },
};

const transitionSpecConfig: any = {
  open: config,
  close: config,
};

class CNavigationAnimation {
  private static _instance: CNavigationAnimation;

  private constructor() {
    // ...
  }

  public static get Instance(): CNavigationAnimation {
    if (!this._instance) {
      this._instance = new this();
    }
    return CNavigationAnimation._instance;
  }

  fade = {
    cardStyleInterpolator: forFade,
    transitionSpec: transitionSpecConfig,
  };
}
export const NavigationAnimation = CNavigationAnimation.Instance;
