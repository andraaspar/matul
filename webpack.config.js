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

const commonNu = {
	...common,
	target: "web",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: "tsconfig-nu.json",
						},
					},
				],
			},
		],
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
	{
		...commonNu,
		entry: "./src/nu-matul.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "nu-matul.js",
			library: "matul",
		},
		optimization: {
			minimize: false,
		},
	},
	{
		...commonNu,
		entry: "./src/nu-matul.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "nu-matul.min.js",
			library: "matul",
		},
	},
	{
		...commonNu,
		entry: "./src/nu-core.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "nu-matul-core.js",
			library: "matul",
		},
		optimization: {
			minimize: false,
		},
	},
	{
		...commonNu,
		entry: "./src/nu-core.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "nu-matul-core.min.js",
			library: "matul",
		},
	},
];
