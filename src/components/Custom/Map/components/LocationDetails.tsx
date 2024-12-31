/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import Text from '@components/Common/Text';
import Button from '@components/Common/Button/DefaultButton';
import Icon from '@components/Common/Icon';

const keyExtractor = (item: string, index: number) => `${index}${item}`;
const photoSize = 180;

export const LOCATION_DETAILS_HEIGHT = 298;

interface LocationDetailsProps {
  onClose: () => void;
  id: string;
  name: string;
  address: string;
  photos: string[];
}

const LocationDetails = ({
  name,
  address,
  photos,
  onClose,
}: LocationDetailsProps) => {
  // #region renders
  const renderPhoto = useCallback(({ item }) => (
    <Image
      style={styles.photo}
      width={photoSize}
      height={photoSize / 1.5}
      resizeMode="cover"
      source={{ uri: item }}
    />
  ), []);
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContentContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <Icon type="antdesign" name="close" onPress={onClose} circle />
      </View>

      <Button
        title="Directions"
        marginHorizontal={15}
        onPress={() => {}}
      />

      <FlatList
        data={photos}
        horizontal
        renderItem={renderPhoto}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContentContainer}
      />

      <View style={styles.actionsContainer}>
        <Button
          title="Call"
          titleStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
        <Button
          title="Save"
          titleStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
        <Button
          title="Share"
          titleStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
      </View>
    </View>
  );
  // #endregion
};

const styles = StyleSheet.create({
  container: {},
  // header
  headerContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerContentContainer: {
    flexGrow: 1,
  },
  name: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
  },
  closeButton: {
    alignContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    padding: 0,
    margin: 0,
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 30,
  },
  // photos
  flatListContainer: {
    paddingVertical: 8,
  },
  flatListContentContainer: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 4,
  },
  photo: {
    width: photoSize,
    height: photoSize / 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  // actions
  actionsContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 40,
  },
  actionButtonLabel: {
    color: '#027AFF',
  },
});

export default LocationDetails;
