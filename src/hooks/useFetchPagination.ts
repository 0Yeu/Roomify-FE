/* eslint-disable @typescript-eslint/no-use-before-define */
import Api from '@utils/api';
import AppHelper from '@utils/appHelper';
import Server, { TQuery } from '@utils/server';
import _ from 'lodash';
import qs from 'qs';
import { useEffect, useState } from 'react';

interface S {
  data: any,
  error: any,
  loading: boolean,
  metadata: any,
  total: number
}
const useFetchPagination = (endpoint: string, defaultValue: any, query?: TQuery, prefix: string = 'result', deps: Array<any> = [], haveParams?: boolean) => {
  const [state, setState] = useState<S>({
    data: defaultValue,
    error: null,
    loading: true,
    metadata: null,
    total: 0,
  });

  const fetch = (query: TQuery): Promise<any> => {
    console.log('query :>> ', query);
    const queryString = Server.stringifyQuery(query);

    if (queryString) {
      return Api.get(`/${endpoint}${haveParams ? '&' : '?'}${queryString}`);
    }
    return Api.get(`/${endpoint}`);
  };

  const getList = async (query: TQuery, loadMore: boolean = true,) => {
    try {
      setState({ ...state, loading: true });
      // const queryString = Server.stringifyQuery(query);
      // let parseQuery = qs.parse(queryString, { strictNullHandling: true });
      // parseQuery = _.omitBy(parseQuery, _.isEmpty);
      // if (!loadMore) {
      //   delete parseQuery.offset;
      //   delete parseQuery.limit;
      //   delete parseQuery.page;
      // }
      const handledQuery = Server.handleQuery(query);

      if (!loadMore) {
        delete handledQuery.offset;
        delete handledQuery.limit;
        delete handledQuery.page;
      }

      const response: any = await fetch(handledQuery);
      const { page, total, pageCount, count } = response;
      const dataGet = response[prefix];
      let dataCopy = dataGet;
      if (page) {
        const currentPage = response?.page;
        dataCopy = currentPage === 1 || !currentPage
          ? dataGet
          : data.concat(
            dataGet.filter(
              (item: any) => data.indexOf(item) < 0,
            ),
          );
      }
      setState({
        ...state,
        data: dataCopy,
        loading: false,
        error: null,
        total,
        metadata: { page, pageCount, total, count }
      });
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error: ', error);
      const handledError = AppHelper.handleException(error);
      setState({ ...state, loading: false, error: handledError });
      return false;
    }
  };
  useEffect(() => {
    getList({ ...query });
    return () => {
      setState({ data: defaultValue, error: null, loading: false, metadata: null, total: 0 });
    };
  }, deps);

  const { data, error, loading, metadata, total } = state;

  const getListFunc = (queries: TQuery) => {
    getList({ ...queries });
  };
  return [data, loading, error, metadata, getListFunc, total];
};

export default useFetchPagination;
