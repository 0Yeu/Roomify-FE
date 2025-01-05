import { useAppSelector } from '@utils/redux';
import React, { useEffect, useState } from 'react';
import ListChat from './ListChat';

interface Props { }
const ChatScreen: React.FC<Props> = () => {
  const auth = useAppSelector(state => state.auth);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Force re-render when auth changes
    setForceUpdate(prev => prev + 1);
  }, [auth]);

  return (
    <ListChat
      key={forceUpdate} // Add key to force re-render
    />
  );
};

export default ChatScreen;
