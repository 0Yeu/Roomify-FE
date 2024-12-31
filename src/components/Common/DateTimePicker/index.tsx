import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import RNDateTimePicker, { IOSNativeProps, AndroidNativeProps } from '@react-native-community/datetimepicker';
import moment from 'moment';
import Modal from 'react-native-modal';
import { Divider, withTheme } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import AppView from '@utils/appView';
import { withTranslation } from 'react-i18next';
import ComponentHelper, { IComponentBase } from '@utils/component';
import Button, { ButtonProps } from '../Button/DefaultButton';
import QuickView from '../View/QuickView';
import Text from '../Text';

export type CustomType = {
  input: DateTimePickerProps,
};

type Mode = 'date' | 'time' | 'datetime';
type Display = 'compact' | 'inline' | 'spinner' | 'default';

export interface DateTimePickerProps extends
  IComponentBase<CustomType>,
  Omit<IOSNativeProps, 'mode' | 'display' | 'onChange' | 'value' | 'disabled'>,
  Omit<AndroidNativeProps, 'mode' | 'display' | 'value'>,
  Omit<ButtonProps, 'accessibilityActions' | 'accessibilityComponentType' | 'accessibilityElementsHidden' | 'accessibilityHint' | 'accessibilityIgnoresInvertColors' | 'accessibilityLabel' | 'accessibilityLiveRegion' | 'accessibilityRole' | 'accessibilityState' | 'accessibilityTraits' | 'accessibilityValue' | 'accessibilityViewIsModal' | 'accessible' | 'hasTVPreferredFocus' | 'hitSlop' | 'importantForAccessibility' | 'onAccessibilityAction' | 'onAccessibilityEscape' | 'onAccessibilityTap' | 'onLayout' | 'onMagicTap' | 'style' | 'testID' | 'tvParallaxProperties' | 'customType'>{
  mode?: Mode;
  display?: Display;
  momentFormat?: string;
  disabled?: boolean;
  value?: Date;
  placeholder?: string;
  placeholderTextColor?: string;
  onSubmit?: (dateTime: Date) => any;
  onClose?: () => any;
}
interface State {
  date: Date;
  tempDate: Date;
  hidePlaceholder: boolean;
  momentFormat: string;
  show: boolean;
  showTimeAndroid: boolean;
  language: string;
}

class DateTimePicker extends Component<DateTimePickerProps, State> {
  dateTimePickerRef: any;

  minWidth = 250;

  constructor(props: DateTimePickerProps) {
    super(props);
    const { mode, value, t, i18n } = this.handleProps();
    let momentFormat = 'MMM DD, YYYY hh:mm A';
    switch (mode) {
      case 'date':
        this.minWidth = 250;
        momentFormat = t('date_format');
        break;
      case 'time':
        this.minWidth = 150;
        momentFormat = t('time_format');
        break;
      case 'datetime':
        this.minWidth = 320;
        momentFormat = `${t('date_format')} ${t('time_format')}`;
        break;
      default:
        this.minWidth = 250;
        momentFormat = `${t('date_format')} ${t('time_format')}`;
    }
    this.state = {
      date: value || new Date(),
      tempDate: value || new Date(),
      show: false,
      showTimeAndroid: false,
      hidePlaceholder: false,
      momentFormat,
      language: i18n.language
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.i18n.language !== prevState.language) {
      const { mode, t } = nextProps;
      let momentFormat = 'MMM DD, YYYY hh:mm A';
      switch (mode) {
        case 'date':
          momentFormat = t('date_format');
          break;
        case 'time':
          momentFormat = t('time_format');
          break;
        case 'datetime':
          momentFormat = `${t('date_format')} ${t('time_format')}`;
          break;
        default:
          momentFormat = `${t('date_format')} ${t('time_format')}`;
      }
      moment.locale(nextProps.i18n.language);

      return {
        ...prevState,
        momentFormat,
        language: nextProps.i18n.language
      };
    }
    return prevState;
  }

  private handleProps = () => {
    const props = ComponentHelper.getProps<DateTimePickerProps>({
      initialProps: this.props,
      themeKey: 'DateTimePicker',
      keys: [
        'mode', 'display', 'value', 'locale', 'minuteInterval', 'timeZoneOffsetInMinutes',
        'textColor', 'iconRight', 'onChange', 'onSubmit', 'neutralButtonLabel', 'placeholder',
        'placeholderTextColor', 'titleColor', 'containerStyle', 'borderRadius', 'titlePosition'
      ]
    });
    ComponentHelper.handleShape(props);
    ComponentHelper.handleCommonProps(props, 'containerStyle');
    return props;
  };

