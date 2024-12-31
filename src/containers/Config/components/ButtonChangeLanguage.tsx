import React from 'react';
import { changeLanguage, Language } from '@src/containers/Config/redux/slice';
import { useAppDispatch, useAppSelector } from '@utils/redux';
import { View } from 'react-native';
import { Button } from '@components';

const languages = [
  {
    title: 'English',
    code: 'en',
  },
  {
    title: 'Vietnamese',
    code: 'vi',
  }
] as { title: string, code: Language }[];

function renderButton(
  item:{ title: string, code: Language },
  selectedCode: Language,
  changeLanguageFn: (language: Language)=>any,
) {
  const selected = selectedCode === item.code;
  return (
    <Button
      key={item.code}
      title={item.title}
      titleStyle={{ fontWeight: selected ? 'bold' : 'normal' }}
      buttonStyle={{
        borderRadius: 30,
      }}
      containerStyle={{
        width: 150,
        marginHorizontal: 10,
      }}
      outline={!selected}
      onPress={() => changeLanguageFn(item.code)}
    />
  );
}

const ButtonChangeLanguage: React.FunctionComponent = () => {
  const language = useAppSelector((state) => state.config.language);
  const dispatch = useAppDispatch();
  const changeLanguageFn = (language: Language) => dispatch(changeLanguage(language));
  return (
    <View style={{ flexDirection: 'row' }}>
      {languages.map((e) => renderButton(e, language, changeLanguageFn))}
    </View>
  );
};

export default ButtonChangeLanguage;
