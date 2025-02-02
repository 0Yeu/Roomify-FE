package com.demo.vlrnbase;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen; // react-native-splash-screen

public class MainActivity extends ReactActivity {
  // SplashScreen
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, R.style.SplashScreenTheme);
      super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "VLRNBase";
  }
}
