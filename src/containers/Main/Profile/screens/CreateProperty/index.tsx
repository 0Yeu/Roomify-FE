/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  QuickView, Text, Header, Body,
} from '@components';
import StepIndicator from 'react-native-step-indicator';
import { KeyboardAvoidingView, Platform } from 'react-native';
import colors from '@themes/Color/colors';
import Information from './Information';
import Location from './Location';
import Utilities from './Utilities';
import Confirmation from './Confirmation';

const labels = ['Thông tin', 'Địa chỉ', 'Hình ảnh', 'Xác nhận'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.primary,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: colors.primary,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: colors.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: colors.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: colors.primary,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: colors.primary,
};
enum ContentEnum {
  INFORMATION = 0,
  LOCATION,
  UTILITIES,
  CONFIRMATION,
}
interface Props {
  clear: () => any;

}
interface State {
  currentPosition: number;
}
class CreatePropertyScreen extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPosition: 0,
    };
  }

  onPageChange = (position: number) => {
    this.setState({ currentPosition: position });
  };

  goNextPage = (value: any) => {
    // const { currentPosition } = this.state;
    // console.log('currentPosition :>> ', currentPosition);
    // this.setState({ currentPosition: currentPosition + 1 });
    this.setState({ currentPosition: value });
  };

  goPreviousPage = () => {
    const { currentPosition } = this.state;
    this.setState({ currentPosition: currentPosition - 1 });
  };

  renderViewPagerPage = (data: any) => {
    let content: any;
    switch (data) {
      case ContentEnum.INFORMATION:
        content = <Information goNextPage={this.goNextPage} />;
        break;
      case ContentEnum.LOCATION:
        content = <Location goNextPage={this.goNextPage} goPreviousPage={this.goPreviousPage} />;
        break;
      case ContentEnum.UTILITIES:
        content = <Utilities goNextPage={this.goNextPage} goPreviousPage={this.goPreviousPage} />;
        break;
      case ContentEnum.CONFIRMATION:
        content = <Confirmation goPreviousPage={this.goPreviousPage} />;
        break;

      default:
        content = <Information goNextPage={this.goNextPage} />;
        break;
    }
    return content;
  };

  render() {
    const { currentPosition } = this.state;

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <>
          <Header backIcon title="Tạo bài đăng" />
          <Body>
            <QuickView marginTop={20}>
              <StepIndicator
                stepCount={4}
                customStyles={customStyles}
                currentPosition={currentPosition}
                labels={labels}
                // onPress={(position) => this.onPageChange(position)}
              />
            </QuickView>

            {this.renderViewPagerPage(currentPosition)}
            {/* <Swiper
            // style={{ flexGrow: 1 }}
            loop={false}
            index={currentPosition}
            autoplay={false}
            // showsButtons
            onIndexChanged={(position) => this.onPageChange(position)}>
            {labels.map((page) => this.renderViewPagerPage(page))}
          </Swiper> */}
          </Body>
        </>
      </KeyboardAvoidingView>
    );
  }
}

export default CreatePropertyScreen;
