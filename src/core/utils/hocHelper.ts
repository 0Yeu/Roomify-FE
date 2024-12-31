/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import { FlatList } from 'react-native';
import React from 'react';
import _ from 'lodash';
import { AndroidPermission, IOSPermission } from 'react-native-permissions';
import Analytics, { TLogEvent } from '@core/plugin/analytics';
import { FlatListProps } from '@components/Common/FlatList/DefaultFlatList';
// import { InputProps } from '@components/Common/Input/DefaultInput';
// import { ButtonProps } from '@components/Common/Button/DefaultButton';
import AppHelper, { IBase } from './appHelper';
import Filter from './filter';
import { TQuery } from './server';

/**
 * Type
 */

/**
 * HOC
 */
export interface IExtraItem {
  key: string;
  url: string;
}

export interface IReduxExtraItem {
  key: string;
  dispatch: any,
  constant: {
    NAME: string,
    KEY: string,
  },
}

export interface ILocalExtraItem {
  key: string;
  table: string;
  refFields?: string[];
}

interface IHocConstant {
  NAME: string,
  KEY: string,
}

export interface WithRedux {
  dispatch: any;
  constant: IHocConstant;
}

export interface IHocPermission {
  ios?: IOSPermission,
  android?: AndroidPermission,
  deniedMessage?: string,
  tDeniedMessage?: string | Array<any>,
}

export interface IHocLog {
  name: TLogEvent,
  payload?: {
    key?: string,
    fields?: Array<string>,
  }
  extraPayload?: any,
}

export interface IHocFlatListProps extends Omit<FlatListProps, 'renderItem' | 'data' > {
  key?: string;
  renderItem?: (data: any, renderItemProps?:any) => any;
  renderItemProps?: any;
}

export interface IHocFormProps {
  renderHeader?: (renderCallBackMessage?: () => any) => any;
  renderFooter?: (renderSubmitButton?: () => any) => any;
  onSubmitSuccess?: (data?: any) => any;
}

export interface WithListProps extends IBase {
  getFlatList: () => FlatList<any>;
  filter: Filter,
  refresh: () => any;
  setUrl: (newUrl: string, key?: string) => any;
  renderFlatList: (flatListProps?: IHocFlatListProps) => any;
  refetch: (key?: string) => any;
  setData: (data: any, key?: string) => any;
  setMetadata: (metadata: {
    count?: number,
    total?: number,
    page?: number,
    pageCount?: number,
  }) => any;
  getList: (query?: TQuery) => Promise<any>;
  setModifyData: (fn: (data: any) => any, key?: string) => any; // Modify Data which is fetched from API or LocalDB
  setLocalQuery: (fn: (localQuery: any) => any) => any;
}

export interface WithDetailProps extends IBase {
  setUrl: (newUrl: string, key?: string) => any;
  setData: (data: any, key?: string) => any;
  refetch: (silent?: boolean, key?: string) => any;
  setModifyData: (data: any, key?: string) => any; // Modify Data which is fetched from API or LocalDB
}

export interface WithBottomSheetProps {
  open: () => any;
  close: () => any;
  setModalContent: (content: React.ReactElement) => any;
  setIndicatorBackgroundColor: (color: string) => any;
}

class CHocHelper {
  private static _instance: CHocHelper;

  private constructor() {
    // ...
  }

  public static get Instance(): CHocHelper {
    if (!this._instance) {
      this._instance = new this();
    }
    return CHocHelper._instance;
  }

  mergeStateForExtraData = (state: any, extraData?: IExtraItem[] | ILocalExtraItem[]) => {
    if (extraData && !_.isEmpty(extraData)) {
      extraData.forEach((item: IExtraItem | ILocalExtraItem) => {
        state[item.key] = {
          loading: true,
          data: {},
          error: null,
        };
      });
    }
  };

  triggerActionForReduxExtraData = async (thisProps: any, reduxExtraData?: IReduxExtraItem[]) => {
    if (reduxExtraData && !_.isEmpty(reduxExtraData)) {
      await Promise.all(reduxExtraData.map(async (item: IReduxExtraItem) => {
        thisProps[`getDetail${item.key}`](AppHelper.getItemFromParams(thisProps));
      }));
    }
  };

  mapStateForReduxExtraData = (result: any, state: any, reduxExtraData?: IReduxExtraItem[]) => {
    let newResult = result;
    if (reduxExtraData && !_.isEmpty(reduxExtraData)) {
      reduxExtraData.forEach((item: IReduxExtraItem) => {
        const root = state[item.constant.NAME][item.constant.KEY];
        newResult = {
          ...newResult,
          [item.key]: {
            loading: root?.loading,
            data: root?.data,
            error: root?.error,
          },
        };
      });
    }
    return newResult;
  };

  mapDispatchForReduxExtraData = (result: any, dispatch: any, reduxExtraData?: IReduxExtraItem[]) => {
    let newResult = result;
    if (reduxExtraData && !_.isEmpty(reduxExtraData)) {
      reduxExtraData.forEach((reduxExtraItem: IReduxExtraItem) => {
        newResult = {
          ...newResult,
          [`getDetail${reduxExtraItem.key}`]: (item: any) => dispatch(reduxExtraItem.dispatch(item)),
        };
      });
    }
    return newResult;
  };

  logScreenEvent = async (log: IHocLog, dataSource: any) => {
    let payload = log.extraPayload || {};
    if (log.payload) {
      const { key, fields } = log.payload;
      const screenData = key ? dataSource[key]?.data : dataSource.data;
      if (screenData) {
        if (_.isObject(screenData) && !_.isEmpty(screenData)) {
          if (fields) {
            payload = { ...payload, ..._.pick(screenData, fields) };
          } else {
            payload = { ...payload, ...screenData };
          }
        } else payload = { ...payload, screenData };
      }
    }
    await Analytics.log(log.name, payload);
  };
}

const HocHelper = CHocHelper.Instance;
export default HocHelper;
