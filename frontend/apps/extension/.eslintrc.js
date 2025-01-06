module.exports = {
  extends: ['base'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './frontend/apps/extension/tsconfig.json',
      },
    },
  },
  env: {
    webextensions: true,
  },
};
