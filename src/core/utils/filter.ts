import _ from 'lodash';

type IConditionalOperator = 'OR_VALUE' | 'AND_VALUE' | 'OR_KEY' | 'AND_KEY';

export type IOperator = '$eq' | '$not'
| '$ne'
| '$gt'
| '$lt'
| '$gte'
| '$lte'
| '$starts'
| '$ends'
| '$cont'
| '$like'
| '$ilike'
| '$excl'
| '$in'
| '$notin'
| '$isnull'
| '$notnull'
| '$between'
| '$eqL'
| '$neL'
| '$startsL'
| '$endsL'
| '$contL'
| '$exclL'
| '$inL'
| '$notinL';

class Filter {
  constructor(filterObject: any = {}) {
    this.filterObject = filterObject;
  }

  public filterObject: any;

  public mergeFilter(
    key: string,
    operator: IOperator,
    value: string | number | Array<number> | boolean | null,
    conditionalOperator?: IConditionalOperator,
  ): any {
    const valueWithCondition: any = {};
    valueWithCondition[operator] = value;

    // if (operator === '$eq' || operator === '$eqL') {
    //   valueWithCondition = value;
    // } else {
    //   valueWithCondition[operator] = value;
    // }

    const newFilter: any = {};
    newFilter[key] = valueWithCondition;

    if (conditionalOperator) {
      switch (conditionalOperator) {
        case 'OR_KEY':
          this.filterObject = { $or: { ...this.filterObject, ...newFilter } };
          break;
        case 'AND_VALUE':
          this.filterObject[key] = { ...this.filterObject[key], ...newFilter[key] };
          break;
        case 'OR_VALUE':
          this.filterObject[key] = { $or: { ...this.filterObject[key], ...newFilter[key] } };
          break;
        default: // AND_KEY
          this.filterObject = { ...this.filterObject, ...newFilter };
      }
    } else {
      this.filterObject = { ...this.filterObject, ...newFilter };
    }

    return this.filterObject;
  }

  public clearFilter(): void {
    this.filterObject = {};
  }

  public deleteFilterByKey(key: string): void {
    this.filterObject = _.omit(this.filterObject, key);
    // delete this.filterObject[key];
  }
}

export default Filter;
