import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import AppView from '@utils/appView';
import { IHocFlatListProps, WithListProps } from '@utils/hocHelper';
import withPureList from '@components/Hoc/withList';
import Body from '@components/Common/View/Body';
import QuickView from '@components/Common/View/QuickView';
import Text from '@components/Common/Text';
import Icon from '@components/Common/Icon';
import Button from '@components/Common/Button/DefaultButton';
import Helper from '@utils/helper';
import _ from 'lodash';
import SearchInput from '@components/Common/Input/SearchInput';
import { Divider, withTheme } from 'react-native-elements';
import i18next from 'i18next';
import { TMetadata } from '@utils/appHelper';

interface Props extends WithListProps {
  close: () => any;
  pickerType?: 'default' | 'modal' | 'fullscreen';
  modalHeight?: number | string;
  placeholder?: string;
  server?: {
    url: string;
    labelField?: string;
    valueField: string;
    loadMore?: boolean;
  };
  labels?: Array<string | number>;
  values: Array<any>;
  // Single
  selectedIndex?: number | null;
  defaultIndex?: number | null;
  setSelectedIndex?: (index: number) => any;
  onValuePress?: (value: any, index: number) => any;
  onValueChange?: (itemValue: any, index: number) => void;
  // Multiple
  selectedIndexes?: number[] | [];
  defaultIndexes?: number[] | [];
  setSelectedIndexes?: (index: number[]) => any;
  onValuesChange?: (values: any[], indexes: number[]) => any;
  multiple?: boolean;
  pushLabels: (labels: any) => any;
  setLabels: (labels: any) => any;
  pushValues: (values: any) => any;
  setValues: (values: any) => any;
  pickerMetadata?: TMetadata;
  setPickerMetadata: (metadata: TMetadata) => any;
  pickerSearchText: string;
  setPickerSearchText: (text: string) => any;
  flatListProps?: IHocFlatListProps;
  modalTitle?: string;
  tModalTitle?: string | Array<any>;
}

interface State {
  labels: any;
  values: any;
  selectedIndexes?: number[]
}

class ModalPicker extends Component<Props, State> {
  searchInput: any;

  search = _.debounce(async (text: string) => {
    const { setPickerSearchText } = this.props;
    setPickerSearchText(text);
    this.searchInput.switchLoading();
    const { refresh } = this.props;
    refresh();
  }, 500);

  constructor(props: Props) {
    super(props);
    const {
      server,
      setUrl,
      setModifyData,
      labels,
      values,
      setData,
      setMetadata,
      pickerMetadata
    } = this.props;
    const itemLabels = labels || values;

    if (server) {
      setUrl(server.url);
      setModifyData(this.pushLabelsValuesAfterFetching);
    } else {
      setUrl('');
    }
    if (itemLabels) {
      setData(itemLabels);
    }
    if (pickerMetadata) {
      setMetadata(pickerMetadata);
    }
    this.state = {
      labels,
      values,
      selectedIndexes: this.getSelectedIndexes()
    };
  }

  pushLabelsValuesAfterFetching = (data: any) => {
    const { metadata, pickerType } = this.props;
    const { server, setValues, pushValues, pushLabels, setLabels, setPickerMetadata } = this.props;

    // Turn off loading of SearchInput in fullscreen Mode
    if (pickerType === 'fullscreen') {
      if (this.searchInput) this.searchInput.switchLoading(false);
    }

    if (server) {
      if (metadata) setPickerMetadata(metadata);

      const valuesResponseExpected = Helper.selectCollectionField(data, server.valueField);
      if (metadata?.page === 1) {
        this.setState({ values: valuesResponseExpected }, () => {
          const { values: newValues } = this.state;
          setValues(newValues);
        });
      } else {
        const { values } = this.state;
        const newStateValues = _.uniqWith([...values, ...valuesResponseExpected], _.isEqual);
        this.setState({ values: newStateValues }, () => {
          const { values: newValues } = this.state;
          // Change Parent Labels & Values
          pushValues(newValues);
        });
      }
      if (server.labelField) {
        const labelsResponseExpected = Helper.selectCollectionField(data, server.labelField);
        if (metadata?.page === 1) {
          this.setState({ labels: labelsResponseExpected }, () => {
            const { labels: newLabels } = this.state;
            setLabels(newLabels);
          });
        } else {
          const { labels } = this.state;
          const newStateLabels = _.uniqWith([...labels, ...labelsResponseExpected], _.isEqual);
          this.setState({ labels: newStateLabels }, () => {
            const { labels: newLabels } = this.state;
            pushLabels(newLabels);
          });
        }
        return labelsResponseExpected;
      }
      return valuesResponseExpected;
    }
    return data;
  };

