import AppView from '@utils/appView';
import { CustomType, PickerProps } from '.';

export default {
  // Type
  customType: {
    input: {
      backgroundColor: 'Color:grey3',
      placeholderTextColor: 'Color:grey5',
      iconColor: 'Color:grey5',
      titleColor: 'Color:black',
      marginBottom: 10,
      fontSize: 18
    }
  },
  // Default Props
  borderRadius: AppView.roundedBorderRadius,
  mode: 'dialog',
  rounded: true,
  pickerType: 'default',
  values: [],
  width: '100%'
} as Omit<PickerProps, 'customType'> & { customType: CustomType };
