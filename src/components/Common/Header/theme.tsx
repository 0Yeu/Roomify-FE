import colors from '@themes/Color/colors';
import AppView from '@utils/appView';
import { NavigationService } from '@utils/navigation';
import { HeaderProps, CustomType } from '.';

export default {
  // Type
  customType: {
    example: {
      leftComponent: {
        icon: 'menu',
        color: '#fff',
        onPress: () => NavigationService.openDrawer(),
      },
      switchTheme: true,
    },
    bottomSheet: {
      transparent: true,
      color: 'Color:black',
      disableSafeArea: true,
      shadow: false,
      containerStyle: {
        borderTopLeftRadius: AppView.bottomSheetBorderRadius,
        borderTopRightRadius: AppView.bottomSheetBorderRadius,
      },
    }
  },
  // Default Props
  centerComponent: {
    style: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: 'bold',
    }
  },
  leftColor: colors.primary,
  shadow: false,
  placement: 'center',
  leftIconBackgroundColor: 'transparent',
  width: '100%',
  fontFamily: AppView.fontFamily,
  backgroundColor: 'transparent'
} as Omit<HeaderProps, 'customType'> & { customType: CustomType };
