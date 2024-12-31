import React from 'react';
import {
  Body,
  Loading,
  withDetail,
  Text,
  Header,
} from '@components';
import { WithDetailProps } from '@utils/hocHelper';
import { Image } from 'react-native-elements';
import AppView from '@utils/appView';
import I18n from 'i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CONSTANT, getProductDetail } from '../redux/slice';

interface Props extends WithDetailProps {}

const ProductDetail: React.FC<Props> = (props) => {
  const { loading, data } = props;
  return (
    <>
      <Header backIcon title="ProductDetail" />
      <Body scrollable>
        <Text marginVertical={10} h1 center>{I18n.t('key') === 'en' ? data.enTitle : data.viTitle}</Text>
        <Image
          source={{
            uri: data.thumbnail,
          }}
          style={{
            width: AppView.bodyWidth,
            height: AppView.bodyWidth,
            borderRadius: AppView.roundedBorderRadius
          }}
        />
        {
        loading ? <Loading />
          : <Text marginVertical={10}>{I18n.t('key') === 'en' ? data.enDescription : data.viDescription}</Text>
        }
      </Body>
    </>
  );
};

export default withDetail({
  url: '/posts/:id',

  /** Use redux */
  // redux: {
  //   dispatch: getProductDetail,
  //   constant: {
  //     NAME: CONSTANT.NAME,
  //     KEY: CONSTANT.DETAIL
  //   },
  // }
})(ProductDetail);
