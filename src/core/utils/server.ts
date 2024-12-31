/* eslint-disable import/no-cycle */

import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import _ from 'lodash';
import Config from 'react-native-config';
import qs from 'qs';
import AppHelper, { IImage, IResizedImage, TError } from './appHelper';
import Api from './api';
import Helper from './helper';

/**
 * Type
 */
export const dataPrefix = 'data'; // Config it depend on current API

export type TQuery = {
  fields?: Array<string>;
  page?: number;
  limit?: number;
  filter?: any;
  s?: any;
  sort?: Array<string>;
};

/**
 * Interface
 */

interface S3Body {
  type?: string;
  fileName?: string;
  folderPrefix?: string;
}

export interface IUploadUrl {
  presignedUrl: string;
  returnUrl: string;
}

class CServer {
  private static _instance: CServer;

  private constructor() {
    // ...
  }

  public static get Instance(): CServer {
    if (!this._instance) {
      this._instance = new this();
    }
    return CServer._instance;
  }

  // => Customize this function depend on specific project
  // eslint-disable-next-line max-len
  getUploadUrls = async (data: S3Body[]): Promise<IUploadUrl[]> => {
    const presignedUrlApi = '/medias/presigned-url/bulk';
    const result = await Api.post(presignedUrlApi, data);
    const returnResult: any = [];
    result.data.forEach((item: any) => {
      returnResult.push(
        {
          presignedUrl: item.presignedUrl,
          returnUrl: item.url,
        }
      );
    });
    return returnResult;
  };

  uploadToS3 = async (presignedUrl: string, data: {
    name?: string,
    type: string,
    uri: string,
  }) => {
    const uri = Platform.OS === 'ios'
      ? data.uri.replace('file:///', '').replace('file://', '')
      : data.uri.replace('file://', '').replace('file:/', '');

    return RNFetchBlob.fetch(
      'PUT',
      presignedUrl,
      { 'Content-Type': data.type,
      },
      RNFetchBlob.wrap(uri),
    );
  };

  async uploadImageToS3(folderPrefix: string = 'images', image: IImage): Promise<string> {
    // Get uploadUrl
    const uploadUrlBody: any = [];
    uploadUrlBody.push({
      type: image.mime,
      fileName: image.name,
      folderPrefix,
    });
    // console.log('uploadUrlBody', uploadUrlBody);

    const uploadUrls = await this.getUploadUrls(uploadUrlBody);

    const data = {
      name: image.name,
      type: image.mime,
      uri: image.path,
    };

    try {
      await this.uploadToS3(uploadUrls[0].presignedUrl, data);
      return uploadUrls[0].returnUrl;
    } catch (error) {
      return '';
    }
  }

  async uploadResizedImageToS3(folderPrefix: string = 'images', resizedImage: IResizedImage): Promise<{ origin: string, medium: string, thumbnail: string }> {
    // Get uploadUrl
    const uploadUrlBody: any = [];
    const keys: any = [];
    // eslint-disable-next-line no-restricted-syntax
    for (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [key, value] of Object.entries(resizedImage)
    ) {
      uploadUrlBody.push({
        type: value.mime,
        fileName: value.name,
        folderPrefix,
      });
      keys.push(key);
    }

    const uploadUrls = await this.getUploadUrls(uploadUrlBody);

    const returnUrl: any = {};

    try {
      // Origin
      const origin = {
        name: resizedImage.origin.name,
        type: resizedImage.origin.mime,
        uri: resizedImage.origin.path,
      };
      await this.uploadToS3(uploadUrls[_.indexOf(keys, 'origin')].presignedUrl, origin);
      returnUrl.origin = uploadUrls[0].returnUrl;

      // medium
      const medium = {
        name: resizedImage.medium.name,
        type: resizedImage.medium.mime,
        uri: resizedImage.medium.path,
      };
      await this.uploadToS3(uploadUrls[_.indexOf(keys, 'medium')].presignedUrl, medium);
      returnUrl.medium = uploadUrls[0].returnUrl;

      // medium
      const thumbnail = {
        name: resizedImage.thumbnail.name,
        type: resizedImage.thumbnail.mime,
        uri: resizedImage.thumbnail.path,
      };
      await this.uploadToS3(uploadUrls[_.indexOf(keys, 'thumbnail')].presignedUrl, thumbnail);
      returnUrl.thumbnail = uploadUrls[0].returnUrl;

      return returnUrl;
    } catch (error) {
      return {
        origin: '',
        medium: '',
        thumbnail: '',
      };
    }
  }

