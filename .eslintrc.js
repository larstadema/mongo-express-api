module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 1,
    'no-extra-boolean-cast': 0,
    'import/prefer-default-export': [0],
    'max-classes-per-file': 0,
  },
};
