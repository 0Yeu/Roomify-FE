import React, { FC } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const withModalProvider = (Component: FC<any>) => (props: any) => (
  <BottomSheetModalProvider>
    <Component {...props} />
  </BottomSheetModalProvider>
);

export default withModalProvider;
