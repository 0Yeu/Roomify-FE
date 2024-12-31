import qs from 'qs';
/* eslint-disable no-console */
import Config from 'react-native-config';
import _ from 'lodash';
import axios from 'axios';
import { logout } from '@containers/Auth/components/Login/redux/slice';

const Global: any = global;

type TErrorData = {
  statusCode: number,
  message?: {
    code: string,
    description: string
  }[],
  error: string
};

const Axios = axios.create({
  // baseURL: "http://192.168.110.194:3000/api/v1", //thachy
  // baseURL: "http://192.168.1.40:3000/api/v1", //sgroup
  // baseURL: "http://192.168.8.2:3000/api/v1", //pearuk
  // baseURL: "http://192.168.1.171:3000/api/v1",
  // baseURL: 'https://roomify.tk/api/v1',
  // baseURL: 'http://192.168.1.5:3000/api/v1', //home
  // baseURL: 'http://192.168.1.173:3000/api/v1', //ge
  // baseURL: 'http://localhost:3000/api/v1',
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  timeout: 10000,
  paramsSerializer(params) {
    return qs.stringify(params, {
      indices: false,
      strictNullHandling: true,
      arrayFormat: 'comma',
    });
  },
});

Axios.interceptors.response.use(
  (res) => {
    console.log('Url: ', res, Config.API_URL);
    console.log('Url: ', decodeURIComponent(res.request.responseURL));
    return res.data;
  },
  (err) => {
    console.log('Url: ', err, Config.API_URL);
    console.log('Url err: ', err);
    console.log('Url: err', decodeURIComponent(err.request.responseURL));
    console.log('Error:', `[${err.response?.status}][${err.response?.config?.method?.toUpperCase()}][${err.request?.responseURL}]`, err.response?.data || err.response);

    // console.log('Error request: ', err.request);
    let errorData: TErrorData = {
      statusCode: 500,
      error: 'Internal Server Error'
    };

    if (err.response?.status === 401) {
      Global.dispatch(logout());
    }
    if (err.response?.status) {
      errorData = {
        statusCode: err.response?.status,
        message: err?.response?.data?.message,
        error: err?.response?.data?.error
      };
    }

    if (err.message && err.message.includes('timeout of')) {
      errorData = {
        statusCode: 408,
        error: 'Request time out'
      };
    }
    if (err.response && err.response.data) {
      const serverErrorData = err.response.data;
      if (typeof serverErrorData === 'string' && serverErrorData.includes('502 Bad Gateway')) {
        errorData = {
          statusCode: 502,
          error: 'Bad Gateway'
        };
      }
    }
    return Promise.reject(errorData);
  },
);

function requestWrapper(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
  return async (url: string, data?: Object): Promise<any> => {
    const isFullUrl = _.startsWith(url, 'http');
    // if (!isFullUrl && Global.token && !Axios.defaults.headers.Authorization) {
    if (!isFullUrl && Global.token) {
      Axios.defaults.headers.Authorization = `Bearer ${Global.token}`;
    }

    switch (method) {
      case 'POST':
        return Axios.post(url, data);
      case 'PUT':
        return Axios.put(url, data);
      case 'PATCH':
        return Axios.patch(url, data);
      case 'DELETE':
        return Axios.delete(url, data);
      default:
        return Axios.get(url, { params: data });
    }
  };
}

class CApi {
  private static _instance: CApi;

  private constructor() {
    // ...
  }

  public static get Instance(): CApi {
    if (!this._instance) {
      this._instance = new this();
    }
    return CApi._instance;
  }

  get = requestWrapper('GET');

  post = requestWrapper('POST');

  put = requestWrapper('PUT');

  patch = requestWrapper('PATCH');

  del = requestWrapper('DELETE');

  setHeader = (type: 'X-User-Agent' | 'X-locale' | 'Content-Type' | 'Authorization', data: string) => {
    switch (type) {
      case 'X-User-Agent':
        Axios.defaults.headers.common['X-User-Agent'] = data;
        break;
      case 'X-locale':
        Axios.defaults.headers['X-locale'] = data;
        break;
      case 'Authorization':
        Axios.defaults.headers.Authorization = data;
        break;
      case 'Content-Type':
        Axios.defaults.headers.post['Content-Type'] = data;
        break;
      default:
        break;
    }
  };
}
const Api = CApi.Instance;
export default Api;
