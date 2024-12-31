/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import HocHelper, { IExtraItem, IReduxExtraItem, IHocLog, ILocalExtraItem, WithRedux } from '@utils/hocHelper';
import _ from 'lodash';
import Server from '@utils/server';
import Local from '@utils/local';
import AppHelper, { TError } from '@utils/appHelper';

export interface WithPureDetailProps {
  navigation: any;
  getDetail: any;
  loading: boolean;
  data: any;
  error: TError;
}

const withDetail = (
  { url, table, redux, refFields, extraData, localExtraData, reduxExtraData, mapStateToProps, mapDispatchToProps, focusRefresh, isSilentRefresh, log }: {
    url?: string;
    table?: string;
    redux?: WithRedux;
    refFields?: string[];
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
  class WithDetail extends React.Component<P & WithPureDetailProps, any> {
    initHocPrams: {
      url?: string,
      extraData?: IExtraItem[],
    } = { url, extraData };

    unsubscribe: any;

    modifyData: {
      key?: string;
      fn: (data: any) => any
    }[] = [];

    constructor(props: any) {
      super(props);
      const state = Server.initDetail(props);

      // Merge State for LocalExtraData & ExtraData
      HocHelper.mergeStateForExtraData(state, extraData);
      HocHelper.mergeStateForExtraData(state, localExtraData);

      this.state = state;
    }

    async componentDidMount() {
      let result: any;

      if (redux) {
        const initialData = AppHelper.getItemFromParams(this.props);
        this.props.getDetail(initialData);
      } else if (table || url) {
        if (table) {
          result = await Local.fetchDetail(this.props, table);
          // Handle RefFields
          if (refFields) {
            // await Promise.all(result.data.map(async (item: any, index: number) => {
            //   await refFields.map(async (e: any) => {
            //     result.data[index][e].data = await result.data[index][e].fetch();
            //     return true;
            //   });
            // }));
            await Promise.all(refFields.map(async (e: any) => {
              result.data[e].data = await result.data[e].fetch();
            }));
          }
        } else if (url) {
          result = await Server.fetchDetail(this.props, url);
        }

        // modifyData
        const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => _.isUndefined(o.key));
        if (result && modifyDataFn && modifyDataFn.fn) {
          result.data = await modifyDataFn.fn(result.data);
        }
        this.setState(result);
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

      // [data & ExtraData] Log Events
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
            await this.refetch(true);
            if (extraData && !_.isEmpty(extraData)) {
              extraData.forEach(async (e) => {
                await this.refetch(true, e.key);
              });
            }
            if (localExtraData && !_.isEmpty(extraData)) {
              localExtraData.forEach(async (e) => {
                await this.refetch(true, e.key);
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
      extraData = this.initHocPrams.extraData;
    }

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
              loading: !silent,
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
        this.setState({
          loading: !silent,
        });
        let result: any;

        if (redux) {
          const initialData = AppHelper.getItemFromParams(this.props);
          this.props.getDetail(initialData.id);
        } else if (table || url) {
          if (table) {
            result = await Local.fetchDetail(this.props, table);
            // Handle RefFields
            if (refFields) {
              await Promise.all(result.data.map(async (subItem: any, index: number) => {
                await refFields.map(async (e: any) => {
                  result.data[index][e].data = await result.data[index][e].fetch();
                  return true;
                });
              }));
            }
          } else if (url) {
            result = await Server.fetchDetail(this.props, url);
          }
          // modifyData
          const modifyDataFn: any = _.findLast(this.modifyData, (o: any) => _.isUndefined(o.key));
          if (result && modifyDataFn && modifyDataFn.fn) {
            result.data = await modifyDataFn.fn(result.data);
          }
          this.setState(result);
        }
      }
    };

    setModifyData = (fn: (data: any) => any, key?: string) => {
      this.modifyData.push({
        key,
        fn
      });
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

    render() {
      let {
        loading,
        data,
        error
      } = this.state;

      if (redux) {
        loading = this.props.loading;
        data = this.props.data;
        error = this.props.error;
      }
      return (
        <WrappedComponent
          {...this.props as P}
          {...this.state}
          loading={loading}
          data={data}
          error={error}
          refetch={(key?: string) => this.refetch(false, key)}
          setData={this.setData}
          setUrl={this.setUrl}
          setModifyData={this.setModifyData}
        />
      );
    }
  }

  const customMapStateToProps = (state: any) => {
    let result: any = {};
    if (redux) {
      result = {
        loading: state[redux.constant.NAME][`${redux.constant.KEY}Loading`],
        data: state[redux.constant.NAME][`${redux.constant.KEY}Data`],
        error: state[redux.constant.NAME][`${redux.constant.KEY}Error`],
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
        getDetail: (id?: number) => dispatch(redux.dispatch(id)),
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
    connect(
      customMapStateToProps,
      customMapDispatchToProps,
      null,
      { forwardRef: true },
    )(WithDetail as any) as React.ComponentType<Omit<P, 'filter' | 'refresh' | 'setUrl' | 'refetch' | 'setData' | 'getList' | 'setModifyData' | 'loading' | 'data' | 'metadata' | 'error'>>;
  }
  return WithDetail as React.ComponentType<Omit<P, 'filter' | 'refresh' | 'setUrl' | 'refetch' | 'setData' | 'getList' | 'setModifyData' | 'loading' | 'data' | 'metadata' | 'error'>>;
};
export default withDetail;
