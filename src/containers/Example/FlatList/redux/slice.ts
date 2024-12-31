/* eslint-disable no-empty-pattern */
import { TQuery } from '@utils/server';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Redux from '@utils/redux';
import { REHYDRATE } from 'redux-persist';
import { getProductDetailApi, getProductListApi } from './api';

/**
 * ---------------- CONSTANT & INITIAL_STATE ----------------
 */

export const CONSTANT = {
  NAME: 'product',
  LIST: 'list',
  DETAIL: 'detail',
};

const INITIAL_STATE = {
  ...Redux.createArrayInitialState(CONSTANT.LIST),
  ...Redux.createObjectInitialState(CONSTANT.DETAIL),
};

/**
 * ----------------------- REDUX THUNK -----------------------
 */

export const getProductList = createAsyncThunk<any, TQuery>(
  `${CONSTANT.NAME}/getList`,
  async (data, thunkAPI) => {
    try {
      const response = await getProductListApi(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProductDetail = createAsyncThunk<any, any>(
  `${CONSTANT.NAME}/getDetail`,
  async (data, thunkAPI) => {
    try {
      const response = await getProductDetailApi(data.id);
      return response;
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

  },
  extraReducers: (builder) => {
    Redux.createArrayReducer(builder, CONSTANT.LIST, getProductList);
    Redux.createObjectReducer(builder, CONSTANT.DETAIL, getProductDetail);
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload && action.payload[CONSTANT.NAME]) {
        return {
          ...action.payload[CONSTANT.NAME],
          ...Redux.resetTempField(CONSTANT.LIST),
          ...Redux.resetTempField(CONSTANT.DETAIL),
        };
      }
      return state;
    });
  },
});

export const {} = slice.actions;

export default slice.reducer;
