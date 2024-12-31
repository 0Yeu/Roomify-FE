import { Platform } from 'react-native';
import { CustomType, DateTimePickerProps } from '.';

export default {
  // Type
  customType: {
    input: {
      backgroundColor: 'Color:grey3',
      placeholderTextColor: 'Color:grey5',
      titleColor: 'Color:black',
      titlePosition: 'left',
      marginBottom: 10,
      fontSize: 18
    }
  },
  // Default Props
  mode: 'date',
  display: Platform.OS === 'ios' ? 'compact' : 'default',
  marginVertical: 5,
  titlePosition: 'center',
} as Omit<DateTimePickerProps, 'customType'> & { customType: CustomType };
