/* eslint-disable react/prop-types */
import React from 'react';
import {
  AccessoryProps,
  Avatar as ElementAvatar,
  AvatarProps as ElementAvatarProps,
} from 'react-native-elements';
import ComponentHelper, { IComponentBase } from '@utils/component';

interface AvatarProps extends ElementAvatarProps, IComponentBase {
  backgroundColor?: string;
  accessory?: AccessoryProps;
}

const Avatar = (initialProps: AvatarProps) => {
  const props = ComponentHelper.getProps<AvatarProps>({
    initialProps,
    keys: ['backgroundColor', 'containerStyle', 'accessory']
  });
  ComponentHelper.handleCommonProps(props);

  return (
    <ElementAvatar
      {...props.otherProps}
      containerStyle={props.containerStyle}
    >
      {props.accessory && <ElementAvatar.Accessory {...props.accessory} />}
    </ElementAvatar>
  );
};

export default Avatar;
