import AppView from '@utils/appView';
import Helper from '@utils/helper';
import React from 'react';
import { View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-elements';
import { Text } from '@components';

type SectionProps = {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  center?: boolean;
  children: Element | Element[];
};

export default function Section(
  { title, containerStyle, textStyle, center, children }: SectionProps
) {
  const { theme } = useTheme();
  return (
    <View>
      <View style={[Helper.compact({
        justifyContent: 'center',
        alignItems: center ? 'center' : undefined,
        backgroundColor: theme.colors.secondary,
        marginBottom: 20,
        paddingVertical: 15,
      }), containerStyle]}
      >
        <Text style={[{
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center'
        }, textStyle]}
        >
          {title}
        </Text>
      </View>
      <View style={
        Helper.compact({
          alignItems: center ? 'center' : undefined,
          paddingHorizontal: AppView.bodyPaddingHorizontal,
        })
      }
      >
        {React.Children.map(children, (child) => <>{child}</>)}
      </View>
      <View style={{ height: 20 }} />
    </View>
  );
}

Section.defaultProps = {
  center: true,
};
