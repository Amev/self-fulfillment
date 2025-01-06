module.exports = {
  extends: ['base'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './frontend/apps/client/tsconfig.json',
      },
    },
  },
};
