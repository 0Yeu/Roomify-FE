import React, { PureComponent } from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  RefreshControl,
} from 'react-native';
import { Icon, withTheme } from 'react-native-elements';
import _ from 'lodash';
import { Global, TError, TMetadata } from '@utils/appHelper';
import { TQuery } from '@utils/server';
import ErrorText from '@components/Custom/Text/ErrorText';
import Loading from '../../Loading';
import QuickView from '../../View/QuickView';
import Text from '../../Text';

export interface FlatListProps extends Omit<RNFlatListProps<any>, 'data'> {
  loadMore?: boolean;
  rollToTop?: boolean;
  refreshEnable?: boolean;
  loading?: boolean;
  data: ReadonlyArray<any> | null | undefined;
  metadata?: TMetadata;
  error?: TError;
  fetchData?: (query?: TQuery) => Promise<any>;
}
interface State {
  refreshing: boolean;
  page: number;
}

class FlatList extends PureComponent<FlatListProps, State> {
  static defaultProps = {
    showsVerticalScrollIndicator: false,
    onEndReachedThreshold: 0.5,
    loadMore: true,
    rollToTop: true,
    refreshEnable: true,
  };

  private flatListRef: any;

  constructor(props: FlatListProps) {
    super(props);
    const { metadata } = this.props;
    this.state = {
      refreshing: false,
      page: metadata?.page || 1,
    };
  }

  handleRefresh = async (silent: boolean = false) => {
    const { fetchData } = this.props;
    const { page } = this.state;
    if (fetchData) {
      if (silent) {
        await fetchData({ page: 1, limit: page * Global.perPage });
        this.setState({ refreshing: false });
      } else {
        this.setState({ page: 1, refreshing: !silent }, async () => {
          await fetchData({ page: 1 });
          this.setState({ refreshing: false });
        });
      }
    }
  };

  handleLoadMore = () => {
    const { loading, fetchData, metadata, loadMore, data } = this.props;
    if (loadMore && fetchData && metadata && !loading) {
      const { page: currentPage, pageCount } = metadata;
      if (currentPage !== pageCount && !loading) {
        this.setState(
          (prevState) => ({
            page: prevState.page + 1,
          }),
          () => {
            const { page } = this.state;
            if (currentPage < pageCount) {
              fetchData({ page });
            }
          },
        );
      }
    }
  };

  rollToTop = () => {
    if (this.flatListRef) {
      this.flatListRef.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  };

  renderFooter = () => {
    const {
      loading,
      data,
      fetchData,
      metadata,
      rollToTop,
    } = this.props;
    if (fetchData && metadata) {
      if (metadata.page === metadata.pageCount && !_.isEmpty(data)) {
        if (rollToTop) {
          return (
            <QuickView marginVertical={8}>
              <Icon
                name="up"
                type="antdesign"
                size={30}
                onPress={this.rollToTop}
              />
            </QuickView>
          );
        }
      }
      if (loading) return <Loading marginVertical={8} />;
    }
    return <QuickView height={20} />;
  };

  renderEmpty = () => {
    const { loading, horizontal, error } = this.props;
    if (!loading && !horizontal) {
      if (error) return <ErrorText error={error} />;
      return (
        <QuickView center>
          <QuickView marginVertical={10}>
            <Icon
              name="exclamationcircleo"
              type="antdesign"
              size={30}
            />
          </QuickView>
          <Text tText="component:flat_list:empty" marginBottom={10} />
        </QuickView>
      );
    }
    return (
      <QuickView flex={1} center>
        <Loading />
      </QuickView>
    );
  };

  render() {
    const {
      fetchData,
      refreshEnable,
      ListEmptyComponent,
      ...otherProps
    } = this.props;

    // Animation & Refresh
    if (fetchData) {
      const { refreshing } = this.state;
      return (
        <RNFlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          keyExtractor={(item, index) => `${item.id || index}`}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderFooter}
          refreshControl={refreshEnable ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
              size={5}
              colors={['blue', 'green']}
            />
          ) : undefined}
          ListEmptyComponent={this.renderEmpty}
          {...otherProps}
        />
      );
    }

    return (
      <RNFlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListEmptyComponent={this.renderEmpty}
        {...otherProps}
      />
    );
  }
}

export default withTheme(FlatList as any, '') as unknown as React.ComponentClass<FlatListProps>;
