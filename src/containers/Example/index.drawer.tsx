import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from '@components';
import _ from 'lodash';
import Route from '@src/containers/routes';
import Text from './Text';
import Avatar from './Avatar';
import Button from './Button';
import ListCheckBox from './ListCheckBox';
import CheckBox from './CheckBox';
import ImagePickerButton from './Button/ImagePickerButton';
import Loading from './Loading';
import Image from './Image';
import FlatListStack from './FlatList/index.stack';
import Picker from './Picker';
import DateTimePicker from './DateTimePicker';
import Input from './Input';
import Form from './Form';
import Modal from './Modal';
import Map from './Map';

const Drawer = createDrawerNavigator();

const exampleList = [
  {
    name: Route.exampleStack.text,
    label: 'Text',
    component: Text,
    iconName: 'text',
  },
  {
    name: Route.exampleStack.avatar,
    label: 'Avatar',
    component: Avatar,
    iconName: 'person',
  },
  {
    name: Route.exampleStack.button,
    label: 'Button',
    component: Button,
    iconName: 'hand-right',
  },
  {
    name: Route.exampleStack.loading,
    label: 'Loading',
    component: Loading,
    iconName: 'reload',
  },
  {
    name: Route.exampleStack.flatList,
    label: 'FlatList',
    component: FlatListStack,
    iconName: 'list',
  },
  {
    name: Route.exampleStack.image,
    label: 'Image',
    component: Image,
    iconName: 'image',
  },
  {
    name: Route.exampleStack.imagePickerButton,
    label: 'Button (Image Picker)',
    component: ImagePickerButton,
    iconName: 'duplicate',
  },
  {
    name: Route.exampleStack.checkbox,
    label: 'CheckBox',
    component: CheckBox,
    iconName: 'checkbox',
  },
  {
    name: Route.exampleStack.listCheckbox,
    label: 'ListCheckBox',
    component: ListCheckBox,
    iconName: 'checkmark-done',
  },
  {
    name: Route.exampleStack.picker,
    label: 'Picker',
    component: Picker,
    iconName: 'caret-down-circle',
  },
  {
    name: Route.exampleStack.dateTimePicker,
    label: 'DateTime Picker',
    component: DateTimePicker,
    iconName: 'calendar',
  },
  {
    name: Route.exampleStack.input,
    label: 'Input',
    component: Input,
    iconName: 'create',
  },
  {
    name: Route.exampleStack.form,
    label: 'Form',
    component: Form,
    iconName: 'md-document-text',
  },
  {
    name: Route.exampleStack.modal,
    label: 'Modal',
    component: Modal,
    iconName: 'ios-copy',
  },
  {
    name: Route.exampleStack.map,
    label: 'Map',
    component: Map,
    iconName: 'md-location',
  },
];

function createExamples() {
  const list = _.sortBy(exampleList, ['label']);

  return list.map((e) => (
    <Drawer.Screen
      key={e.name}
      name={e.name}
      component={e.component}
      options={{
        drawerIcon: ({ color, size, focused }: any) => (
          <Icon
            name={focused ? e.iconName : `${e.iconName}-outline` as any}
            color={color}
            containerStyle={{ marginRight: -25 }}
            type="ionicon"
            size={size}
          />
        ),
        drawerLabel: e.label
      }}
    />
  ));
}

export default function ExampleDrawer() {
  return (
    <>{createExamples()}</>
  );
}