  addTimeAndroid = (event: any, selectedDate: any) => {
    const { date } = this.state;
    const { onChange, onSubmit } = this.handleProps();
    const currentDate = selectedDate || date;

    const dateString = moment(date).format('YYYY-MM-DD');
    const timeString = moment(currentDate).format('hh:mm');
    const newDateString = `${dateString} ${timeString}`;
    const newDate = moment(newDateString, 'YYYY-MM-DD hh:mm').toDate();
    this.setState({
      date: newDate,
      showTimeAndroid: false
    });
    if (onChange) onChange(event, selectedDate);
    if (onSubmit) onSubmit(currentDate);
  };

  customOnChange = (event: any, selectedDate: any) => {
    const { date } = this.state;
    const { onSubmit, onChange, mode } = this.handleProps();
    const currentDate = selectedDate || date;
    switch (Platform.OS) {
      case 'ios':
        this.setState({ tempDate: currentDate });
        break;
      default:
        if (event.type === 'set') {
          this.setState({
            date: currentDate,
            show: false,
            hidePlaceholder: true,
          }, () => {
            if (mode === 'datetime') {
              this.setState({ showTimeAndroid: true });
            } else if (onSubmit) onSubmit(currentDate);
          });
        }
        if (event.type === 'dismissed') {
          this.setState({
            show: false,
          });
        }
    }
    if (onChange) onChange(event, selectedDate);
  };

  onDoneIOS = async () => {
    const { tempDate } = this.state;
    const { onSubmit } = this.handleProps();

    await this.setState({
      date: tempDate,
      show: false,
      hidePlaceholder: true,
    });

    // eslint-disable-next-line react/destructuring-assignment
    if (onSubmit) onSubmit(tempDate);
  };

  closeModal = () => {
    const { onClose } = this.props;
    this.setState({ show: false });
    if (onClose) onClose();
  };

  renderDateTime = () => {
    const { date, show } = this.state;
    /**
     * IOS
     */
    const {
      textColor: textColorProp,
      mode: modeProp,
      t,
      theme,
      ...otherHandledProps
    } = this.handleProps();
    const otherProps = { ...otherHandledProps, ...otherHandledProps.otherProps };

    if (Platform.OS === 'ios') {
      let timeStyle: any = {};
      if (otherProps.display === 'inline') {
        if (modeProp === 'time') {
          timeStyle = {
            alignSelf: 'center',
            width: 200,
            height: 80,
            marginVertical: 20,
          };
        } else {
          timeStyle = { marginVertical: 20 };
        }
      }

      return (
        <Modal
          isVisible={show}
          onBackdropPress={this.closeModal}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
        >
          <QuickView
            backgroundColor={theme.colors.white}
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <QuickView row alignItems="center">
              <Button
                tTitle="cancel"
                width={120}
                fontSize={20}
                clear
                containerStyle={{ flex: 1 }}
                onPress={this.closeModal}
              />
              <Text fontSize={20}>{this.getDateTimePlaceholder()}</Text>
              <Button
                tTitle="done"
                width={120}
                fontSize={20}
                clear
                containerStyle={{ flex: 1, alignItems: 'flex-end' }}
                onPress={() => this.onDoneIOS()}
              />
            </QuickView>
            <Divider />
            <QuickView style={timeStyle}>
              <RNDateTimePicker
                locale={t('key')}
                value={date}
                textColor={theme.colors.black}
                mode={modeProp}
                onChange={this.customOnChange}
                themeVariant={theme.colors.themeMode as any}
                {...otherProps}
              />
            </QuickView>
          </QuickView>
        </Modal>
      );
    }

    /**
     * Android
     */
    return (
      <RNDateTimePicker
        locale={t('key')}
        value={date}
        mode={modeProp}
        onChange={this.customOnChange}
        {...otherProps}
      />
    );
  };

  renderTimeAndroid = () => {
    const {
      textColor: textColorProp,
      mode: modeProp,
      t,
      theme,
      ...otherHandledProps
    } = this.handleProps();
    const { date } = this.state;
    const otherProps = { ...otherHandledProps, ...otherHandledProps.otherProps };
    return (
      <RNDateTimePicker
        {...otherProps}
        locale={t('key')}
        value={date}
        mode="time"
        onChange={this.addTimeAndroid}
      />
    );
  };

  customOnChangeIOS14 = (event: any, selectedDate: any) => {
    const { date } = this.state;
    const { onChange, onSubmit } = this.handleProps();
    const currentDate = selectedDate || date;
    this.setState({
      date: currentDate,
      show: Platform.OS === 'ios',
      hidePlaceholder: true,
    }, () => {
      if (onChange) onChange(event, selectedDate);
      // onSubmit(date: Date) = onChange() in iOS 14
      if (onSubmit) onSubmit(currentDate);
    });
  };