  initDetail = (props: any) => ({
    loading: true,
    data: AppHelper.getItemFromParams(props),
    error: null,
  });

  fetchDetail = async (props: any, preApiUrl: string):
  Promise<{ loading: boolean, data: any, error: TError | null }> => {
    const initialData = AppHelper.getItemFromParams(props);
    let apiUrl = preApiUrl;
    if (initialData) {
      apiUrl = preApiUrl.replace(':id', initialData.id);
    }
    try {
      const response = await Api.get(apiUrl);
      return {
        loading: false,
        data: response[dataPrefix],
        error: null,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error: ', error);

      return {
        loading: false,
        data: [],
        error: AppHelper.handleException(error),
      };
    }
  };

  handleQuery = (query: TQuery) => {
    let defaultLimit = parseInt(Config.PER_PAGE, 10);
    if (Number.isNaN(defaultLimit)) {
      defaultLimit = 10;
    }

    let handledQuery: any = query;

    if (_.has(handledQuery, 'filter')) {
      handledQuery.filter = JSON.stringify(handledQuery.filter);
    }

    if (handledQuery.filter) {
      // Nestjs (replace "filter" by "s")
      handledQuery.s = handledQuery.filter;
      handledQuery = _.omit(handledQuery, 'filter');
    }

    // Handle Sort individually (use when arrayFormat of stringifiedQuery is 'comma')
    // const sortStr = qs.stringify({ sort: handledQuery.sort }, { arrayFormat: 'repeat' });
    // handledQuery = _.omit(handledQuery, 'sort');
    handledQuery = Helper.compact(handledQuery);

    return handledQuery;
  };

  stringifyQuery = (query: TQuery) => {
    let defaultLimit = parseInt(Config.PER_PAGE, 10);
    if (Number.isNaN(defaultLimit)) {
      defaultLimit = 10;
    }
    const limit = query?.limit ? query.limit : defaultLimit;
    // const offset = query?.page && query.page >= 1 ? (query.page - 1) * limit : 0;
    // let handledQuery: any = _.omit(query, ['page']); // Bugs LoadMore if uncomment
    const handledQuery: any = query;
    // handledQuery.offset = offset;
    handledQuery.limit = limit;

    if (_.has(handledQuery, 's')) {
      handledQuery.s = JSON.stringify(handledQuery.s);
    }
    // if (_.has(handledQuery, 'filter')) {
    //   handledQuery.filter = JSON.stringify(handledQuery.filter);
    // }

    // if (handledQuery.filter) {
    // // Nestjs (replace "filter" by "s")
    //   handledQuery.s = handledQuery.filter;
    //   handledQuery = _.omit(handledQuery, 'filter');
    // }

    // Handle Sort individually (use when arrayFormat of stringifiedQuery is 'comma')
    // const sortStr = qs.stringify({ sort: handledQuery.sort }, { arrayFormat: 'repeat' });
    // handledQuery = _.omit(handledQuery, 'sort');

    const stringifiedQuery = qs.stringify(handledQuery, {
      indices: false,
      strictNullHandling: true,
      arrayFormat: 'repeat',
    });
    // eslint-disable-next-line max-len
    // if (sortStr) stringifiedQuery += `${_.includes(stringifiedQuery, '?') ? '&' : '?'}${sortStr}`;

    return stringifiedQuery;
  };

  cloudinaryUploadSingle = async (img: any) => {
    const photo = {
      uri: img.path,
      type: img.mime,
      name: img.filename,
    };
    console.log('photo :>> ', photo);
    let result: any;
    // photo.uri.replace('file:///', '').replace('file://', '');
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'roomify');
    data.append('cloud_name', 'dichakho');
    await fetch('https://api.cloudinary.com/v1_1/dichakho/upload', {
      method: 'post',
      body: data,
    }).then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        result = data;
        // setPhoto(data.secure_url);
      }).catch((err) => {
        console.log('err', err);
      });

    return result;
  };
}

const Server = CServer.Instance;
export default Server;