  onPressItem = async (index: number) => {
    const {
      close,
      selectedIndex,
      setSelectedIndex,
      onValueChange,
      onValuePress,
      multiple
    } = this.props;
    const { values } = this.state;

    if (multiple) {
      const { selectedIndexes } = this.state;
      if (selectedIndexes) {
        const newSelectedIndex = [...selectedIndexes];
        const foundIndex = _.indexOf(newSelectedIndex, index);
        if (foundIndex !== -1) {
          newSelectedIndex.splice(foundIndex, 1);
        } else {
          newSelectedIndex.push(index);
        }
        this.setState({ selectedIndexes: newSelectedIndex });
      }
    } else {
      if (onValuePress) onValuePress(values[index], index);
      else if (selectedIndex !== index) {
        if (setSelectedIndex) await setSelectedIndex(index);
        if (onValueChange) { onValueChange(values[index], index); }
      }
      close();
    }
  };

  getSelectedIndex = () => {
    const { selectedIndex: selectedIndexProp, defaultIndex } = this.props;
    return !_.isNull(selectedIndexProp) ? selectedIndexProp : defaultIndex;
  };

  getSelectedIndexes = () => {
    const { selectedIndexes, defaultIndexes } = this.props;
    return !_.isEmpty(selectedIndexes) ? selectedIndexes : defaultIndexes;
  };

  renderItem = ({ item, index }: { item: any, index: number }) => {
    const { flatListProps } = this.props;
    if (flatListProps && flatListProps.renderItem) {
      const { selectedIndexes } = this.state;
      const selectedIndex = this.getSelectedIndex();
      const renderItemProps = { onPressItem: this.onPressItem, selectedIndex, selectedIndexes };
      return flatListProps.renderItem({ item, index }, renderItemProps);
    }

    const { server, multiple, pickerType, theme, values: valuesProp } = this.props;
    const { values: valuesState } = this.state;
    let title = item.toString();
    if (server) {
      const field = server.labelField || server.valueField;
      if (_.isObject(item)) {
        title = Helper.selectObjectField(item, field);
      }
    }

    let isChosen = false;
    if (pickerType === 'fullscreen') {
      if (server) {
        const selectedIndex = this.getSelectedIndex();
        if (typeof selectedIndex === 'number') {
          isChosen = valuesState[index] === valuesProp[selectedIndex];
        }
      }
    } else if (multiple) {
      const { selectedIndexes } = this.state;
      isChosen = _.includes(selectedIndexes, index);
    } else {
      const selectedIndex = this.getSelectedIndex();
      isChosen = selectedIndex === index;
    }

    return (
      <Button
        marginHorizontal={AppView.bodyPaddingHorizontal}
        clear={multiple || !isChosen}
        titlePaddingVertical={5}
        marginVertical={0}
        title={title}
        bold={false}
        titlePosition="right" // Actually it's "left" because iconRight is true
        onPress={() => this.onPressItem(index)}
        color={isChosen ? theme.colors.primary : theme.colors.black}
        icon={isChosen ? { name: 'check', color: theme.colors.primary } : undefined}
        iconRight
      />
    );
  };

  onChangeText = (text: string) => {
    const { filter, server } = this.props;
    if (server) {
      const searchField = server.labelField || server.valueField;
      filter.mergeFilter(searchField, '$contL', text);
      this.search(text);
    }
  };

