import { combineReducers } from 'redux';
import { Global } from '@utils/appHelper';
import { pick } from 'lodash';
import config from '@src/containers/Config/redux/slice';
import auth from '@src/containers/Auth/components/Login/redux/slice';
import userConfig from '@src/containers/Main/redux/slice';
import product from '@src/containers/Example/FlatList/redux/slice';

const appReducers = combineReducers({
  config,
  auth,
  userConfig,
  product,
});

/**
 * Root reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_REDUX') {
    // eslint-disable-next-line no-console
    console.log('RESET_REDUX Called');
    Global.token = '';
    // state = undefined;
    state = pick(state, ['config']);
  }
  return appReducers(state, action);
};

export default rootReducer;
