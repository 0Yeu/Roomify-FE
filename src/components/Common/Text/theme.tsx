import AppView from '@utils/appView';
import { TextProps } from '.';

export default {
  h1Style: {
    fontSize: 26,
    fontWeight: 'bold'
  },
  h2Style: {
    fontSize: 22
  },
  h3Style: {
    fontSize: 18
  },
  subtitleStyle: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '200'
  },
  fontFamily: AppView.fontFamily
} as TextProps;
