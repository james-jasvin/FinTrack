module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'jest/globals': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'testing-library/no-render-in-setup': [
			'error',
			{'allowTestingFrameworkSetupHook': 'beforeAll'}
		]
	}
}