  renderDateTimeIOS14 = (dateString: string, titleColor: string) => {
    const { date } = this.state;
    const props = this.handleProps();
    const backgroundColor = props.backgroundColor || props.theme.colors.primary;
    const { titlePaddingVertical } = props.theme.Button;
    const containerStyle: any = StyleSheet.flatten([
      {
        minWidth: this.minWidth,
        borderRadius: props.borderRadius || AppView.roundedBorderRadius,
        backgroundColor,
        marginVertical: props.marginVertical,
        paddingVertical: titlePaddingVertical || 10 - 7, // 7 is titleHeight
        marginHorizontal: props.marginHorizontal,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
      },
      props.containerStyle
    ]);

    return (
      <QuickView style={containerStyle} shadow={props.otherProps.shadow}>
        <Button
          {...props.otherProps}
          title={dateString}
          titleColor={titleColor}
          marginVertical={0}
          backgroundColor="transparent"
          containerStyle={{ position: 'absolute' }}
          titlePosition={props.titlePosition}
          center={props.titlePosition === 'center'}
          shadow={false}
        />
        <QuickView style={{ opacity: 0 }}>
          <RNDateTimePicker
            locale={props.t('key')}
            value={date}
            style={{ opacity: 0.1, backgroundColor, marginHorizontal: 10, marginTop: 2 }}
            mode={props.mode}
            onChange={this.customOnChangeIOS14}
            display={props.display}
            themeVariant={props.theme.colors.themeMode as any}
            {...props.otherProps}
          />
        </QuickView>
      </QuickView>
    );
  };

  getValue = () => {
    const { hidePlaceholder, date } = this.state;
    const { value } = this.handleProps();

    if (!hidePlaceholder || !date) {
      if (value) return value;
      return null;
    }
    if (!hidePlaceholder) return null;
    return date;
  };

  focus = () => {
    this.dateTimePickerRef?.props.onPress();
  };

  clear = () => {
    this.setState({ hidePlaceholder: false });
  };

  getText = () => {
    const { hidePlaceholder, date, momentFormat } = this.state;
    const { value } = this.handleProps();

    if (!hidePlaceholder || !date) {
      if (value) return moment(value).format(momentFormat);
      return null;
    }
    if (!hidePlaceholder) return null;
    return moment(date).format(momentFormat);
  };

  getDateTimePlaceholder = () => {
    const { mode, t } = this.handleProps();
    const modeString = t(`component:date_time_picker:${mode}`);
    return t('component:date_time_picker:pick', { mode: modeString });
  };

  render() {
    const { show, showTimeAndroid, date, hidePlaceholder, momentFormat, language } = this.state;

    const props = this.handleProps();

    /**
     * Language Handle
     */
    let placeholder = '';
    if (!props.value) {
      if (props.placeholder) {
        placeholder = props.placeholder;
      } else {
        placeholder = this.getDateTimePlaceholder();
      }
    }
    /**
     * Color Handle
     */
    // eslint-disable-next-line prefer-destructuring
    let titleColor: any = props.titleColor;
    if (!hidePlaceholder && !props.value && props.placeholderTextColor) {
      titleColor = props.placeholderTextColor;
    }

    /**
     * Time Handle
     */
    const dateString = (hidePlaceholder || props.value)
      ? moment(date).locale(language).format(momentFormat)
      : placeholder;

    /**
     * iOS 14.0
     */
    if (Platform.OS === 'ios' && Number.parseFloat(DeviceInfo.getSystemVersion()) >= 14 && props.display === 'compact') {
      return this.renderDateTimeIOS14(dateString, titleColor);
    }

    return (
      <QuickView>
        <Button
          ref={(ref: any) => { this.dateTimePickerRef = ref; }}
          {...props.otherProps}
          onPress={() => {
            this.setState({ show: !show, tempDate: date });
          }}
          title={dateString}
          titleColor={titleColor}
          backgroundColor={props.backgroundColor}
          height={props.height}
          width={props.width}
          containerStyle={props.containerStyle}
          // titlePosition={show && Platform.OS === 'ios' ? 'center' : 'left'}
          titlePosition={props.titlePosition}
        />
        {show && this.renderDateTime()}
        {showTimeAndroid && this.renderTimeAndroid()}
      </QuickView>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(withTheme(
  DateTimePicker as any, ''
)) as unknown as React.ComponentClass<DateTimePickerProps>;
