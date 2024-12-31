import React from 'react';
import {
  QuickView, Text, Header, Body, Icon,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import { DeviceEventEmitter, FlatList } from 'react-native';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import useFetch from '@src/hooks/useFetch';
import { useAppSelector } from '@utils/redux';

interface Props {
  city?: string;
  route?: any;
}

const SelectCity: React.FC<Props> = (props: Props) => {
  const { city, route } = props;
  const passData = route?.params;
  const cityData = useAppSelector(((state) => state.userConfig.cityData));
  let titleHeader = '';
  let data = [];
  let event = '';
  if (passData?.mode === 'CITY') {
    event = 'selectCity';
    data = cityData;
    titleHeader = 'field:select_city';
  }
  if (passData?.mode === 'DISTRICT' && passData?.cityId) {
    // data = cityData;
    const result = useFetch(`/destinations/city/${passData?.cityId}/district`, [], {}, 'result');
    data = result.data;
    titleHeader = 'field:select_district';
    event = 'selectDistrict';
  }
  if (passData?.mode === 'SUB_DISTRICT' && passData?.districtId) {
    // data = cityData;
    const result = useFetch(`/destinations/city/district/${passData?.districtId}/sub-district`, [], {}, 'result');
    data = result.data;
    titleHeader = 'field:select_district';
    event = 'selectSubDistrict';
  }

  const renderItem = ({ item }: { item: any }) => (
    <QuickView
      onPress={() => {
        DeviceEventEmitter.emit(event, item);
        NavigationService.goBack();
      }}
      row
      style={{ borderBottomWidth: 1, borderColor: '#CCDAFF', paddingVertical: 15 }}
    >
      <QuickView flex={1}>
        <Text>
          {item?.name}
        </Text>
      </QuickView>
      {item === city ? (
        <QuickView
          style={{ borderWidth: 2, borderColor: colors.white }}
          center
          backgroundColor={colors.secondary}
          width={20}
          height={20}
          borderRadius={20}
        >
          <Icon name="check" type="entypo" size={12} color={colors.white} />
        </QuickView>
      ) : null}
    </QuickView>
  );

  return (
    <>
      <Header backIcon tTitle={titleHeader} />
      <Body fullView={false}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item?.id}` || index.toString()}
        />
      </Body>
    </>
  );
};

export default SelectCity;
