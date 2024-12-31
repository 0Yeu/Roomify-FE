/* eslint-disable import/prefer-default-export */
import Api from '@utils/api';

export const fetchCitiesApi = () => Api.get('/destinations/city');
