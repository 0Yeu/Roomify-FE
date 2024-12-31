import React, { useEffect, useRef, useState } from 'react';
import {
  QuickView, Text, ModalButton, ImagePickerButton, Button, Image, Loading,
} from '@components';
import colors from '@themes/Color/colors';
import IconSource from '@icons';
import { NavigationService } from '@utils/navigation';
import Routes from '@containers/routes';
import Server from '@utils/server';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { setDataCreateProperty } from '@containers/Main/redux/slice';
import AppView from '@utils/appView';

interface Props {
  goNextPage?: (value: number) => any
  goPreviousPage?: () => any;
}

const Utilities: React.FC<Props> = (props: Props) => {
  const { goNextPage, goPreviousPage } = props;
  const modalRef = useRef<any>(null);
  const [img, setImg] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const dataCreateProperty = useAppSelector(
    (state) => state.userConfig.dataCreateProperty
  );

  useEffect(() => {
    if (dataCreateProperty?.thumbnail) {
      setImg(dataCreateProperty?.thumbnail);
    }
  }, [dataCreateProperty]);

  const handleSuccessPickerImage = (imgs: Array<any>) => {
    if ((imgs || [])?.length > 0) {
      setImg(imgs[0]);
    }
    if (modalRef) modalRef?.current?.close();
  };

  const handleExceptionPickerImage = () => {
    if (modalRef) modalRef?.current?.close();
  };

  const renderButtomChildrenModal = () => {
    if (img) {
      return (
        <Image
          source={{ uri: typeof img === 'string' ? img : img?.path }}
          width={AppView.screenWidth - 40}
          height={200}
          // style={{ width: '100%', height: 200 }}
        />
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

  const handleNavigate = async () => {
    setError(null);
    setLoading(true);
    if (img) {
      if (img?.path) {
        const result: any = await Server.cloudinaryUploadSingle(img);
        setLoading(false);
        if (result?.secure_url) {
          dispatch(setDataCreateProperty(
            { ...dataCreateProperty, thumbnail: result?.secure_url, }
          ));
          goNextPage?.(3);
          return;
        }
      }
      setLoading(false);
      goNextPage?.(3);
    } else {
      setLoading(false);
      setError('common:required_fields');
    }
  };

  return (
    <>
      <QuickView flex={1}>
        <Text marginVertical={20} bold fontSize={20}>Hình ảnh</Text>
        {renderPickerComponent()}
        {error && <Text marginTop={20} center error tText={error} />}
      </QuickView>
      <QuickView row justifyContent="space-between">
        <Button onPress={() => goPreviousPage?.()} containerStyle={{ width: '45%' }} outline title="Quay lại" />
        <Button containerStyle={{ width: '45%' }} loading={loading} loadingProps={{ color: colors.white }} title="Tiếp theo" onPress={handleNavigate} />
      </QuickView>
      <Loading visible={loading} color="red" marginVertical={5} overlay />
    </>
  );
};

export default Utilities;
