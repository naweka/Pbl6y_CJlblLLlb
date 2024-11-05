import pluginMobx from 'eslint-plugin-mobx'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		plugins: { mobx: pluginMobx },
		rules: {
			// these values are the same as recommended
			'mobx/exhaustive-make-observable': 'warn',
			'mobx/unconditional-make-observable': 'error',
			'mobx/missing-make-observable': 'error',
			'mobx/missing-observer': 'off',
		},
	},
	{
		ignores: ['dist', '**/node_modules', 'env.d.ts'],
		settings: { react: { version: '18.3' } },
		files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			parserOptions: {
				project: ['./tsconfig.node.json', './tsconfig.app.json'],
				tsconfigRootDir: import.meta.dirname,
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			react,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
		},
	},
	eslintPluginPrettierRecommended,
)
