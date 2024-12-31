import AppHelper from '@utils/appHelper';
import { store } from '@core/configs/store';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import _ from 'lodash';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
/* eslint-disable-next-line import/no-cycle */
import { TObject, TArray } from './appHelper';
import { dataPrefix } from './server';

/**
 * Redux Type
 */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Redux
 */
class CRedux {
  private static _instance: CRedux;

  private constructor() {
    // ...
  }

  public static get Instance(): CRedux {
    if (!this._instance) {
      this._instance = new this();
    }
    return CRedux._instance;
  }

  createObjectInitialState = (key?: string) => {
    const result: TObject = {
      loading: false,
      data: {},
      error: null,
    };
    if (key) {
      const parentResult: any = {};
      parentResult[`${key}Loading`] = result.loading;
      parentResult[`${key}Data`] = result.data;
      parentResult[`${key}Error`] = result.error;
      return parentResult;
    }
    return result;
  };

  createArrayInitialState = (key?: string) => {
    const result: TArray = {
      loading: false,
      data: [],
      metadata: {
        count: 10,
        total: 0,
        page: 1,
        pageCount: 1,
      },
      error: null,
      filter: {}
    };
    if (key) {
      const parentResult: any = {};
      parentResult[`${key}Loading`] = result.loading;
      parentResult[`${key}Data`] = result.data;
      parentResult[`${key}Metadata`] = result.metadata;
      parentResult[`${key}Error`] = result.error;
      parentResult[`${key}Filter`] = result.filter;
      return parentResult;
    }
    return result;
  };

  createObjectReducer = (builder: ActionReducerMapBuilder<any>, key: string, thunk: any) => {
    builder.addCase(thunk.pending, (state, action) => {
      state[`${key}Loading`] = true;
      state[`${key}Data`] = action.meta.arg || {};
      state[`${key}Error`] = null;
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      state[`${key}Loading`] = false;
      state[`${key}Data`] = action.payload[dataPrefix];
    });
    builder.addCase(thunk.rejected, (state, action) => {
      state[`${key}Loading`] = false;
      state[`${key}Error`] = AppHelper.handleException(action.payload);
    });
  };

  createArrayReducer = (builder: ActionReducerMapBuilder<any>, key: string, thunk: any) => {
    builder.addCase(thunk.pending, (state, action) => {
      state[`${key}Loading`] = true;
      state[`${key}Error`] = null;
      const filter = _.omit(action.meta.arg, 'limit', 'offset', 'page', 'perPage');
      if (filter.s) state[`${key}Filter`] = JSON.parse(filter.s);
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      state[`${key}Loading`] = false;
      if (action.payload.page === 1) {
        state[`${key}Data`] = action.payload[dataPrefix];
      } else {
        state[`${key}Data`] = [
          ...state[`${key}Data`],
          ...action.payload[dataPrefix]
        ];
      }
      state[`${key}Metadata`] = {
        count: action.payload.count,
        total: action.payload.total,
        page: action.payload.page,
        pageCount: action.payload.pageCount
      };
    });
    builder.addCase(thunk.rejected, (state, action) => {
      state[`${key}Loading`] = false;
      state[`${key}Error`] = AppHelper.handleException(action.payload);
    });
  };

  resetTempField = (key: string) => ({
    [`${key}Loading`]: false,
    [`${key}Error`]: null,
  });
}
const Redux = CRedux.Instance;
export default Redux;
