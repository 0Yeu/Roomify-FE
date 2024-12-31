import React from 'react';
import _ from 'lodash';
import { TError } from '@utils/appHelper';
import { useTranslation } from 'react-i18next';
import Text, { TextProps } from '@components/Common/Text';
import QuickView from '@components/Common/View/QuickView';

export interface ErrorTextProps extends Omit<TextProps, 'error'> {
  error?: null | TError | string ;
}

function ErrorText(props: ErrorTextProps) {
  const { t } = useTranslation();
  const { error, ...otherProps } = props;

  const renderSingleMessage = (message?: string, index: number = 0) => (
    <Text
      key={index.toString()}
      error
      center
      marginVertical={2}
      {...otherProps}
    >
      {message === 'undefined' ? t('exception:500') : message}
    </Text>
  );

  const renderMessages = () => {
    if (error) {
      if (typeof error === 'string') {
        return renderSingleMessage(error);
      }
      return error?.messages.map((message, index) => renderSingleMessage(message, index));
    }
    return null;
  };

  if (error && (typeof error === 'string' || !_.isUndefined(_.head(error.messages)))) {
    return <QuickView marginVertical={5}>{renderMessages()}</QuickView>;
  }
  return null;
}

ErrorText.defaultProps = {
  marginTop: 5,
  marginBottom: 5,
};

export default ErrorText;
