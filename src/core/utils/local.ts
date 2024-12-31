/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import { IOperator } from './filter';
import AppHelper, { Global, TError } from './appHelper';

const convertLocalFilter = (key: string, operator: string, value: any) => {
  const filterOperator = operator as IOperator;
  switch (filterOperator) {
    case '$ne':
    case '$neL':
      return Q.where(key, Q.notEq(value));
    case '$gt':
      return Q.where(key, Q.gt(value));
    case '$lt':
      return Q.where(key, Q.lt(value));
    case '$gte':
      return Q.where(key, Q.gte(value));
    case '$lte':
      return Q.where(key, Q.lte(value));
    case '$like':
    case '$ilike':
    case '$cont':
    case '$contL':
      return Q.where(key, Q.like(`%${Q.sanitizeLikeString(value)}%`));
    case '$excl':
    case '$exclL':
      return Q.where(key, Q.notLike(`%${Q.sanitizeLikeString(value)}%`));
    case '$in':
      return Q.where(key, Q.oneOf(value));
    case '$notin':
      return Q.where(key, Q.notIn(value));
    default:
      return Q.where(key, value);
  }
};

const handleSubLocalFilter = (localQuery: any, key: string, value: any) => {
  if (value) {
    for (const [operator, subValue] of Object.entries(value)) {
      const filterSubValue: any = subValue;
      if (operator === '$or') {
        // OR_VALUE
        const subQuery: any = [];
        for (const [orOperator, orValue] of Object.entries(filterSubValue)) {
          subQuery.push(convertLocalFilter(key, orOperator, orValue));
        }
        localQuery.push(Q.or(...subQuery));
      } else {
        localQuery.push(convertLocalFilter(key, operator, subValue));
      }
    }
  }
};

class CLocal {
  private static _instance: CLocal;

  private constructor() {
    // ...
  }

  public static get Instance(): CLocal {
    if (!this._instance) {
      this._instance = new this();
    }
    return CLocal._instance;
  }

  fetchDetail = async (props: any, table: string): Promise<{ loading: boolean, data: any, error: TError | null }> => {
    const initialData = AppHelper.getItemFromParams(props);
    try {
      let response = null;
      if (initialData) {
        response = await Global.database.collections.get(table).find(initialData.id);
      } else {
        response = await Global.database.collections.get(table).query().fetch();
      }
      return {
        loading: false,
        data: response,
        error: null,
      };
    } catch (error) {
      return {
        loading: false,
        data: [],
        error,
      };
    }
  };

  handleFilter = (localQuery: Array<any>, filter: any) => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        const filterValue: any = value;
        // OR_KEY
        if (key === '$or') {
          const subQuery: any = [];
          for (const [subKey, subValue] of Object.entries(filterValue)) {
            handleSubLocalFilter(subQuery, subKey, subValue);
          }
          localQuery.push(Q.or(...subQuery));
        } else {
          handleSubLocalFilter(localQuery, key, value);
        }
      }
    }
  };

  handleSort = (localQuery: Array<any>, sortParams?: Array<string> | string) => {
    let sort = sortParams;
    if (sort) {
      if (!_.isArray(sort)) sort = [sort];
      sort.forEach((e) => {
        const sortItems = _.split(e, ',');
        const sortField = sortItems[0];
        const sortMode: any = _.lowerCase(sortItems[1]);
        localQuery.push(Q.experimentalSortBy(sortField, sortMode));
      });
    }
  };
}

const Local = CLocal.Instance;
export default Local;
