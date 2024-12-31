declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-config' {
  interface Env {
    PER_PAGE: string
    NODE_ENV: 'development' | 'staging' | 'production'
    API_URL: string
    SOCKET_URL: string
    GOOGLE_MAPS_API_KEY: string
    YOUTUBE_KEY: string
  }

  const Config: Env;
  export default Config;
}
