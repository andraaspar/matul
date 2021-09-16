const path = require("path");

const common = {
	mode: "production",
	target: ["web", "es5"],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
	},
};

module.exports = [
	{
		...common,
		entry: "./src/matul.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
		optimization: {
			minimize: false,
		},
	},
	{
		...common,
		entry: "./src/matul.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul.min.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
	},
	{
		...common,
		entry: [
			"console-polyfill",
			"core-js/stable",
			"raf/polyfill",
			"whatwg-fetch",
			"./src/matul.ts",
		],
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul-compat.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
		optimization: {
			minimize: false,
		},
	},
	{
		...common,
		entry: [
			"console-polyfill",
			"core-js/stable",
			"raf/polyfill",
			"whatwg-fetch",
			"./src/matul.ts",
		],
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul-compat.min.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
	},
	{
		...common,
		entry: "./src/core.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul-core.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
		optimization: {
			minimize: false,
		},
	},
	{
		...common,
		entry: "./src/core.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "matul-core.min.js",
			library: {
				name: "matul",
				type: "umd",
			},
		},
	},
];
