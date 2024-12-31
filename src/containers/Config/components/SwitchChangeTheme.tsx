import React from 'react';
import { switchTheme } from '@src/containers/Config/redux/slice';
import { Switch } from 'react-native';
import { useAppDispatch } from '@utils/redux';
import { useTheme } from 'react-native-elements';

const SwitchChangeTheme: React.FunctionComponent = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const isEnabled = theme.colors.themeMode === 'dark';

  return (
    <Switch
      // trackColor={{ false: '#767577', true: '#81b0ff' }}
      // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
      // ios_backgroundColor="#3e3e3e"
      onValueChange={() => { dispatch(switchTheme()); }}
      value={isEnabled}
    />
  );
};

export default SwitchChangeTheme;
