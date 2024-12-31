import { InputProps, CustomType } from '.';

export default {
  // Type
  customType: {

  },
  autoCapitalize: 'none',
  backgroundColor: 'Color:grey3',
  labelColor: 'Color:grey6',
  placeholderTextColor: 'Color:grey5',
  borderColor: 'Color:grey5'
} as Omit<InputProps, 'customType'> & { customType: CustomType };
