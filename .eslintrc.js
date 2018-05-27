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
	extends: ['airbnb']
}
