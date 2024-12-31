import { IconProps, CustomType } from '.';

export default {
  customType: {
    goToExample: {
      name: 'home',
      // onPress: () => NavigationService.navigate(exampleStack.exampleList),
    },
  },
  // Default Props
  name: 'home'
} as Omit<IconProps, 'customType'> & { customType: CustomType };
