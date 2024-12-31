import React, { useCallback, memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import ContactList from './ContactList';

interface DummyScreenProps {
  title: string;
  nextScreen: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
}

const createDummyScreen = ({
  nextScreen,
  type,
  count = 50,
}: DummyScreenProps) => memo(() => {
  const { navigate } = useNavigation();

  const handleNavigatePress = useCallback(() => {
    requestAnimationFrame(() => navigate(nextScreen));
  }, []);

  return (
    <ContactList
      key={`${type}.list`}
      count={count}
      type={type}
      onItemPress={handleNavigatePress}
    />
  );
});

export default createDummyScreen;
