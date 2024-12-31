/* eslint-disable import/no-cycle */
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { Image } from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import i18next from 'i18next';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { showMessage } from 'react-native-flash-message';
import { LocaleConfig } from 'react-native-calendars';
import { Database } from '@nozbe/watermelondb';
import { Theme } from 'react-native-elements';
import { BottomSheetProps } from '@components/Common/BottomSheet';
import { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export type TMetadata = {
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

export type TError = {
  code: number;
  messages: Array<string>;
};

export type TObject = {
  loading: boolean;
  data: any;
  error: null | TError;
};

export type TArray = {
  loading: boolean;
  data: any;
  metadata: any;
  error: null | TError;
  filter: any;
};

export interface IBase {
  loading: boolean;
  data: any;
  metadata?: TMetadata;
  error: TError | null;
  theme: Theme;
  t: any;
}
interface IDeviceInfo {
  uniqueId: string;
  deviceId: string;
  systemName: string;
  systemVersion: string;
  isTablet: boolean;
  brand: string;
  model: string;
  buildNumber: number;
  buildVersion: string;
  manufacturer: string;
}

interface IGlobal {
  // eslint-disable-next-line max-len
  dispatch: ThunkDispatch<any, null, AnyAction> & ThunkDispatch<any, undefined, AnyAction> & Dispatch<any>;
  perPage: number;
  token: string;
  fcmToken: string;
  modal: { name: TModalName, content: React.ReactNode }[];
  deviceInfo: IDeviceInfo;
  database: Database;
  fn: {
    setBackgroundColor: (color: string) => any;
  },
  bottomSheet: {
    ref: any,
    props: BottomSheetProps,
    present: () => any,
    close: () => any,
  }
}
const globalAny: any = global;
export const Global: IGlobal = globalAny;

export interface IImage {
  name: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  sourceUrl?: string;
  remoteUrl?: string;
  resizedImageUrl?: {
    origin: string,
    medium: string,
    thumbnail: string
  };
}

export interface IResizedImage {
  origin: IImage;
  medium: IImage;
  thumbnail: IImage;
}

export interface IFile {
  name: string;
  mime: string;
  size?: string;
  path?: string;
  sourceUrl?: string;
  remoteUrl?: string;
  updatedAt?: Date;
}

type TModalName = 'default';

export class CAppHelper {
  private static _instance: CAppHelper;

  private constructor() {
    // ...
  }

  public static get Instance(): CAppHelper {
    if (!this._instance) {
      this._instance = new this();
    }
    return CAppHelper._instance;
  }

  isConnected = true;

  viewAsyncStorageData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const itemsArray = await AsyncStorage.multiGet(keys);
    const result: any = {};
    itemsArray.map((item) => {
    // eslint-disable-next-line prefer-destructuring
      result[`${item[0]}`] = item[1];
      return result;
    });
    return result;
  };

  getParams = (props: any) => {
    const {
      route,
    } = props;
    return route?.params;
  };

  getItemFromParams = (props: any) => {
    const {
      route,
    } = props;
    return route?.params?.item;
  };

  setItemIntoParams = (item: any) => ({ item });

  focusNextField = (component: any, name: string) => {
    component[name]?.focus();
  };

  getIdFromParams = (props: any) => {
    const {
      route,
    } = props;
    return route?.params?.item?.id || route?.params?.id;
  };

  setIdIntoParams = (item: any) => ({ item: { id: item.id } });

  setModalIntoGlobal = (props: { name?: TModalName, content: React.ReactNode }): string => {
    const { name, content } = props;
    const data = { name: '' as any, content };
    if (!name) data.name = new Date().valueOf().toString();
    else data.name = name;

    if (!Global.modal) {
      Global.modal = [];
      Global.modal.push(data);
    } else {
      const index = _.findIndex(Global.modal, (o: any) => o?.name === name);
      if (index === -1) {
        Global.modal.push(data);
      } else {
        Global.modal[index].content = props.content;
      }
    }
    return data.name;
  };

  getModalFromGlobal = (name: TModalName) => {
    if (!Global.modal) return null;
    return _.find(Global.modal, (o) => o.name === name);
  };

  // eslint-disable-next-line max-len
  resize = async (image: Image, resizedWidth: number = 500, resizedHeight?: number): Promise<IImage> => {
    const uri = image.path;
    let imageFormat: any = 'JPEG';
    switch (uri.split('.').pop()) {
      case 'png':
      case 'PNG':
        imageFormat = 'PNG';
        break;
      case 'webp':
      case 'WEBP':
        imageFormat = 'WEBP';
        break;
      default:
        imageFormat = 'JPEG';
        break;
    }
    const height: number = resizedHeight || (image.height / image.width) * resizedWidth;
    const data = await ImageResizer.createResizedImage(
      uri, resizedWidth, height, imageFormat, 95
    );

    return {
      name: data.name,
      mime: image.mime,
      width: data.width,
      height: data.height,
      size: data.size,
      path: data.path,
      sourceUrl: image.sourceURL
    };
  };

  handleException = (error: any): TError => {
    const messages = [] as string[];
    console.log('error.message :>> ', error.message);
    if (error.message) {
      if (Array.isArray(error.message)) {
        error.message.forEach((e: any) => {
          messages.push(e);
        });
      } else {
        messages.push(error.message);
      }
    } else {
      messages.push(i18next.t(`exception:${error.statusCode}`));
    }

    return {
      code: error.statusCode,
      messages,
    };
  };

  /**
   * showMessage
   */
  showNoConnectionMessage = () => {
    // showMessage({
    //   message: i18next.t('no_internet'),
    //   type: 'danger',
    // });
  };

  showNotificationMessage = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    if (remoteMessage.notification) {
      showMessage({
        message: remoteMessage.notification.title || '',
        description: remoteMessage.notification.body,
        backgroundColor: '#315DF7',
        icon: 'info',
        duration: 5000,
        hideStatusBar: true,
        titleStyle: { fontWeight: 'bold', fontSize: 15 },
        onPress: () => {
          // eslint-disable-next-line no-console
          console.log('Message Click');
        },
      });
    }
  };

  getDaySession = () => {
    const currentHour = moment(new Date()).hour();
    if (currentHour >= 0 && currentHour <= 12) {
      return 'morning';
    } if (currentHour > 12 && currentHour <= 18) {
      return 'afternoon';
    }
    return 'evening';
  };

  setGlobalDeviceInfo = async () => {
    const deviceJSON: IDeviceInfo = {
      uniqueId: DeviceInfo.getUniqueId(),
      deviceId: DeviceInfo.getDeviceId(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      isTablet: DeviceInfo.isTablet(),
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      buildNumber: parseInt(DeviceInfo.getBuildNumber(), 10),
      buildVersion: DeviceInfo.getVersion(),
      manufacturer: await DeviceInfo.getManufacturer()
    };
    Global.deviceInfo = deviceJSON;
  };

  // ===>
  // shouldComponentUpdate(props: any, state: any) {
  //   return AppHelper.compareProps(this.constructor.name, this.props, props);
  // }
  compareProps = (name: any, old: any, v: any) => {
    const keys = Object.keys(v);
    for (let i = 0; i < keys.length; i += 1) {
      if (v[keys[i]] !== old[keys[i]]) {
        // eslint-disable-next-line no-console
        console.log('%c %s: %s has changed from %o to %o', 'color: #c00', name, keys[i], old[keys[i]], v[keys[i]]);
        // return true;
      }
    }
    // return false;
    return true;
  };

  initCalendarLanguage = () => {
    LocaleConfig.locales.en = {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      today: 'Today'
    };
    LocaleConfig.locales.vi = {
      monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      monthNamesShort: ['Thg.1', 'Thg.2', 'Thg.3', 'Thg.4', 'Thg.5', 'Thg.6', 'Thg.7', 'Thg.8', 'Thg.9', 'Thg.10', 'Thg.11', 'Thg.12'],
      dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
      dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      today: 'Hôm nay'
    };
  };

  vndPriceFormat = (price: number) => {
    if (price > 0 && price < 1000000) {
      return `${Math.round(price / 1000 * 100) / 100} ngàn`;
    }
    if (price >= 1000000 && price < 1000000000) {
      return `${Math.round(price / 1000000 * 100) / 100} triệu`;
    }
    if (price > 1000000000) {
      return `${Math.round(price / 1000000000 * 100) / 100} tỷ`;
    }
    return price;
  };

  convertPrice = (number: number, seperator: string) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

const AppHelper = CAppHelper.Instance;
export default AppHelper;
