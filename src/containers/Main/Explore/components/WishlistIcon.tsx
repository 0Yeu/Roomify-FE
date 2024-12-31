import React, { useEffect, useState } from 'react';
import {
  QuickView, Text, Header, Body, Icon,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import colors from '@themes/Color/colors';
import IconSource from '@icons';
import Api from '@utils/api';
import { DeviceEventEmitter } from 'react-native';
import { EVENT_APP_EMIT } from '@utils/constant';

interface Props {
  id: number;
  active: boolean;
}

const WishlistIcon: React.FC<Props> = (props: Props) => {
  const { id, active: activeProps } = props;

  const [active, setActive] = useState(activeProps);

  useEffect(() => {
    setActive(activeProps);
  }, [activeProps]);

  const handleOnPressHeart = async () => {
    if (id) {
      try {
        const data = {
          propertyId: id,
        };
        await Api.post('/favorite-property', data);
        setActive(!active);
        DeviceEventEmitter.emit(EVENT_APP_EMIT.RELOAD_SAVED);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  return (
  // <TouchableOpacity onPress={() => this.onPress()}>
    <QuickView
      onPress={handleOnPressHeart}
      borderRadius={20}
      width={40}
      height={40}
      backgroundColor="rgba(255, 255, 255, 0.7)"
      verticalCenter
      horizontalCenter
      // center
    >
      {active ? <IconSource.HeartFillIcon /> : <IconSource.HeartOutlineIcon />}
      {/* <Icon
        type="entypo"
            // name={active ? 'heart' : 'heart-outlined'}
        name="heart-outlined"
        color="#D36363"
        size={24}
      /> */}
      {/* <Text marginLeft={5} fontSize={14} bold={active}>
            Yêu thích
          </Text> */}
    </QuickView>
  // </TouchableOpacity>
  );
};

export default WishlistIcon;
