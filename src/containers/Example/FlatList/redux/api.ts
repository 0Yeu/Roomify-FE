import Api from '@utils/api';
import { TQuery } from '@utils/server';

export const getProductListApi = (query: TQuery) => Api.get('/posts', query);

export const getProductDetailApi = (id: number) => Api.get(`/posts/${id}`);
