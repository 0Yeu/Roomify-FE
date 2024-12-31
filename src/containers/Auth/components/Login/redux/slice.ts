import { dataPrefix } from '@core/utils/server';
/* eslint-disable no-empty-pattern */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Global } from '@utils/appHelper';
import Redux from '@utils/redux';
import { REHYDRATE } from 'redux-persist';
import { loginApi, signupApi } from './api';

/**
 * ---------------- CONSTANT & INITIAL_STATE ----------------
 */

export const CONSTANT = {
  NAME: 'auth',
  LOGIN: 'login',
};

const INITIAL_STATE = {
  ...Redux.createObjectInitialState(CONSTANT.LOGIN),
};

/**
 * ----------------------- REDUX THUNK -----------------------
 */

export const login = createAsyncThunk<any, { email: string, password: string }>(
  `${CONSTANT.NAME}/login`,
  async (data, thunkAPI) => {
    try {
      const response = await loginApi(data);
      console.log('response :>> ', response);
      Global.token = response.token;
      return { data: response };
    } catch (error) {
      console.log('error---login', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const signup = createAsyncThunk<any, { email: string, password: string }>(
  `${CONSTANT.NAME}/signup`,
  async (data, thunkAPI) => {
    try {
      const response = await signupApi(data);
      Global.token = response.token;
      return { data: response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/**
 * -------------------------- SLICE --------------------------
 */

const slice = createSlice({
  name: CONSTANT.NAME,
  initialState: INITIAL_STATE,
  reducers: {
    logout: () => INITIAL_STATE
  },
  extraReducers: (builder) => {
    Redux.createObjectReducer(builder, CONSTANT.LOGIN, login);
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload && action.payload[CONSTANT.NAME]) {
        if (action.payload[CONSTANT.NAME][`${CONSTANT.LOGIN}Data`]) {
          Global.token = action.payload[CONSTANT.NAME][`${CONSTANT.LOGIN}Data`].token;
        }
        return {
          ...action.payload[CONSTANT.NAME],
          ...Redux.resetTempField(CONSTANT.LOGIN)
        };
      }
      return state;
    });
  },
});

export const { logout } = slice.actions;

export default slice.reducer;
