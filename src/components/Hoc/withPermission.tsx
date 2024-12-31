/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import _ from 'lodash';
import { Platform } from 'react-native';
import RNPermissions, { Permission } from 'react-native-permissions';
import Helper from '@utils/helper';
import i18next from 'i18next';
import { IHocPermission } from '@utils/hocHelper';
import ModalButton from '@components/Common/Button/ModalButton';
import { connect } from 'react-redux';

export interface WithPermissionProps {
  forwardedRef?: any;
}

const withPermission = (
  permissions: IHocPermission[],
  withRef: boolean = true,
) => <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const PERMISSIONS_VALUES: Permission[] = Helper.selectFields(permissions, Platform.OS);

  class WithPermission extends React.Component<P & WithPermissionProps, any> {
    requestPermission = async (index: number = 0) => {
      const permission = PERMISSIONS_VALUES[index];
      if (permission) {
        const thisAny: any = this;
        const status = await RNPermissions.check(permission);

        switch (status) {
          case 'denied':
            try {
              const request = await RNPermissions.request(permission);
              if (request === 'blocked') {
                thisAny[`permission${index}`].open();
              }
              return false;
            } catch (error) {
              return false;
            }
          case 'blocked':
            thisAny[`permission${index}`].open();
            return false;
          case 'granted':
            return true;
          default:
            return false;
        }
      }
      return null;
    };

    renderModalButton = () => permissions.map((permission: IHocPermission, index: number) => {
      let title = '';
      if (!permission.deniedMessage && permission.tDeniedMessage) {
        if (typeof permission.tDeniedMessage === 'string') {
          title = i18next.t(permission.tDeniedMessage);
        }
        title = i18next.t(permission.tDeniedMessage[0], permission.tDeniedMessage[1]);
      }
      return (
        <ModalButton
          key={`withPermission_${index.toString()}`}
          ref={(ref: any) => {
            // @ts-ignore
            this[`permission${index}`] = ref;
          }}
          modalProps={{
            title,
            okTitle: i18next.t('permission_denied:go_to_settings'),
            type: 'confirmation',
            onOkButtonPress: () => RNPermissions.openSettings()
          }}
          invisible
        />
      );
    });

    render() {
      const { forwardedRef, ...otherProps } = this.props;
      // @ts-ignore
      if (withRef) otherProps.ref = forwardedRef; else otherProps.forwardedRef = forwardedRef;
      return (
        <>
          <WrappedComponent
            {...otherProps as P}
            {...this.state}
            requestPermission={this.requestPermission}
          />
          {this.renderModalButton()}
        </>
      );
    }
  }

  const customMapStateToProps = (state: any) => ({
    language: state.config.language
  });

  const WithPermissionRedux = connect(
    customMapStateToProps,
    null,
    null,
    { forwardRef: true },
  )(WithPermission as any);

  return React.forwardRef((props: P & WithPermissionProps, ref) => (
    <WithPermissionRedux {...props} forwardedRef={ref} />
  ));
};

export default withPermission;
