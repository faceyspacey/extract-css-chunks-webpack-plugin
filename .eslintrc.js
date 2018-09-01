module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            generators: true,
            experimentalObjectRestSpread: true
        },
        sourceType: 'module',
        allowImportExportEverywhere: false
    },
    extends: ['airbnb'],
    env: {
        'browser': true,
    },
    rules: {
        'no-param-reassign': 0,
        'func-names': 0,
        'no-underscore-dangle': 0,
        'no-restricted-syntax': 0,
        'prefer-arrow-callback': 0,
        'prefer-destructuring': 0,
        'array-callback-return': 0,
        'prefer-template': 0,
        'class-methods-use-this': 0
    }
};
