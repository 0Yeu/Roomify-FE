/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from 'react-native-elements';

const BlurredBackground = () => {
  const { theme } = useTheme();
  const blurType = theme.colors.themeMode === 'light' ? 'chromeMaterial' : 'chromeMaterialDark';
  return (
    <View style={styles.container}>
      <BlurView blurType={blurType} style={styles.blurView} />
    </View>
  );
};

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
});

export default BlurredBackground;
