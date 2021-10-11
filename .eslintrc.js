export default {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaFeatures': {
			'impliedStrict': true
		},
		'ecmaVersion': 13,
		'sourceType': 'module'
	},
	'rules': {
		'semi':['error', 'never'],
		'no-var': 'error',
		'quotes': ['error', 'single'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'always'],
		'space-in-brackets': ['error', 'always'],
		'sort-imports': [2, {
			'ignoreCase': true,
			'ignoreMemberSort': true,
			'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
		}],
		'indent': ['error', 'tab']
	}
}
