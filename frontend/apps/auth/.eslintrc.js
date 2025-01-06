module.exports = {
  extends: ['base'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './frontend/apps/auth/tsconfig.json',
      },
    },
  },
};
