module.exports = {
  extends: ['base'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './frontend/packages/common-types/tsconfig.json',
      },
    },
  },
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
};
