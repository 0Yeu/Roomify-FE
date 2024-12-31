import React, { useRef, useState } from 'react';
import {
  QuickView, Text, Header, Body, Button, Input, ImagePickerButton, ModalButton, Image, Loading,
} from '@components';
import { Overlay } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import { NavigationService } from '@utils/navigation';
import colors from '@themes/Color/colors';
import IconSource from '@icons';
import _ from 'lodash';
import { FlatList } from 'react-native';
import Api from '@utils/api';
import AppView from '@utils/appView';
import Section from '@containers/Example/Section';

interface Props {}

const RegisterOwner: React.FC<Props> = (props: Props) => {
  const modalRef = useRef<any>(null);

  const [overlayIsVisible, setOverlayIsVisible] = useState(false);
  const [errorRegister, setErrorRegister] = useState<string | null>(null);
  const [lsImages, setLsImages] = useState<Array<any>>([]);
  const [name, setName] = useState<string | null>(null);
  const [IDNumber, setIDNumber] = useState<string | null>(null);
  const [checkNull, setCheckNull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const cloudinaryUpload = async () => {
    const urlImgages: Array<any> = [];
    await Promise.all(
      lsImages.map(async (i: any) => {
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
  };

  const handleRegisterOwner = async () => {
    setErrorRegister(null);
    setLoading(true);
    if (_.isEmpty(lsImages) || !name || !IDNumber) {
      setCheckNull(true);
    } else {
      const imgUrl = await cloudinaryUpload();
      const payload = {
        IDNumber,
        householdRegistrationImgs: imgUrl,
        nameOwner: name,
      };
      try {
        const result = await Api.post('/owner-registration', payload);
        // console.log('result :>> ', result);
        if (result?.status === 'PENDING') {
          // this.setState({ loading: false, overlayIsVisible: true });
          setLoading(false);
          setOverlayIsVisible(true);
        }
      } catch (error) {
        console.log('errorRegister', error);
        if (error?.statusCode === 400) {
          setErrorRegister(error?.message);
        } else if (error?.statusCode === 403) {
          setErrorRegister(error?.message);
        } else {
          setErrorRegister('Có lỗi xảy ra, vui lòng thử lại sau');
        }
        setOverlayIsVisible(true);
        setLoading(false);
        // this.setState({ errorRegister: error.message, overlayIsVisible: true });
      }
    }
  };

  const handleSuccessPickerImage = (imgs: Array<any>) => {
    setLsImages(imgs);
    if (modalRef) modalRef?.current?.close();
  };

  const handleExceptionPickerImage = () => {
    if (modalRef) modalRef?.current?.close();
  };

  const renderItemImages = ({ item }: { item: any }) => (
    <Image
      source={{ uri: item?.path }}
      width={200}
      height={150}
      marginRight={10}
      // borderRadius={20}
    />
  );

  const renderButtomChildrenModal = () => {
    if (lsImages?.length > 0) {
      return (
        <QuickView center backgroundColor={colors.primary} padding={15} borderRadius={15}>
          <Text bold color={colors.white}>Tải lại ảnh</Text>
        </QuickView>
      );
    }
    return (
      <QuickView borderRadius={20} center width="100%" height={200} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary }}>
        <IconSource.UploadImageIcon width={30} height={30} fill={colors.primary} />
        <Text marginTop={10} tText="component:editable_image:upload_photo" color={colors.primary} />
      </QuickView>
    );
  };

  const renderPickerComponent = () => (
    <>
      {lsImages?.length > 0 && (
      <QuickView>
        <FlatList
          style={{ height: 200 }}
          horizontal
          data={lsImages}
          renderItem={renderItemImages}
          keyExtractor={(item, index) => index.toString()}
        />
      </QuickView>
      )}
      <ModalButton
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
            pickSuccess={handleSuccessPickerImage}
            handleException={handleExceptionPickerImage}
            invisible
            dataSource="camera"
            buttonChildren={<Text h2 tText="component:editable_image:take_photo" />}
          />
          <ImagePickerButton
            multiple
            pickSuccess={handleSuccessPickerImage}
            handleException={handleExceptionPickerImage}
            invisible
            dataSource="gallery"
            buttonChildren={<Text h2 tText="component:editable_image:select_from_album" />}
          />
        </QuickView>
      </ModalButton>
    </>
  );

  return (
    <>
      <Overlay isVisible={overlayIsVisible} overlayStyle={{ borderRadius: 8, width: '80%' }}>
        <QuickView>
          <Text fontSize={18} center color={colors.primary} bold>Thông báo</Text>
          <Text marginVertical={10} center>
            {errorRegister || `Yêu cầu của bạn sẽ được quản trị viên
xét duyệt trong thời gian sớm nhất`}
          </Text>
          <QuickView paddingHorizontal={80}>
            <Button
              title="Đóng"
              onPress={() => {
                setOverlayIsVisible(false);
                NavigationService.goBack();
              }}
            />
          </QuickView>
        </QuickView>
      </Overlay>
      <Header backIcon title="Đăng ký làm chủ nhà" />
      <Body>
        <QuickView scrollable flex={1}>
          <Input
            onChangeText={(text: string) => setName(text)}
            placeholder="Nhập tên chủ hộ"
            inputContainerStyle={{
              backgroundColor: colors.white
            }}
            labelProps={{ marginTop: 10 }}
            label="Tên chủ hộ"
          />
          <Input
            onChangeText={(text: string) => setIDNumber(text)}
            keyboardType="number-pad"
            inputContainerStyle={{
              backgroundColor: colors.white
            }}
            placeholder="Nhập số CMND"
            labelProps={{ marginTop: 10 }}
            label="Số chứng minh nhân dân"
          />
          <QuickView>
            <Text fontSize={16} bold style={{ color: '#757575', fontFamily: 'GoogleSans-Regular' }} marginVertical={10}>Hình ảnh sổ hộ khẩu</Text>
            {renderPickerComponent()}
          </QuickView>
        </QuickView>
        {checkNull ? <Text center error>Vui lòng nhập các trường còn trống </Text> : null}
        <Loading visible={loading} color="red" marginVertical={5} overlay />
        <Button
          loading={loading}
          marginVertical={10}
          title="Gửi"
          onPress={handleRegisterOwner}
        />
      </Body>

    </>
  );
};

export default RegisterOwner;
