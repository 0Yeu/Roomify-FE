import { FormProps, CustomType } from '.';

export default {
  customType: {

  },
  // Default Props
} as Omit<FormProps, 'customType'> & { customType: CustomType };
