/* eslint-disable react/destructuring-assignment */
import QuickView from '@components/Common/View/QuickView';
import AppView from '@utils/appView';
import React from 'react';
import * as Progress from 'react-native-progress';
import { ImageProps, CustomType } from '.';

const LoadingView = (props: { children: React.ReactElement }) => (
  <QuickView
    center
    position="absolute"
    // backgroundColor="rgba(12, 12, 13, 0.7)"
    padding={15}
    borderRadius={AppView.roundedBorderRadius}
  >
    {props.children}
  </QuickView>
);

export default {
  // Type
  customType: {
    circleLoading: {
      renderProgress: ({ progress, indeterminate, loadingColor, loadingSize, width }) => (
        <LoadingView>
          <Progress.Circle
            showsText
            progress={progress}
            indeterminate={indeterminate}
            textStyle={{ fontWeight: 'bold', fontSize: 16 }}
            color={loadingColor}
            size={loadingSize || width / 5 < 55 ? 55 : width / 5}
          />
        </LoadingView>
      ),
      disablePlaceholder: true
    },
    barLoading: {
      renderProgress: ({ progress, indeterminate, loadingColor, width }) => (
        <Progress.Bar
          progress={progress}
          width={width}
          indeterminate={indeterminate}
          style={{
            top: 0,
            position: 'absolute',
            zIndex: 1,
          }}
          color={loadingColor}
        />
      )
    },
    pieLoading: {
      renderProgress: ({ progress, indeterminate, loadingColor, loadingSize, width }) => (
        <LoadingView>
          <Progress.Pie
            progress={progress}
            indeterminate={indeterminate}
            color={loadingColor}
            size={loadingSize || width / 5 < 55 ? 55 : width / 5}
          />
        </LoadingView>
      ),
      disablePlaceholder: true
    }
  },
  // Default Props

} as Omit<ImageProps, 'customType'> & { customType: CustomType };
