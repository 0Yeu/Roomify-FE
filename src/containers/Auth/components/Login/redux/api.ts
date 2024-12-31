/* eslint-disable import/prefer-default-export */
import Api from '@utils/api';

export const loginApi = (data: any) => Api.post('/auth/login', data);
export const signupApi = (data: any) => Api.post('/auth/register', data);
