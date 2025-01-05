import { Header } from '@components';
import firestore from '@react-native-firebase/firestore';
import colors from '@themes/Color/colors';
import { IBase } from '@utils/appHelper';
import { useAppSelector } from '@utils/redux';
import React, { useCallback, useEffect, useState } from 'react';
import { Bubble, BubbleProps, GiftedChat, IMessage } from 'react-native-gifted-chat';

interface Props extends IBase {
  route: any
}
const ChatRoom: React.FC<Props> = (props: Props) => {
  const { route } = props;
  const room = route?.params;
  const auth = useAppSelector(state => state.auth);
  const [messages, setMessages] = useState<IMessage[]>([]);

  // useEffect(() => { });
  console.log('auth :>> ', auth);
  console.log('room :>> ', room);
  console.log('room id :>> ', room.room.id);
  console.log('room userId :>> ', room.room.userId);
  const collection = firestore().collection("chats").doc(`${room.room.id}`).collection(`${room.room.userId}`);

  useEffect(() => {
    const unsubscribe = collection.orderBy("createdAt", "desc").onSnapshot(snapshot => setMessages(
      snapshot.docs.map(doc => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt ? new Date(firebaseData.createdAt.toDate().toLocaleString()) : new Date(),
          user: {
            _id: firebaseData.user._id,
            name: firebaseData.user.name,
            avatar: firebaseData.user.avatar,
          },
        };
        console.log('data :>> ', data);
        return data;
      })
    ));

    return () => {
      unsubscribe();
    };
  }, [props]);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const { text, user } = messages[0];
    collection.add({
      text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user,
    });
  }, []);

  return (
    <>
      <Header backIcon title={room.room.room.name} />
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        renderBubble={(props: BubbleProps<IMessage>) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: colors.primary,
                },
              } as BubbleProps<IMessage>['wrapperStyle']}
            />
          );
        }}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth?.loginData?.id,
          name: auth?.loginData?.fullName,
          avatar: auth?.loginData?.avatar,
        }}
      />
    </>
  );
};

export default ChatRoom;
