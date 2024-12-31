import React, { useEffect, useRef, useState } from 'react';
import {
  QuickView,
  Text, Header, Body, Input, ModalButton, ImagePickerButton, Image, Button, ErrorText, Loading,
} from '@components';
import { IBase } from '@utils/appHelper';
import { useTheme } from 'react-native-elements';
import colors from '@themes/Color/colors';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import useFetch from '@src/hooks/useFetch';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppView from '@utils/appView';
import IconSource from '@icons';
import { DeviceEventEmitter, FlatList, View } from 'react-native';
import Api from '@utils/api';
import { NavigationService } from '@utils/navigation';
import RNFetchBlob from 'rn-fetch-blob';
import { EVENT_APP_EMIT } from '@utils/constant';

interface Props{
  route?: any
}

const CreateRoom: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const passData = route?.params;

  const modalRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const [img, setImg] = useState<any>(null);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [initData, setInitData] = useState<any>({
    name: '',
    description: '',
    price: '',
    area: '',
    images: [],
    amenityIds: [],
  });

  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { data: fetchData } = useFetch('/amenities', [], { limit: 100 }, 'result');
  const { data: room, loading } = useFetch(`/rooms/${passData?.roomId}`, [], {}, undefined);

  useEffect(() => {
    const valuesCopy = JSON.parse(JSON.stringify(fetchData));
    if ((room?.amenities || [])?.length > 0) {
      room?.amenities?.map((a: any) => {
        const index = valuesCopy.findIndex((n: any) => n?.id === a?.id);
        if (index !== -1) {
          valuesCopy[index].checked = !valuesCopy[index]?.checked;
        }
      });
    }
    if (formRef) {
      formRef?.current?.formikProps?.setFieldValue('amenityIds', [6, 7]);
      formRef?.current?.formikProps?.setFieldValue('name', 'title');
    }
    setData(valuesCopy);
    setImg(room?.images);
  }, [fetchData, room]);

  const formValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('validator:required', { field: t('field:title') })),
    description: Yup.string()
      .required(t('validator:required', { field: t('field:description') })),
    price: Yup.number()
      .required(t('validator:required', { field: t('field:price') })),
    area: Yup.number().nullable().required(t('validator:required', { field: t('field:area') })),
    images: Yup.array().min(1, t('validator:required', { field: t('field:image') })),
    amenityIds: Yup.array().min(1, t('validator:required', { field: t('field:amenity') }))
  });

  const cloudinaryUpload = async () => {
    const urlImgages: Array<any> = [];
    if (img?.every((urlI: any) => typeof urlI !== 'string')) {
      await Promise.all(
        img.map(async (i: any) => {
          try {
            await RNFetchBlob.fetch(
              'POST',
              'https://api.cloudinary.com/v1_1/dichakho/image/upload?upload_preset=roomify',
              {
                'Content-Type': 'multipart/form-data',
              },
              [
                {
                  name: 'file',
                  filename: i.filename,
                  data: RNFetchBlob.wrap(i.path),
                },
              ],
            )
              .then((res) => res.json())
              .then((response) => {
                console.log('Cloudinary response:', response);
                urlImgages.push(response?.secure_url);
              });
          } catch (err) {
            console.log('Upload Error:', err);
          }
        }),
      );
      return urlImgages;
    }
    return img;

    // return urlImgages;
  };

  const onSubmit = async (values: any) => {
    setLoadingCreate(true);
    const images = await cloudinaryUpload();
    console.log('iamges :>> ', images);
    const payload = {
      ...values,
      images,
      price: +values.price,
      area: +values.area,
      propertyId: passData?.propertyId
    };
    console.log('payload :>> ', payload);
    try {
      const result = passData?.roomId ? await Api.put(`/rooms/${passData?.roomId}`, payload) : await Api.post('/rooms', payload);
      if (result) {
        // this.setState({ loading: false, overlayIsVisible: true });
        DeviceEventEmitter.emit(EVENT_APP_EMIT.RELOAD_DETAIL_PROPERTY);
        NavigationService.goBack();
        setLoadingCreate(false);
      }
    } catch (error) {
      console.log('error', error);
      setLoadingCreate(false);
    }
  };

  const toggleItem = (id: number, formikProps: any) => {
    // const { data } = this.state;
    const valuesCopy = JSON.parse(JSON.stringify(data));
    const index = valuesCopy.findIndex((n: any) => n?.id === id);
    if (index !== -1) {
      valuesCopy[index].checked = !valuesCopy[index]?.checked;
    }
    if (formikProps)formikProps.setFieldValue('amenityIds', valuesCopy.filter((d: any) => d.checked).map((m: any) => m.id));
    setData(valuesCopy);
  };

  const handleSuccessPickerImage = (imgs: Array<any>, formikProps: any) => {
    setImg(imgs);
    if (formikProps) formikProps.setFieldValue('images', imgs);
    if (modalRef) modalRef?.current?.close();
  };

  const handleExceptionPickerImage = () => {
    if (modalRef) modalRef?.current?.close();
  };

  const handleCloseImage = (item: any, formikProps: any) => {
    const copyImg = JSON.parse(JSON.stringify(img));
    const index = copyImg.findIndex((c: any) => (item?.filname
      ? c.filename === item.filename : c === item));
    if (index > -1) {
      copyImg.splice(index, 1);
      setImg(copyImg);
      if (formikProps) formikProps.setFieldValue('images', copyImg);
    }
    // setImg();
    // if (formikProps) formikProps.setFieldValue('images', imgs);
  };

  const renderItemImage = (item: any, formikProps: any) => (
    <Image
      onClose={() => handleCloseImage(item, formikProps)}
      source={{ uri: typeof item === 'string' ? item : item?.path }}
      containerStyle={{ width: 130, height: 110, marginTop: 10 }}
      width={120}
      height={100}
    />
  );

  const renderButtomChildrenModal = () => (
    <QuickView marginBottom={10} borderRadius={20} center width="100%" height={200} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary }}>
      <IconSource.UploadImageIcon width={30} height={30} fill={colors.primary} />
      <Text marginTop={10} tText="component:editable_image:upload_photo" color={colors.primary} />
    </QuickView>
  );

  const renderPickerComponent = (formikProps: any) => (
    <>
      {img?.length > 0
        ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={img}
            renderItem={({ item }) => renderItemImage(item, formikProps)}
            ItemSeparatorComponent={() => <View style={{ margin: 10 }} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )
        : (
          <ModalButton
            onPress={() => formikProps.setFieldTouched('images', true)}
            ref={modalRef}
            title="Bottom-Half Modal"
            modalProps={{ type: 'bottom-half' }}
            invisible
            buttonChildren={renderButtomChildrenModal()}
          >
            <QuickView padding={20} borderRadius={20} backgroundColor={colors.white} height={200}>
              <QuickView width="25%" height={5} alignSelf="center" backgroundColor={colors.colorB1ADAD} borderRadius={5} />
              <Text marginVertical={20} center fontSize={20} bold tText="common:select" />
              <ImagePickerButton
                pickSuccess={(imgs) => handleSuccessPickerImage(imgs, formikProps)}
                handleException={handleExceptionPickerImage}
                invisible
                dataSource="camera"
                buttonChildren={<Text h2 tText="component:editable_image:take_photo" />}
              />
              <ImagePickerButton
                pickSuccess={(imgs) => handleSuccessPickerImage(imgs, formikProps)}
                handleException={handleExceptionPickerImage}
                invisible
                dataSource="gallery"
                multiple
                buttonChildren={<Text h2 tText="component:editable_image:select_from_album" />}
              />
            </QuickView>
          </ModalButton>
        )}
    </>
  );

  const renderError = (error?: any) => {
    if (error) return <ErrorText error={error} center={false} fontSize={12} marginTop={-10} />;
    return null;
  };

  const amenityDefaultIds = (room?.amenities || [])?.length > 0
    ? room?.amenities?.map((a: any) => a?.id) : [];
  if (loading) {
    return null;
  }
  return (
    <>
      <Header backIcon title="Tạo phòng" />
      <Formik
        innerRef={formRef}
            // key={i18n.language}
        validationSchema={formValidationSchema}
        initialValues={{
          name: room?.name || '',
          description: room?.description || '',
          price: room?.price || '',
          area: room?.area || '',
          images: room?.images || [],
          amenityIds: amenityDefaultIds,
        }}
        // initialValues={initData}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <Body fullWidth>
            <Body scrollable>
              {/*  Tiêu đề phòng */}
              <Field
                value={`${formikProps.values.name}`}
                component={Input}
                name="name"
                placeholder="Tiêu đề phòng"
                label=" Tiêu đề phòng"
              />
              {/* Nội dung mô tả */}
              <Field
                value={`${formikProps.values.description}`}
                component={Input}
                name="description"
                placeholder="Môi trường sống văn hóa, sạch sẽ ..."
              // outline
                multiline
                label="Nội dung mô tả"
              />
              {/* Giá tiền */}
              <Field
                keyboardType="number-pad"
                value={`${formikProps.values.price}`}
                component={Input}
                name="price"
                placeholder="Nhập giá tiền"
                label="Giá tiền"
              />
              {/* Diện tích */}
              <Field
                value={`${formikProps.values.area}`}
                component={Input}
                name="area"
                keyboardType="number-pad"
              // outline
                label="Diện tích"
                placeholder="Nhập diện tích"
              />
              {/* Hình ảnh */}
              <Text marginVertical={10}>Hình ảnh</Text>
              {renderPickerComponent(formikProps)}
              {formikProps.touched.images && renderError(formikProps.errors.images)}
              {/* Tiện ích */}
              <QuickView>
                <Text marginVertical={10}>Tiện ích</Text>
                <QuickView row justifyContent="space-between" style={{ flexWrap: 'wrap' }}>
                  {data.map((item: any) => (
                    <QuickView
                      key={item?.id}
                      backgroundColor={item.checked ? colors.white : '#E6E9F0'}
                      onPress={() => toggleItem(item.id, formikProps)}
                  // flex={1}
                      width="45%"
                      marginHorizontal={5}
                      marginVertical={10}
                      style={{
                        borderWidth: 1,
                        borderColor: item.checked ? colors.primary : '#E6E9F0',
                      }}
                      borderRadius={10}
                      padding={10}
                      row
                    >
                      <QuickView flex={1}>
                        <Icon
                          color={item.checked ? colors.primary : colors.grey6}
                          name={item.iconName}
                          type={item.iconType}
                          size={20}
                        />
                      </QuickView>
                      <QuickView flex={4}>
                        <Text
                          numberOfLines={1}
                          color={item.checked ? colors.primary : colors.grey6}
                        >
                          {item.name}
                        </Text>
                      </QuickView>
                    </QuickView>
                  ))}
                </QuickView>
              </QuickView>
              {renderError(formikProps.errors.amenityIds)}

            </Body>
            <Button
              marginTop={20}
              marginHorizontal={20}
              title={passData?.roomId ? 'Sửa phòng' : 'Đăng phòng'}
              onPress={formikProps.handleSubmit}
            />
          </Body>
        )}
      </Formik>
      <Loading visible={loadingCreate} color="red" marginVertical={5} overlay />
    </>
  );
};

export default CreateRoom;
