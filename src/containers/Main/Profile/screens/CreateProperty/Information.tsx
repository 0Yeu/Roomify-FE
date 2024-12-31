import React, { useRef, useState } from 'react';
import {
  QuickView, Text, ListCheckBox, CheckBox, Input, ErrorText, Button,
} from '@components';
import { Field, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import colors from '@themes/Color/colors';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { setDataCreateProperty } from '@containers/Main/redux/slice';

interface Props {
  goNextPage?: (value: number) => any;
}
const datas = [
  { id: 1, name: 'Phòng cho thuê' },
  { id: 2, name: 'Phòng ở ghép' },
  { id: 3, name: 'Căn hộ' },
  { id: 4, name: 'Nhà nguyên căn' },

];
const Information: React.FC<Props> = (props: Props) => {
  const { goNextPage } = props;
  const { t } = useTranslation();
  const data = useAppSelector(
    (state) => state.userConfig.dataCreateProperty
  );
  const [parking, setParking] = useState(false);
  const formRef = useRef(null);
  const dispatch = useAppDispatch();

  const formValidationSchema = Yup.object().shape({
    categoryId: Yup.number()
      .required(t('validator:required', { field: t('field:property_category') })),
    electricity: Yup.number()
      .required(t('validator:required', { field: t('field:electricity_fee') })),
    water: Yup.number()
      .required(t('validator:required', { field: t('field:water_fee') })),
    parking: Yup.number().nullable(),
    internet: Yup.number()
      .required(t('validator:required', { field: t('field:internet_fee') })),
  });

  const onSubmit = (values: any) => {
    const { categoryId, electricity, internet, parking, water } = values;
    // console.log('otherValues :>> ', otherValues);
    const body = {
      categoryId,
      policy: {
        electricity: +electricity,
        internet: +internet,
        parking: +parking || 0,
        water: +water,
      }
    };
    console.log('body :>> ', body);
    dispatch(setDataCreateProperty({ ...data, ...body }));
    goNextPage?.(1);
  };

  return (
    <>
      <QuickView scrollable>
        <Formik
          innerRef={formRef}
            // key={i18n.language}
          validationSchema={formValidationSchema}
          initialValues={{
            categoryId: data?.categoryId,
            electricity: data?.policy?.electricity,
            water: data?.policy?.water,
            parking: data?.policy?.parking || 0,
            internet: data?.policy?.internet,
          }}
          onSubmit={onSubmit}
        >
          {(formikProps) => (
            <>
              <Text bold fontSize={20} marginTop={10}>
                Thông tin phòng
              </Text>
              <Text fontSize={16} bold marginTop={10}>Loại phòng</Text>
              <ListCheckBox
                data={datas}
                single
                onChange={(value: any) => {
                  formikProps.setFieldTouched(
                    'categoryId',
                    true,
                  );
                  formikProps.setFieldValue('categoryId', value?.id);
                }}
                checkedColor={colors.error}
                defaultSingleValue={{ id: formikProps.values.categoryId }}
              />
              {formikProps.touched.categoryId
              && <ErrorText error={formikProps.errors.categoryId as string} />}
              <Text fontSize={16} bold marginTop={10}>
                Chi phí
              </Text>
              {/* Tiền điện */}
              <Text marginTop={10}>Tiền điện</Text>
              <QuickView row style={{ flexWrap: 'wrap' }}>
                <QuickView flex={1}>
                  <Field
                  // innerRef={emailInput}
                    value={`${formikProps.values.electricity || ''}`}
                    component={Input}
                    name="electricity"
                    tPlaceholder="field:electricity_fee"
                    keyboardType="number-pad"
                    outline
                  />
                </QuickView>
                <QuickView justifyContent="center" alignItems="flex-end" flex={0.3}>
                  <Text>VND</Text>
                </QuickView>
                <QuickView flex={1}>
                  <CheckBox
                    checked={formikProps.values.electricity === 0}
                    onValueChange={(value) => formikProps.setFieldValue('electricity', !value ? 0 : '')}
                    textStyle={{ fontWeight: 'normal' }}
                    containerStyle={{
                      marginLeft: 10,
                    }}
                    checkedColor={colors.primary}
                    title="Miễn phí"
                  />
                </QuickView>
              </QuickView>
              {/* Tiền nước */}
              <Text marginTop={10}>Tiền nước</Text>
              <QuickView row style={{ flexWrap: 'wrap' }}>
                <QuickView flex={1}>
                  <Field
                    value={`${formikProps.values.water || ''}`}
                  // innerRef={emailInput}
                    component={Input}
                    name="water"
                    tPlaceholder="field:water_fee"
                    keyboardType="number-pad"
                    outline
                  />
                </QuickView>
                <QuickView justifyContent="center" alignItems="flex-end" flex={0.3}>
                  <Text>VND</Text>
                </QuickView>
                <QuickView flex={1}>
                  <CheckBox
                    onValueChange={(value) => formikProps.setFieldValue('water', value ? 0 : '')}
                    textStyle={{ fontWeight: 'normal' }}
                    containerStyle={{
                      marginLeft: 10,
                    }}
                    checked={formikProps.values.water === 0}
                    checkedColor={colors.primary}
                    title="Miễn phí"
                  />
                </QuickView>
              </QuickView>
              {/* Internet */}
              <Text marginTop={10}>Internet</Text>
              <QuickView row style={{ flexWrap: 'wrap' }}>
                <QuickView flex={1}>
                  <Field
                    value={`${formikProps.values.internet || ''}`}
                  // innerRef={emailInput}
                    component={Input}
                    name="internet"
                    tPlaceholder="field:internet_fee"
                    keyboardType="number-pad"
                    outline
                  />
                </QuickView>
                <QuickView justifyContent="center" alignItems="flex-end" flex={0.3}>
                  <Text>VND</Text>
                </QuickView>
                <QuickView flex={1}>
                  <CheckBox
                    checked={formikProps.values.internet === 0}
                    onValueChange={(value) => formikProps.setFieldValue('internet', value ? 0 : '')}
                    textStyle={{ fontWeight: 'normal' }}
                    containerStyle={{
                      marginLeft: 10,
                    }}
                    checkedColor={colors.primary}
                    title="Miễn phí"
                  />
                </QuickView>
              </QuickView>
              {/* Chỗ để xe */}
              <QuickView>
                <CheckBox
                  containerStyle={{
                    borderWidth: 0,
                    marginLeft: 0,
                    paddingLeft: 0,
                    marginTop: 10,
                  }}
                  checked={parking}
                  checkedColor={colors.primary}
                  onPress={() => setParking(!parking)}
                  title="Có chỗ để xe"
                />
                {parking ? (
                  <QuickView>
                    <Text marginLeft={30} marginTop={10}>
                      Phí giữ xe
                    </Text>
                    <QuickView marginLeft={30} row style={{ flexWrap: 'wrap' }}>
                      <QuickView flex={1}>
                        <Field
                          value={formikProps.values.parking}
                  // innerRef={emailInput}
                          component={Input}
                          name="parking"
                          tPlaceholder="field:electricity_fee"
                          keyboardType="number-pad"
                          outline
                        />
                      </QuickView>
                      <QuickView justifyContent="center" alignItems="flex-end" flex={0.3}>
                        <Text>VND</Text>
                      </QuickView>
                      <QuickView flex={1}>
                        <CheckBox
                          checked={formikProps.values.parking === 0}
                          onValueChange={(value) => formikProps.setFieldValue('parking', value ? 0 : '')}
                          textStyle={{ fontWeight: 'normal' }}
                          containerStyle={{
                            marginLeft: 10,
                          }}
                          checkedColor={colors.primary}
                          title="Miễn phí"
                        />
                      </QuickView>
                    </QuickView>
                  </QuickView>
                ) : null}
              </QuickView>
              <Button disabled={!formikProps.values.categoryId} title="Tiếp theo" outline onPress={formikProps.handleSubmit} />
            </>
          )}
        </Formik>
      </QuickView>
    </>
  );
};

export default Information;
