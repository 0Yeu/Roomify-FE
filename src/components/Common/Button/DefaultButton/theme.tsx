import { logout } from '@containers/Auth/components/Login/redux/slice';
import { Global } from '@utils/appHelper';
import AppView from '@utils/appView';
import { ButtonProps, CustomType } from '.';

export default {
  // Type
  customType: {
    active: {
      color: 'blue',
      bold: true
    },
    goToExample: {
      title: 'Go to Example',
      onPress: () => {},
    },
    input: {
      backgroundColor: 'Color:grey3',
      titleColor: 'Color:grey5',
      titlePosition: 'left',
      marginBottom: 10,
      fontSize: 18,
    },
    logout: {
      tTitle: 'auth:logout',
      onPress: () => {
        Global.dispatch(logout());
      },
      borderRadius: 30,
      width: 150,
      outline: true,
      marginVertical: 20
    },
  },
  // Default Props
  centerComponent: {
    style: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
    }
  },
  borderRadius: AppView.roundedBorderRadius,
  rounded: true,
  titlePosition: 'center',
  titlePaddingHorizontal: AppView.titlePaddingHorizontal,
  titlePaddingVertical: AppView.titlePaddingVertical,
  marginVertical: 5,
  fontFamily: AppView.fontFamily
} as Omit<ButtonProps, 'customType'> & { customType: CustomType };
