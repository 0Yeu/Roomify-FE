import React, { useState } from 'react';
import {
  QuickView, Text, Input, Button,
} from '@components';
import { useTheme } from 'react-native-elements';
import colors from '@themes/Color/colors';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import Api from '@utils/api';
import { setDataCreateProperty } from '@containers/Main/redux/slice';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';

interface Props {
  goNextPage?: () => any
  goPreviousPage?: () => any;
}

const Confirmation: React.FC<Props> = (props: Props) => {
  const { theme } = useTheme();
  const { goPreviousPage } = props;
  const dispatch = useAppDispatch();

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dataCreateProperty = useAppSelector(
    (state) => state.userConfig.dataCreateProperty
  );
  console.log('dataCreateProperty :>> ', dataCreateProperty);
  const [title, setTitle] = useState<string | null>(dataCreateProperty?.title);
  const [description, setDescription] = useState<string | null>(dataCreateProperty?.description);
  const handleSubmit = async () => {
    // setLoading(true);
    setError(null);
    if (title && title?.trim()?.length > 0 && description && description?.trim()?.length > 0) {
      const payload = { ...dataCreateProperty, title, description };
      console.log('payload :>> ', payload);
      try {
        const result = await Api.post('/properties', payload);
        console.log('result :>> ', result);
        dispatch(setDataCreateProperty(null));
        NavigationService.navigate(Routes.MY_LIST_PROPERTY);
      } catch (error) {
        console.log('error :>> ', error);
        setError(error);
      }
    } else {
      setLoading(false);
      setError('common:required_fields');
    }
  };

  return (
    <>
      <QuickView dismissKeyboard flex={1}>
        <Text marginVertical={20} fontSize={20} bold>Confirmation</Text>
        <Text marginTop={10} tText="Tiêu đề bài đăng" />
        <Input
          value={title || undefined}
          onChangeText={(text: string) => setTitle(text)}
          // value={address || undefined}
          backgroundColor="transparent"
          inputStyle={{ fontSize: 16 }}
          containerStyle={{
            paddingHorizontal: 0,
            borderWidth: 0,
          }}
          // onChangeText={(text: string) => setAddress(text)}
          inputContainerStyle={{
            borderColor: colors.black,
            borderBottomWidth: 1,
            // ...hasErrors('street'),
          }}
          placeholder="Ví dụ: Nhà cho thuê đường Nguyễn Lương Bằng"
        />
        <Text marginTop={10} tText="Nội dung mô tả" />
        <Input
          value={description || undefined}
          onChangeText={(text: string) => setDescription(text)}
          multiline
          // value={address || undefined}
          backgroundColor="transparent"
          inputStyle={{ fontSize: 16 }}
          containerStyle={{
            paddingHorizontal: 0,
            borderWidth: 0,
          }}
          // onChangeText={(text: string) => setAddress(text)}
          inputContainerStyle={{
            borderColor: colors.black,
            borderBottomWidth: 1,
            // ...hasErrors('street'),
          }}
          placeholder="Môi trường sống văn hóa, sạch sẽ ..."
        />
        {error && <Text marginTop={20} center error tText={error} />}
      </QuickView>
      <QuickView row justifyContent="space-between">
        <Button onPress={() => goPreviousPage?.()} containerStyle={{ width: '45%' }} outline title="Quay lại" />
        <Button onPress={handleSubmit} containerStyle={{ width: '45%' }} title="Đăng bài" />
      </QuickView>
    </>
  );
};

export default Confirmation;
