module.exports = (api) => {
  let isProd = false;
  if (api && api.env) {
    isProd = api.env() === 'production';
  }
  let config = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['./'],
          cwd: 'babelrc',
          extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
          alias: {
            '@app': './src/app',
            '@configs': './src/core/configs',
            '@locales': './src/core/locales',
            '@containers': './src/containers',
            '@themes': './src/core/themes',
            '@utils': './src/core/utils',
            '@validators': './src/core/validators',
            '@core': './src/core',
            '@fonts': './src/assets/fonts',
            '@images': './src/assets/images',
            '@icons': './src/assets/icons',
            '@assets': './src/assets',
            '@components': './src/components',
            '@src': './src',
            '@hooks': "./src/hooks"
          },
        },
      ],
      ["lodash"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }], // WatermelonDB
      'react-native-reanimated/plugin', // React Native Reanimated
    ],
  };
  if (isProd) {
    config.plugins.push(['transform-remove-console']);
  }

  return config;
};
