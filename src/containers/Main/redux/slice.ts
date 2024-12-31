import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Appearance } from 'react-native';
import i18n from '@configs/i18n';
import RNLocalize from 'react-native-localize';
import { Global } from '@utils/appHelper';
import { REHYDRATE } from 'redux-persist';
import Redux from '@utils/redux';
import { fetchCitiesApi } from './api';

/**
 * --- CONSTANT ---
 */

/**
 * Enum
 */
export type ThemeMode = 'light' | 'dark';

export type Language = 'en' | 'vi';

export const CONSTANT = {
  USER_CONFIG: 'userConfig',
  CITY: 'city'
};

/**
 * Initial State
 */
export async function changeLanguageConfig(
  language: string,
) {
  await i18n.changeLanguage(language);
  LocaleConfig.defaultLocale = language;
  moment.locale(language);
}

export const INITIAL_STATE = {
  ...Redux.createArrayInitialState(CONSTANT.CITY),
  selectedCity: null,
  dataCreateProperty: null

};

export const fetchCities = createAsyncThunk<any>(
  `${CONSTANT.USER_CONFIG}/fetchCities`,
  async (data, thunkAPI) => {
    try {
      const response = await fetchCitiesApi();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/**
 * --- SLICE ---
 */
const userConfig = createSlice({
  name: 'userConfig',
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    setDataCreateProperty(state, action) {
      console.log('action.payload :>> ', action.payload);
      state.dataCreateProperty = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state[`${CONSTANT.CITY}Data`] = action.payload?.result;
      state[`${CONSTANT.CITY}Loading`] = false;
    });
    builder.addCase(fetchCities.pending, (state) => {
      state[`${CONSTANT.CITY}Loading`] = true;
    });
    builder.addCase(fetchCities.rejected, (state, action: any) => {
      state[`${CONSTANT.CITY}Error`] = action?.error?.message;
      state[`${CONSTANT.CITY}Loading`] = false;
    });
    // builder.addCase(REHYDRATE, (state, action: any) => {
    //   if (action.payload?.config) {
    //     state = {
    //       ...action.payload.config,
    //       reloadBottomSheet: INITIAL_STATE.reloadBottomSheet
    //     };
    //   }
    // });
  }
});

export const { setSelectedCity, setDataCreateProperty } = userConfig.actions;

export default userConfig.reducer;
