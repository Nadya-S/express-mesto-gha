module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