  renderHeader = () => {
    const {
      placeholder,
      modalTitle,
      tModalTitle,
      multiple,
      setSelectedIndexes,
      close,
      pickerType
    } = this.props;
    let title: any = modalTitle || placeholder;
    if (!modalTitle && tModalTitle) title = typeof tModalTitle === 'string' ? i18next.t(tModalTitle) : i18next.t(tModalTitle[0], tModalTitle[1]);

    if (pickerType === 'fullscreen') {
      if (title) {
        return (
          <QuickView row justifyContent="space-between" marginTop={15} marginBottom={10} marginHorizontal={AppView.bodyPaddingHorizontal}>
            <QuickView width={30} />
            <Text h2 bold center>{title}</Text>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => close()}>
              <Icon name="close" size={30} />
            </TouchableOpacity>
          </QuickView>
        );
      }
      return null;
    }
    if (multiple) {
      if (title) {
        return (
          <QuickView>
            <QuickView row alignItems="center">
              <Button
                tTitle="cancel"
                width={120}
                fontSize={18}
                clear
                containerStyle={{ flex: 1 }}
                onPress={() => close()}
              />
              <Text h2>{title}</Text>
              <Button
                tTitle="done"
                width={120}
                fontSize={18}
                clear
                containerStyle={{ flex: 1, alignItems: 'flex-end' }}
                onPress={async () => {
                  const { onValuesChange } = this.props;
                  const { selectedIndexes } = this.state;
                  if (setSelectedIndexes && selectedIndexes) setSelectedIndexes(selectedIndexes);
                  const initialSelectedIndexes = this.getSelectedIndexes();
                  if (!_.isEqual(selectedIndexes, initialSelectedIndexes)) {
                    if (onValuesChange && selectedIndexes) {
                      const { values } = this.state;
                      const selectedValues: any = [];
                      selectedIndexes.forEach((selectedIndex) => {
                        selectedValues.push(values[selectedIndex]);
                      });
                      onValuesChange(selectedValues, selectedIndexes);
                    }
                  }
                  close();
                }}
              />
            </QuickView>
            <Divider />
          </QuickView>
        );
      }
      return <QuickView height={20} />;
    }
    if (title) {
      return (
        <QuickView>
          <QuickView row justifyContent="space-between" marginVertical={10} marginHorizontal={AppView.bodyPaddingHorizontal}>
            <QuickView width={30} />
            <Text h2 center>{title}</Text>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => close()}>
              <Icon name="close" size={25} />
            </TouchableOpacity>
          </QuickView>
          <Divider />
        </QuickView>
      );
    }
    return <QuickView height={20} />;
  };

  render() {
    const {
      pickerType,
      modalHeight,
      renderFlatList,
      flatListProps,
      pickerSearchText,
      theme
    } = this.props;

    if (!pickerType || pickerType === 'default' || pickerType === 'modal') {
      return (
        <SafeAreaView
          mode="padding"
          edges={['bottom']}
          style={{
            backgroundColor: theme.colors.grey3,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <QuickView height={modalHeight}>
            {this.renderHeader()}
            {renderFlatList({
              keyExtractor: (item, index) => `${index}`,
              rollToTop: false,
              refreshEnable: false,
              contentContainerStyle: { paddingVertical: 10 },
              ...flatListProps,
              renderItem: this.renderItem,
            })}
          </QuickView>
        </SafeAreaView>
      );
    }

    return (
      <>
        {this.renderHeader()}
        <Body fullWidth>
          <QuickView paddingHorizontal={AppView.bodyPaddingHorizontal}>
            <SearchInput
              ref={(ref: any) => { this.searchInput = ref; }}
              value={pickerSearchText}
              onChangeText={this.onChangeText}
            />
          </QuickView>
          {renderFlatList({
            keyExtractor: (item, index) => `${index}`,
            rollToTop: false,
            refreshEnable: false,
            ...flatListProps,
            renderItem: this.renderItem,
          })}
        </Body>
      </>
    );
  }
}

export default withPureList({})(withTheme(ModalPicker as any, '')) as any;
