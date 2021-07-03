module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		commonjs: true,
		es6: true,
	},
	extends: [
		"leankit",
		"leankit/es6",
		"plugin:vue/base",
		"plugin:vue/essential",
	],
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	rules: {
		strict: [ "error", "global", ],
		"init-declarations": 0,
		"global-require": 0,
		indent: [ "error", "tab", ],
		"valid-jsdoc": "off", // valid-jsdoc is deprecated
		"comma-dangle": [ "error", {
			arrays: "always",
			objects: "always",
		}, ],
		"vue/no-unused-properties": [ "error", {
			groups: [ "props", "data", "computed", "methods", ],
		}, ],
		"vue/html-indent": [ "error", "tab", {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: true,
			ignores: [],
		}, ],
		"vue/script-indent": [ "error", "tab", {
			baseIndent: 0,
			switchCase: 0,
			ignores: [],
		}, ],
		"vue/no-multiple-template-root": "off",
	},
	overrides: [
		{
			files: [ "*.spec.js", ],
			rules: {
				"max-nested-callbacks": "off",
				camelcase: "off",
				"no-magic-numbers": "off",
				"no-console": "off",
				"max-lines": "off",
			},
			env: {
				mocha: true,
			},
		},
	],
};
