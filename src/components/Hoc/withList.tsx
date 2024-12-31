/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import React from 'react';
import Server, { TQuery, dataPrefix } from '@utils/server';
import AppHelper, { Global, TError, TMetadata } from '@utils/appHelper';
import Filter from '@utils/filter';
import Api from '@utils/api';
import { connect } from 'react-redux';
import _ from 'lodash';
import HocHelper, { IReduxExtraItem, IExtraItem, ILocalExtraItem, IHocLog, IHocFlatListProps, WithRedux } from '@utils/hocHelper';
import { Q } from '@nozbe/watermelondb';
import qs from 'qs';
import Local from '@utils/local';
import FlatList from '../Common/FlatList/DefaultFlatList';

export interface WithListProps {
  navigation: any;
  getList: any;
  loading: boolean;
  data: any;
  error: TError;
  metadata: TMetadata;
  filter: boolean;
}

// function getDisplayName(WrappedComponent: React.ComponentType) {
//   return WrappedComponent.displayName || WrappedComponent.name || 'Component';
// };

const withList = (
  { url, table, redux, refFields, fields, sort, extraData, localExtraData, reduxExtraData, mapStateToProps, mapDispatchToProps, focusRefresh, isSilentRefresh, log }: {
    url?: string;
    table?: string;
    redux?: WithRedux;
    refFields?: string[];
    fields?: Array<string>;
    sort?: Array<string>;
    extraData?: IExtraItem[];
    localExtraData?: ILocalExtraItem[];
    reduxExtraData?: IReduxExtraItem[];
    mapStateToProps?: (state: any) => any;
    mapDispatchToProps?: (dispatch: any) => any;
    focusRefresh?: boolean | any[];
    isSilentRefresh?: boolean;
    log?: IHocLog
  }
) => <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  class WithList extends React.Component<P & WithListProps, any> {
    initHocPrams: {
      url?: string,
      fields?: Array<string>,
      sort?: Array<string>,
      table?: string,
      extraData?: IExtraItem[],
      localExtraData?: ILocalExtraItem[]
    } = { url, extraData, table, localExtraData };

    flatList: any;

    unsubscribe: any;

    filter: Filter = this.props.filter ? new Filter(this.props.filter) : new Filter();

    modifyData: {
      key?: string;
      fn: (data: any) => any
    }[] = [];

    localQueryFn: any;

    metadata: TMetadata = this.props.metadata ? this.props.metadata : {
      count: 10,
      total: 0,
      page: 1,
      pageCount: 1,
    };

    constructor(props: any) {
      super(props);
      const state: any = {
        loading: !!(url || table || redux),
        data: [],
        metadata: this.metadata,
        error: null,
      };

      // Merge State for LocalExtraData & ExtraData
      HocHelper.mergeStateForExtraData(state, extraData);
      HocHelper.mergeStateForExtraData(state, localExtraData);

      this.state = state;
      this.handleInitUrl();
    }

    async componentDidMount() {
      if (this.metadata.total === 0) {
        this.getList({ fields, filter: this.filter?.filterObject, sort });
      }

      // Fetch Data for ExtraData
      if (extraData && !_.isEmpty(extraData)) {
        await Promise.all(extraData.map(async (item: { key: string, url: string }) => {
          const result = await Server.fetchDetail(this.props, item.url);
          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => o.key === item.key);
          if (modifyDataFn && modifyDataFn.fn) {
            result.data = await modifyDataFn.fn(result.data);
          }
          this.setState({
            [item.key]: result
          });
        }));
      }

      // Fetch Data for LocalExtraData
      if (localExtraData && !_.isEmpty(localExtraData)) {
        await Promise.all(localExtraData.map(async (item: { key: string, table: string, refFields?: string[] }) => {
          const result = await Local.fetchDetail(this.props, item.table);
          // Handle RefFields
          const localRefFields = item.refFields;
          if (localRefFields) {
            await Promise.all(result.data.map(async (subItem: any, index: number) => {
              await localRefFields.map(async (e: any) => {
                result.data[index][e].data = await result.data[index][e].fetch();
                return true;
              });
            }));
          }

          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => o.key === item.key);
          if (modifyDataFn && modifyDataFn.fn) {
            result.data = await modifyDataFn.fn(result.data);
          }
          this.setState({
            [item.key]: result
          });
        }));
      }

      // Trigger Fetch Action for ReduxExtraData
      await HocHelper.triggerActionForReduxExtraData(this.props, reduxExtraData);

      // [ExtraData] Log Events
      if (log) {
        const dataSource = redux ? this.props : this.state;
        HocHelper.logScreenEvent(log, dataSource);
      }

      // Focus Refresh
      if (focusRefresh) {
        const { navigation } = this.props;
        this.unsubscribe = navigation.addListener('focus', async () => {
          if (_.isArray(focusRefresh) && !_.isEmpty(focusRefresh)) {
            focusRefresh.forEach((e) => {
              const silent = isSilentRefresh || true;
              this.refetch(silent, e);
            });
          } else {
            // Refresh All
            const silent = isSilentRefresh || true;
            await this.refetch(silent);
            if (extraData && !_.isEmpty(extraData)) {
              extraData.forEach(async (e) => {
                await this.refetch(silent, e.key);
              });
            }
            if (localExtraData && !_.isEmpty(extraData)) {
              localExtraData.forEach(async (e) => {
                await this.refetch(silent, e.key);
              });
            }
          }
        });
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe && focusRefresh) {
        this.unsubscribe();
      }
      url = this.initHocPrams.url;
      fields = this.initHocPrams.fields;
      sort = this.initHocPrams.sort;
      extraData = this.initHocPrams.extraData;
      table = this.initHocPrams.table;
      localExtraData = this.initHocPrams.localExtraData;
    }

    handleInitUrl = () => {
      if (url) {
        // Handle Replacing Id by specific value from params
        const initialData = AppHelper.getItemFromParams(this.props);
        if (initialData) {
          url = url.replace(':id', initialData.id);
        }

        // Handle Init Filter
        if (_.includes(url, '?') && _.includes(url, 'filter={"')) {
          const pureUrl = url.split('?')[0];
          const query = qs.parse(url.split('?')[1]);
          const queryFilter: any = query.filter;
          this.filter.filterObject = JSON.parse(queryFilter);

          // Remove Filter from inital url
          const newQuery = _.omit(query, 'filter');
          url = `${pureUrl}?${qs.stringify(newQuery, {
            indices: false,
            strictNullHandling: true,
            arrayFormat: 'comma',
          })}`;
        }
      }
    };

    setModifyData = (fn: (data: any) => any, key?: string) => {
      this.modifyData.push({
        key,
        fn
      });
    };

    setLocalQuery = (fn: (localQuery: any) => any) => {
      this.localQueryFn = fn;
    };

    // Fetch FlatList
    fetch = async (query: TQuery): Promise<any> => {
      if (table) {
        // Local Fetch
        const queryAny: any = query;
        const { page: pageQuery, limit: limitQuery, filter, sort } = queryAny;
        const page = !_.isUndefined(pageQuery) ? Number.parseInt(pageQuery, 10) : 1;
        const limit = !_.isUndefined(limitQuery) ? Number.parseInt(limitQuery, 10) : 1;
        let localQuery: any = [];

        Local.handleFilter(localQuery, filter);
        Local.handleSort(localQuery, sort);
        if (this.localQueryFn) {
          localQuery = this.localQueryFn(localQuery);
        }

        const model = Global.database.collections.get(table);

        const data: any = await model.query(
          ...localQuery,
          Q.experimentalSkip((page - 1) * limit),
          Q.experimentalTake(limit),
        ).fetch();

        // Handle RefFields
        if (refFields) {
          await Promise.all(data.map(async (item: any, index: number) => {
            await refFields.map(async (e: any) => {
              data[index][e].data = await data[index][e].fetch();
              return true;
            });
          }));
        }

        const total = await model.query(...localQuery).fetchCount();
        const pageCount = _.ceil(_.divide(total, limit));
        const metadata = {
          count: data.length,
          total,
          page,
          pageCount
        };

        return {
          [dataPrefix]: data,
          metadata,
        };
      }

      if (url) {
        return Api.get(url, query);
      }
      return null;
    };

    refetch = async (silent: boolean = false, key?: string) => {
      if (key) {
        // Refetch extraData & localExtraData
        const extraItem = _.findLast(extraData, (o) => o.key === key);
        const localItem = _.findLast(localExtraData, (o) => o.key === key);
        if (extraItem) {
          // eslint-disable-next-line react/destructuring-assignment
          const stateKey = this.state[key];
          this.setState({
            [key]: {
              ...stateKey,
              loading: !silent
            }
          });
          const result = await Server.fetchDetail(this.props, extraItem.url);
          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => o.key === extraItem.key);
          if (modifyDataFn && modifyDataFn.fn) {
            result.data = await modifyDataFn.fn(result.data);
          }
          this.setState({
            [key]: result
          });
        }
        if (localItem) {
          // eslint-disable-next-line react/destructuring-assignment
          const stateKey = this.state[key];
          this.setState({
            [key]: {
              ...stateKey,
              loading: !silent
            }
          });
          const result = await Local.fetchDetail(this.props, localItem.table);
          // Handle RefFields
          const localRefFields = localItem.refFields;
          if (localRefFields) {
            await Promise.all(result.data.map(async (subItem: any, index: number) => {
              await localRefFields.map(async (e: any) => {
                result.data[index][e].data = await result.data[index][e].fetch();
                return true;
              });
            }));
          }

          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => o.key === localItem.key);
          if (modifyDataFn && modifyDataFn.fn) {
            result.data = await modifyDataFn.fn(result.data);
          }
          this.setState({
            [key]: result
          });
        }
      } else {
        this.flatList.handleRefresh(silent);
      }
    };

    setUrl = (newUrl: string, key?: string): any => {
      if (extraData && key) {
        const index = _.findIndex(extraData, (o) => o.key === key);
        if (index !== -1) {
          extraData[index].url = newUrl;
        }
      } else {
        url = newUrl;
      }
      this.handleInitUrl();
    };

    setData = (data: any, key?: any) => {
      if (key) {
        // Refetch extraData
        const item = _.findLast(extraData, (o) => o.key === key);
        if (item) {
          // eslint-disable-next-line react/destructuring-assignment
          const stateKey = this.state[key];
          this.setState({
            [key]: {
              ...stateKey,
              data,
            }
          });
        }
      } else {
        this.setState({ data });
      }
    };

    setMetadata = (newMetadata: {
      count: number,
      total: number,
      page: number,
      pageCount: number,
    }) => {
      const { metadata } = this.state;
      this.metadata = newMetadata; // For initial metadata
      this.setState({ metadata: { ...metadata, ...newMetadata } });
    };

    refresh = () => {
      this.flatList.handleRefresh();
    };

    getList = async (query: TQuery, loadMore: boolean = true) => {
      const { data: dataState } = this.state;
      const handledQuery = Server.handleQuery(query);

      if (!loadMore) {
        delete handledQuery.offset;
        delete handledQuery.limit;
        delete handledQuery.page;
      }

      if (redux) {
        this.props.getList(handledQuery);
      } else if (table || url) {
        try {
          this.setState({ loading: true });

          // PureList
          const response = await this.fetch(handledQuery);
          const metadata = {
            count: response.count,
            total: response.total,
            page: response.page,
            pageCount: response.pageCount
          };

          let dataGet = response[dataPrefix];
          await this.setState({
            metadata,
          });
          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => _.isUndefined(o.key));
          if (modifyDataFn && modifyDataFn.fn) {
            dataGet = await modifyDataFn.fn(dataGet);
          }
          let data = dataGet;
          if (metadata) {
            const currentPage = response.page;
            data = currentPage === 1 || !currentPage
              ? dataGet
              : dataState.concat(
                dataGet.filter(
                  (item: any) => dataState.indexOf(item) < 0,
                ),
              );
          }
          this.setState({
            loading: false,
            data,
            error: null,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('Error: ', error);

          const handledError = AppHelper.handleException(error);

          this.setState({
            loading: false,
            error: handledError,
          });
          return false;
        }
      }

      return [];
    };

    getFlatList = () => this.flatList.flatListRef;

    // isAllFetched = () => {
    //   const propsAny: any = this.props;
    //   if (!reduxExtraData || _.isEmpty(reduxExtraData)) return false;

    //   return !reduxExtraData.some((e: IReduxExtraItem) => {
    //     if (!propsAny[e.key]?.data || _.isEmpty(propsAny[e.key].data)) return true;
    //   });
    // };
    renderFlatList = (flatListProps?: IHocFlatListProps) => {
      let {
        loading,
        data,
        metadata,
        error
      } = this.state;

      if (redux) {
        loading = this.props.loading;
        data = this.props.data;
        metadata = this.props.metadata;
        error = this.props.error;
      }

      let loadMore: any = true;
      if (flatListProps) {
        loadMore = flatListProps.loadMore;
      }

      if (flatListProps?.renderItem) {
        return (
          <FlatList
            ref={(ref: any) => { this.flatList = ref; }}
            {...flatListProps}
            loading={loading}
            data={data}
            metadata={metadata}
            error={error}
            fetchData={(query?: TQuery) => this.getList({ ...query, fields, filter: this.filter?.filterObject, sort }, loadMore)}
            // @ts-ignore
            renderItem={(data) => flatListProps?.renderItem(data)}
          />
        );
      }
      return null;
    };

    refetchProps = (key?: string) => this.refetch(isSilentRefresh || true, key);

    getListProps = (query?: TQuery) => {
      this.getList({ ...query, fields, filter: this.filter?.filterObject });
    };

    render() {
      if (WrappedComponent) {
        let {
          loading,
          data,
          metadata,
          error
        } = this.state;

        if (redux) {
          loading = this.props.loading;
          data = this.props.data;
          metadata = this.props.metadata;
          error = this.props.error;
        }

        return (
          <>
            <WrappedComponent
              {...this.props as P}
              {...this.state}
              loading={loading}
              data={data}
              metadata={metadata}
              error={error}
              getFlatList={this.getFlatList}
              filter={this.filter}
              refresh={this.refresh}
              setUrl={this.setUrl}
              setData={this.setData}
              setMetadata={this.setMetadata}
              renderFlatList={this.renderFlatList}
              setModifyData={this.setModifyData}
              setLocalQuery={this.setLocalQuery}
              refetch={this.refetchProps}
              getList={this.getListProps}
            />
          </>
        );
      }
      return null;
    }
  }

  const customMapStateToProps = (state: any) => {
    let result: any = {};
    if (redux) {
      result = {
        loading: state[redux.constant.NAME][`${redux.constant.KEY}Loading`],
        data: state[redux.constant.NAME][`${redux.constant.KEY}Data`],
        metadata: state[redux.constant.NAME][`${redux.constant.KEY}Metadata`],
        error: state[redux.constant.NAME][`${redux.constant.KEY}Error`],
        filter: state[redux.constant.NAME][`${redux.constant.KEY}Filter`],
      };
    }

    if (mapStateToProps) {
      result = {
        ...result,
        ...mapStateToProps(state),
      };
    }

    // Map State for ReduxExtraData
    result = HocHelper.mapStateForReduxExtraData(result, state, reduxExtraData);
    return result;
  };

  const customMapDispatchToProps = (dispatch: any) => {
    let result: any = {};
    if (redux) {
      result = {
        getList: (query?: TQuery) => dispatch(redux.dispatch(query)),
      };
    }

    if (mapDispatchToProps) {
      result = {
        ...result,
        ...mapDispatchToProps(dispatch),
      };
    }

    // Map Dispatch for ReduxExtraData
    result = HocHelper.mapDispatchForReduxExtraData(result, dispatch, reduxExtraData);
    return result;
  };

  if (redux || mapStateToProps || mapDispatchToProps) {
    return connect(
      customMapStateToProps,
      customMapDispatchToProps,
      null,
      { forwardRef: true },
    )(WithList as any) as React.ComponentType<Omit<P, 'filter' | 'refresh' | 'setUrl' | 'renderFlatList' | 'refetch' | 'setData' | 'getList' | 'setModifyData' | 'loading' | 'data' | 'metadata' | 'error' >>;
  }
  return WithList as React.ComponentType<Omit<P, 'filter' | 'refresh' | 'setUrl' | 'renderFlatList' | 'refetch' | 'setData' | 'getList' | 'setModifyData' | 'loading' | 'data' | 'metadata' | 'error' >>;
};
export default withList;
