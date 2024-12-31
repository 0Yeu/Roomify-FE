import React, { useEffect, useRef, useState } from 'react';
import {
  Text, Body, Input, Button, QuickView,
} from '@components';
import colors from '@themes/Color/colors';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import { DeviceEventEmitter } from 'react-native';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { setDataCreateProperty } from '@containers/Main/redux/slice';
import useFetch from '@src/hooks/useFetch';
import Api from '@utils/api';
import SelectLocation from '../../components/SelectLocation';

interface Props {
  goNextPage?: (value:number) => any;
  goPreviousPage?: () => any;
}

const Location: React.FC<Props> = (props: Props) => {
  const { goNextPage, goPreviousPage } = props;
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  const dataCreateProperty = useAppSelector(
    (state) => state.userConfig.dataCreateProperty
  );

  const { data } = useFetch(`/destinations/${dataCreateProperty?.destinationId}`, [], {}, undefined);

  const [city, setCity] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [subDistrict, setSubDistrict] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  // const [street, setStreet] = useState<string | null>(null);
  // const [houseNumber, setHouseNumber] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      console.log('hehe :>> ', data);
      const { parent, ...subDistrictData } = data;
      setSubDistrict(subDistrictData);
      if (parent?.parent) {
        const { parent: a, ...districtData } = parent;
        setDistrict(districtData);
        setCity(a);
        setAddress(dataCreateProperty?.address);
      }
    }
  }, [data]);

  useEffect(() => {
    const unsubscribeCity = DeviceEventEmitter.addListener('selectCity', (item) => {
      setCity(item);
      setDistrict(null);
    });
    const unsubscribeDistrict = DeviceEventEmitter.addListener('selectDistrict', (item) => {
      setDistrict(item);
      setSubDistrict(null);
    });
    const unsubscribeSubDistrict = DeviceEventEmitter.addListener('selectSubDistrict', (item) => {
      setSubDistrict(item);
      // setDistrict('Quận/ Huyện');
    });
    return { unsubscribeCity, unsubscribeDistrict, unsubscribeSubDistrict } as any;
  }, []);

  const handleSelectDistrict = () => {
    if (city?.id) {
      NavigationService.navigate(Routes.SELECT_LOCATION, { mode: 'DISTRICT', cityId: city?.id });
    }
  };

  const handleSelectSubDistrict = () => {
    if (district?.id) {
      NavigationService.navigate(Routes.SELECT_LOCATION, { mode: 'SUB_DISTRICT', districtId: district?.id });
    }
  };

  const handleData = async () => {
    setError(null);
    if (
      !city
      || !district
      || !subDistrict
      || address?.trim()?.length === 0
    ) {
      setError('common:required_fields');
    } else {
      console.log('city :>> ', city);
      console.log('district :>> ', district);
      console.log('subDistrict :>> ', subDistrict);

      const fullAddress = `${address}, ${subDistrict?.name}, ${district?.name}, ${city?.name}`;
      console.log('fullAdress :>> ', fullAddress);
      const result = await Api.get(`https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyBOdpPUJPzutcHJ7LWjMu4T7wfLp5kKBwM&address=${encodeURI(`${fullAddress}`)}`);
      console.log('result :>> ', result);
      // console.log('lng :>> ', result.results[0].geometry.location.lng);
      // console.log('lat :>> ', result.results[0].geometry.location.lat);
      const longitude = ((result?.results || [])?.length > 0
      && result?.results[0].geometry.location.lng) || 108.2021667;
      const latitude = ((result?.results || [])?.length > 0
      && result?.results[0].geometry.location.lat) || 16.0544068;
      const body = {
        destinationId: subDistrict?.id,
        longitude,
        latitude,
        address
      };
      console.log('body :>> ', body);
      // return;

      dispatch(setDataCreateProperty({ ...dataCreateProperty, ...body }));
      goNextPage?.(2);
    }
  };

  return (
    <QuickView flex={1}>
      <Body scrollable fullWidth showsVerticalScrollIndicator={false}>
        <Text fontSize={20} bold tText="profile:infor" />
        <SelectLocation
          onPress={() => NavigationService.navigate(Routes.SELECT_LOCATION, { mode: 'CITY' })}
          selectedLabel={city?.name}
          title="Thành phố"
        />
        <SelectLocation
          onPress={handleSelectDistrict}
          selectedLabel={district?.name}
          title="Quận"
        />
        <SelectLocation
          onPress={handleSelectSubDistrict}
          selectedLabel={subDistrict?.name}
          title="Phường/ Xã"
        />
        <Text marginTop={10} tText="field:street_name" />
        <Input
          value={address || undefined}
          backgroundColor="transparent"
          inputStyle={{ fontSize: 16 }}
          containerStyle={{
            paddingHorizontal: 0,
            borderWidth: 0,
          }}
          onChangeText={(text: string) => setAddress(text)}
          inputContainerStyle={{
            borderColor: colors.black,
            borderBottomWidth: 1,
            // ...hasErrors('street'),
          }}
          placeholder="Ví dụ: 244/21 Nguyễn Lương Bằng"
        />
        {/* <Text marginTop={10} tText="field:house_number" />
        <Input
          inputStyle={{ fontSize: 16 }}
          backgroundColor="transparent"
          inputContainerStyle={{
            borderColor: colors.black,
            borderBottomWidth: 1,
            // ...hasErrors('numberHouse'),
          }}
          onChangeText={(text: string) => setHouseNumber(text)}
          placeholder="Ví dụ: 244/21"
        /> */}
        {error && <Text marginTop={20} center error tText={error} />}
      </Body>

      <QuickView row justifyContent="space-between">
        <Button onPress={() => goPreviousPage?.()} containerStyle={{ width: '45%' }} outline title="Quay lại" />
        <Button
          containerStyle={{ width: '45%' }}
          title="Tiếp theo"
          onPress={handleData}
        />
      </QuickView>

    </QuickView>
  );
};

export default Location;
