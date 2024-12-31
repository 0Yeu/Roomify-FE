/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import { PickerProps as RNPickerProps, ActionSheetIOS, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import AppView from '@utils/appView';
import { withTheme } from 'react-native-elements';
import Helper from '@utils/helper';
import Server from '@utils/server';
import { IHocFlatListProps } from '@utils/hocHelper';
import { TMetadata } from '@utils/appHelper';
import { withTranslation } from 'react-i18next';
import ComponentHelper, { IComponentBase, TReturnGetProps } from '@utils/component';
import { FieldInputProps, useFormik } from 'formik';
import Button from '../Button/DefaultButton';
import QuickView from '../View/QuickView';
import ModalButton, { ModalButtonProps } from '../Button/ModalButton';
import ModalPicker from './components/ModalPicker';

export type CustomType = {
  input: PickerProps,
};

export interface PickerProps extends RNPickerProps, Omit<ModalButtonProps, 'style' | 'customType'>, IComponentBase<CustomType> {
  labels?: Array<string | number>;
  values?: Array<any>;
  selectedIndex?: number;
  selectedIndexes?: number[];
  selectedValues?: any[];
  onValuesChange?: (values: any[], indexes: number[]) => any;
  placeholder?: string;
  tPlaceholder?: string | Array<any>;
  placeholderTextColor?: string;
  modalTitle?: string;
  tModalTitle?: string | Array<any>;
  width?: number | string;
  modalHeight?: number | string;
  modalHeightLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ;
  iconColor?: string;
  pickerType?: 'default' | 'modal' | 'fullscreen';
  onValuePress?: (value: any, index: number) => any;
  server?: {
    url: string;
    labelField?: string;
    valueField: string;
    loadMore?: boolean;
  };
  multiple?: boolean;
  flatListProps?: IHocFlatListProps;
  // Formik
  field?: FieldInputProps<any>;
  form?: ReturnType<typeof useFormik>;
}

interface State {
  selectedIndex: number | null; // For Single Select
  selectedIndexes: number[] | []; // For Multiple Select
  loading: boolean;
  labels?: Array<any>;
  values: Array<any>;
  pickerMetadata?: TMetadata;
  pickerSearchText: string;
}

class Picker extends PureComponent<PickerProps, State> {
  pickerRef: any;

  constructor(props: any) {
    super(props);
    const { labels, values, server } = this.props;

    this.state = {
      selectedIndex: null,
      selectedIndexes: [],
      loading: !!server,
      labels,
      values: values || [],
      pickerSearchText: ''
    };
  }

  async componentDidMount() {
    await this.handleServer();
  }

  private handleProps = () => {
    const props = ComponentHelper.getProps<PickerProps>({
      initialProps: this.props,
      themeKey: 'Picker',
      keys: [
        'placeholder', 'tPlaceholder', 'itemStyle', 'icon', 'titleStyle', 'titleProps',
        'buttonStyle', 'iconColor', 'pickerType', 'modalHeight', 'modalHeightLevel',
        'modalProps', 'iconContainerStyle', 'flatListProps', 'server', 'multiple',
        'onValuesChange', 'modalTitle', 'tModalTitle', 'titlePosition', 'color',
        'style', 'mode', 'sharp', 'rounded', 'circle', 'borderRadius', 'placeholderTextColor',
        'titleColor', 'onPress'
      ]
    });
    ComponentHelper.handleCommonProps(props, 'containerStyle');

    ComponentHelper.handleShape(props);
    this.translate(props);
    return props;
  };

  private translate = (props: TReturnGetProps<PickerProps>) => {
    /**
     * Translation
     */
    if (!props.placeholder && props.tPlaceholder) {
      if (typeof props.tPlaceholder === 'string') {
        props.placeholder = props.t(props.tPlaceholder);
      } else if (typeof props.tPlaceholder === 'object') {
        props.placeholder = props.t(props.tPlaceholder[0], props.tPlaceholder[1]);
      }
    }
  };

  handleServer = async () => {
    const { server } = this.props;
    if (server) {
      const response = await Server.fetchDetail(this.props, server.url);
      const { data } = response;
      const valuesResponseExpected = Helper.selectCollectionField(data, server.valueField);
      this.setState({ values: valuesResponseExpected });

      if (server.labelField) {
        const labelsResponseExpected = Helper.selectCollectionField(data, server.labelField);
        this.setState({ labels: labelsResponseExpected });
      }
      this.setState({ loading: false });
    }
  };

  getDefaultIndex = () => {
    const { selectedIndex, selectedValue } = this.props;
    const { values } = this.state;
    let defaultIndex: number | null = null;
    if (!_.isUndefined(selectedValue)) {
      defaultIndex = _.indexOf(values, selectedValue);
    } else if (!_.isUndefined(selectedIndex)) {
      defaultIndex = selectedIndex;
    }
    return defaultIndex;
  };

  getDefaultIndexes = () => {
    const { selectedIndexes, selectedValues } = this.props;
    const { values } = this.state;
    const defaultIndexes: number[] = [];
    if (_.isArray(selectedValues)) {
      selectedValues.forEach((e: any) => {
        defaultIndexes.push(_.indexOf(values, e));
      });
    } else if (_.isArray(selectedIndexes)) {
      selectedIndexes.forEach((e: any) => {
        defaultIndexes.push(e);
      });
    }
    return defaultIndexes;
  };

  getIndex = () => {
    const { placeholder, tPlaceholder, multiple } = this.props;
    const { selectedIndex } = this.state;
    if (!multiple) {
      if (selectedIndex === null) {
        const defaultIndex = this.getDefaultIndex();
        if (defaultIndex !== null) {
          return defaultIndex;
        }
        if (placeholder || tPlaceholder) {
          return null;
        } return 0;
      }
      if (Platform.OS === 'android' && selectedIndex < 0) return null;
      return selectedIndex;
    }
    // eslint-disable-next-line no-console
    console.warn('Cannot call getIndex() when multiple is true');
    return null;
  };

  getIndexes = () => {
    const { placeholder, tPlaceholder, multiple } = this.props;
    const { selectedIndexes } = this.state;
    if (multiple) {
      if (_.isEmpty(selectedIndexes)) {
        const defaultIndexes = this.getDefaultIndexes();
        if (!_.isEmpty(defaultIndexes)) {
          return defaultIndexes;
        }
        if (placeholder || tPlaceholder) {
          return [];
        } return [0];
      }
      return selectedIndexes;
    }
    // eslint-disable-next-line no-console
    console.warn('Cannot call getIndexes() when multiple is false');
    return null;
  };

  getValue = () => {
    const { multiple } = this.props;
    if (!multiple) {
      const { values } = this.state;
      const selectedIndex = this.getIndex();
      if (selectedIndex === null) return null;
      return values[selectedIndex];
    }
    // eslint-disable-next-line no-console
    console.warn('Cannot call getValue() when multiple is true');
    return null;
  };

  getValues = () => {
    const { multiple } = this.props;
    const results: any[] = [];
    if (multiple) {
      const { values } = this.state;
      const selectedIndexes = this.getIndexes();
      if (_.isEmpty(selectedIndexes)) return [];
      selectedIndexes?.forEach((selectedIndex) => {
        results.push(values[selectedIndex]);
      });
      return results;
    }
    // eslint-disable-next-line no-console
    console.warn('Cannot call getValues() when multiple is false');
    return null;
  };

  getText = () => {
    const { multiple } = this.props;
    const { labels, values } = this.state;
    // Multiple
    if (multiple) {
      let result = '';
      const selectedIndexes = this.getIndexes();
      if (_.isEmpty(selectedIndexes)) return null;
      selectedIndexes?.forEach((selectedIndex) => {
        result += `${labels ? labels[selectedIndex] : values[selectedIndex]}, `;
      });
      if (result.length > 2) {
        return result.substring(0, result.length - 2);
      }
      return result;
    }
    // Single
    const selectedIndex = this.getIndex();
    if (selectedIndex === null) return null;
    return labels ? labels[selectedIndex] : values[selectedIndex];
  };

  open = () => {
    const { pickerType, server } = this.props;
    if (pickerType === 'fullscreen' || pickerType === 'modal' || server?.loadMore) {
      this.pickerRef?.open();
    } else if (Platform.OS === 'ios') {
      this.onPressActionSheetIOS();
    }
  };

  close = () => {
    if (this.pickerRef?.close) this.pickerRef?.close();
  };

  clear = () => {
    this.setState({ selectedIndex: null, selectedIndexes: [] });
  };

  focus = () => {
    const { pickerType, server } = this.props;
    if (pickerType === 'fullscreen' || pickerType === 'modal' || server?.loadMore) {
      this.open();
    }
    // Focus does not support android picker
  };

  /**
   * iOS
   */

  onPressActionSheetIOS = () => {
    const { labels, values } = this.state;
    const { t, onPress, otherProps: { onClose } } = this.handleProps();
    const itemLabel = labels || values;
    itemLabel.forEach((e, index) => { itemLabel[index] = e.toString(); });
    const newLabel: any = [...itemLabel, t('cancel')];
    if (onPress) onPress();
    return (
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: newLabel,
          cancelButtonIndex: values.length,
        },
        (buttonIndex: number) => {
          if (buttonIndex !== values.length) {
            const { selectedIndex } = this.state;
            const { onValueChange, onValuePress } = this.props;
            if (onValuePress) onValuePress(values[buttonIndex], buttonIndex); // Not Change State
            else if (selectedIndex !== buttonIndex) {
              this.setState({ selectedIndex: buttonIndex });
              if (onValueChange) { onValueChange(values[buttonIndex], buttonIndex); }
            }
          } else if (onClose) onClose();
        },
      )
    );
  };

  /**
   * Android
   */
  renderItemAndroid = () => {
    const {
      placeholder, theme,
    } = this.handleProps();
    const { labels: labelsState, values: valuesState } = this.state;
    let labels: any = labelsState;
    let values: any = valuesState;
    if (placeholder) {
      if (labels) labels = [placeholder, ...labels];
      values = [placeholder, ...values];
    }
    return values.map(
      (value: any, index: number) => {
        let color = theme.colors.primary;
        if (placeholder && index === 0 && color === theme.colors.primary) {
          color = theme.colors.grey3;
        }
        return (<RNPicker.Item key={index.toString()} color={color} label={labels ? labels[index] : value.toString()} value={value} />);
      }
    );
  };

  onValueChangeAndroid = (itemValue: ItemValue, itemIndex: number): void => {
    const { onValueChange, onValuePress, placeholder, tPlaceholder } = this.props;
    const { values } = this.state;
    if (onValuePress) onValuePress(values[itemIndex], itemIndex); // Not Change State
    else if (!placeholder && !tPlaceholder) {
      this.setState({ selectedIndex: itemIndex });
      if (onValueChange) { onValueChange(values[itemIndex], itemIndex); }
    } else {
      this.setState({ selectedIndex: itemIndex - 1 });
      if (itemIndex >= 1) { if (onValueChange) { onValueChange(values[itemIndex - 1], itemIndex - 1); } }
    }
  };

  setSelectedIndex = async (index: number | null) => this.setState({ selectedIndex: index });

  setSelectedIndexes = async (indexes: number[]) => this.setState({ selectedIndexes: indexes });

  private pushValues = (newValues: any) => {
    const { values } = this.state;
    const newStateValues = _.uniqWith([...values, ...newValues], _.isEqual);
    this.setState({ values: newStateValues });
  };

  private pushLabels = (newLabels: any) => {
    const { labels } = this.state;
    const defaultLabels = labels || [];
    const newStateLabels = _.uniqWith([...defaultLabels, ...newLabels], _.isEqual);
    this.setState({ labels: newStateLabels });
  };

  private setValues = (newValues: any) => {
    this.setState({ values: newValues });
  };

  private setLabels = (newLabels: any) => {
    this.setState({ labels: newLabels });
  };

  private setPickerMetadata = (newMetadata: TMetadata) => {
    this.setState({ pickerMetadata: newMetadata });
  };

  private setPickerSearchText = (newPickerSearchText: string) => {
    this.setState({ pickerSearchText: newPickerSearchText });
  };

  private closeModal = () => {
    this.pickerRef.close();
  };

  private isModalPicker = () => {
    const { pickerType, server, multiple } = this.props;
    return pickerType === 'fullscreen' || pickerType === 'modal' || server?.loadMore || multiple;
  };

  render() {
    const props = this.handleProps();
    const { loading, selectedIndex, selectedIndexes, labels, values, pickerMetadata, pickerSearchText } = this.state;

    /**
     * BUTTON PROPS (For iOS & Modal Picker)
     */

    /**
     * titleStyle, titleProps
     */
    const titleStyle: any = StyleSheet.flatten([
      { textAlign: 'left', flex: 9 },
      props.titleStyle,
    ]);
    const titleProps: any = _.merge(
      props.titleProps,
    );

    /**
     * buttonStyle
     */
    const buttonStyle: any = StyleSheet.flatten([
      props.titlePosition !== 'center' && { justifyContent: loading && !this.isModalPicker() ? 'center' : 'space-between' },
      props.buttonStyle,
    ]);

    /**
     * Icon
     */
    const { color } = this.props;
    const defaultIcon = {
      name: 'caretdown',
      type: 'antdesign',
      size: 15,
      color: props.iconColor || color,
    };
    const icon = _.merge(defaultIcon, props.icon);

    const iconContainerStyle = StyleSheet.flatten([
      { flex: 1 },
      props.iconContainerStyle
    ]);

    let modalType = 'bottom-half';
    switch (props.pickerType) {
      case 'fullscreen':
        modalType = 'fullscreen';
        break;
      case 'modal':
        modalType = 'bottom-half';
        break;
      default:
        modalType = 'bottom-half';
    }
    const modalProps = _.merge({ type: modalType, propagateSwipe: true }, props.modalProps);
    const modalHeight = props.modalHeight || ((props.modalHeightLevel || 7) / 10) * AppView.screenHeight;

    /**
     * currentLabel (iOS)
     */
    let currentLabel: any = '';
    const itemLabel: Array<any> = labels || values;

    // Multiple
    if (props.multiple) {
      const defaultIndexes = this.getDefaultIndexes();
      if (_.isEmpty(selectedIndexes)) {
        if (!_.isEmpty(defaultIndexes)) {
          defaultIndexes.forEach((defaultIndex) => {
            currentLabel += `${itemLabel[defaultIndex]}, `;
          });
        } else {
          currentLabel = props.placeholder || itemLabel[0];
        }
      } else if (_.includes(selectedIndexes, -1)) {
        currentLabel = props.placeholder || itemLabel[0];
      } else {
        selectedIndexes.forEach((selectedIndex) => {
          currentLabel += `${itemLabel[selectedIndex]}, `;
        });
      }

      if (currentLabel !== props.placeholder && currentLabel.length > 2) {
        currentLabel = currentLabel.substring(0, currentLabel.length - 2);
      }
      const titleColor = currentLabel === props.placeholder ? props.placeholderTextColor : props.titleColor;
      const { onValuesChange } = this.props;
      return (
        <ModalButton
          ref={(ref: any) => { this.pickerRef = ref; }}
          title={currentLabel.toString()}
          buttonStyle={buttonStyle}
          icon={icon}
          iconContainerStyle={iconContainerStyle}
          containerStyle={props.containerStyle}
          titleStyle={titleStyle}
          titleProps={titleProps}
          iconRight
          modalProps={modalProps}
          titleColor={titleColor}
          bold={false}
          {...props.otherProps}
        >
          <ModalPicker
            close={this.closeModal}
            pickerType={props.pickerType}
            modalHeight={modalHeight}
            placeholder={props.placeholder}
            server={props.server}
            labels={labels}
            pushLabels={this.pushLabels}
            setLabels={this.setLabels}
            values={values}
            pushValues={this.pushValues}
            setValues={this.setValues}
            setPickerMetadata={this.setPickerMetadata}
            pickerMetadata={pickerMetadata}
            setPickerSearchText={this.setPickerSearchText}
            pickerSearchText={pickerSearchText}
            selectedIndexes={selectedIndexes}
            defaultIndexes={defaultIndexes}
            setSelectedIndexes={this.setSelectedIndexes}
            onValuesChange={onValuesChange}
            flatListProps={props.flatListProps}
            multiple={props.multiple}
            modalTitle={props.modalTitle}
            tModalTitle={props.tModalTitle}
          />
        </ModalButton>
      );
    }

    // Single
    const defaultIndex = this.getDefaultIndex();
    if (selectedIndex === null) {
      if (defaultIndex !== null) {
        currentLabel = itemLabel[defaultIndex];
      } else {
        currentLabel = props.placeholder || itemLabel[0];
      }
    } else if (selectedIndex === -1) {
      currentLabel = props.placeholder || itemLabel[0];
    } else {
      currentLabel = itemLabel[selectedIndex];
    }
    if (!currentLabel) currentLabel = '';
    const titleColor = currentLabel === props.placeholder ? props.placeholderTextColor : props.titleColor;

    if (this.isModalPicker()) {
      const { onValueChange, onValuePress } = this.props;
      return (
        <ModalButton
          ref={(ref: any) => { this.pickerRef = ref; }}
          title={currentLabel.toString()}
          buttonStyle={buttonStyle}
          icon={icon}
          iconContainerStyle={iconContainerStyle}
          containerStyle={props.containerStyle}
          titleStyle={titleStyle}
          titleProps={titleProps}
          iconRight
          modalProps={modalProps}
          titleColor={titleColor}
          bold={false}
          {...props.otherProps}
        >
          <ModalPicker
            close={this.closeModal}
            pickerType={props.pickerType}
            modalHeight={modalHeight}
            placeholder={props.placeholder}
            server={props.server}
            labels={labels}
            pushLabels={this.pushLabels}
            setLabels={this.setLabels}
            values={values}
            pushValues={this.pushValues}
            setValues={this.setValues}
            setPickerMetadata={this.setPickerMetadata}
            pickerMetadata={pickerMetadata}
            setPickerSearchText={this.setPickerSearchText}
            pickerSearchText={pickerSearchText}
            selectedIndex={selectedIndex}
            defaultIndex={defaultIndex}
            setSelectedIndex={this.setSelectedIndex}
            onValuePress={onValuePress}
            onValueChange={onValueChange}
            flatListProps={props.flatListProps}
            multiple={props.multiple}
            modalTitle={props.modalTitle}
            tModalTitle={props.tModalTitle}
          />
        </ModalButton>
      );
    }

    if (Platform.OS === 'ios') {
      const { invisible, buttonChildren } = this.props;
      if (invisible) {
        return (
          <TouchableOpacity
            ref={(ref: any) => { this.pickerRef = ref; }}
            onPress={this.onPressActionSheetIOS}
          >
            {buttonChildren}
          </TouchableOpacity>
        );
      }

      return (
        <Button
          ref={(ref: any) => { this.pickerRef = ref; }}
          onPress={this.onPressActionSheetIOS}
          title={currentLabel}
          titleColor={titleColor}
          buttonStyle={buttonStyle}
          containerStyle={props.containerStyle}
          icon={icon}
          titleStyle={titleStyle}
          titleProps={titleProps}
          iconRight
          bold={false}
          backgroundColor={props.backgroundColor}
          color={props.color}
          {...props.otherProps}
          loading={loading}
          titlePosition="left"
          width={props.width}
          height={props.height}
        />
      );
    }

    /**
     * Android
     */

    /**
     * currentValue
     */
    let currentValue: any = '';
    if (selectedIndex === null) {
      if (defaultIndex !== null) {
        currentValue = values[defaultIndex];
      } else {
        currentValue = props.placeholder || values[0];
      }
    } else {
      currentValue = values[selectedIndex];
    }

    const { shadow } = this.props;

    return (
      <QuickView style={[{ justifyContent: 'center', marginTop: 10 }, props.containerStyle]}>
        <QuickView position="absolute" width="100%">
          <Button
            ref={(ref: any) => { this.pickerRef = ref; }}
            title={currentLabel}
            titleColor={titleColor}
            buttonStyle={[buttonStyle, { marginTop: -5 }]}
            containerStyle={[props.containerStyle, { backgroundColor: 'transparent' }]}
            icon={icon}
            titleStyle={[titleStyle, { marginTop: 2 }]}
            titleProps={titleProps}
            iconRight
            bold={false}
            backgroundColor={props.backgroundColor}
            color={props.color}
            {...props.otherProps}
            loading={loading}
            titlePosition="left"
            TouchableComponent={View}
            width={props.width}
            height={props.height}
          />
        </QuickView>
        <RNPicker
          ref={(ref: any) => { this.pickerRef = ref; }}
          selectedValue={currentValue}
          mode={props.mode}
          onValueChange={this.onValueChangeAndroid}
          style={[{ opacity: 0, height: props.height || 40 }, shadow && { elevation: 20 }]}
        >
          {this.renderItemAndroid()}
        </RNPicker>
      </QuickView>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(
  Picker as any, ''
)) as unknown as React.ComponentClass<PickerProps>;
