module.exports = {
  root: true,
  // extends: '@react-native-community',
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'only-warn'],
  rules: {
    // 'max-len': ["error", {"code": 150}],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'react/static-property-placement': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'global-require': 0,
    'no-param-reassign': 0,
    'object-curly-newline': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    // 'react/jsx-closing-bracket-location': [
    //   1,
    //   {selfClosing: 'line-aligned', nonEmpty: 'after-props'},
    // ],
    // Fix Package Bugs (Definition for rule '...' was not found.)
    '@typescript-eslint/no-redeclare': 0,
    '@typescript-eslint/comma-dangle': 0,
    '@typescript-eslint/no-loop-func': 0,
    '@typescript-eslint/no-shadow': 0,
    'jsx-a11y/accessible-emoji': 0,
  },
};
