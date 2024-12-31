import Api from '@utils/api';
import { TQuery } from '@utils/server';
import { useEffect, useState } from 'react';

const useFetch = (
  url: string, defaultValue: any, query?: TQuery, prefix?: string, deps: Array<any> = [],
) => {
  const [state, setState] = useState({ data: defaultValue, error: null, loading: true });
  const fetch = async () => {
    try {
      setState({ ...state, loading: true });
      const result = await Api.get(url);
      console.log('result :>> ', prefix);
      setState({ ...state, data: !prefix ? result : result[prefix], loading: false });
    } catch (error) {
      setState({ ...state, loading: false, error });
      // eslint-disable-next-line no-console
      console.log('Error', error);
    }
  };
  useEffect(() => {
    fetch();
  }, deps);

  const { data, error, loading } = state;
  return { data, error, loading };
};

export default useFetch;
