import * as path from 'path';
import webpack from 'webpack';
import "webpack-dev-server"
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import dotenv from "dotenv"
import WriteFilePlugin from "write-file-webpack-plugin";
import envalid from "envalid";

import fs from "fs";
import {fileURLToPath} from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname)
// dotenv.config()
const {NODE_ENV} = process.env
const DEVELOPMENT = NODE_ENV === "development"
if (DEVELOPMENT) {
	dotenv.config({path: path.join(ROOT_DIR, ".env.development")})
} else if (NODE_ENV === "production") {
	dotenv.config({path: path.join(ROOT_DIR, ".env")})
} else {
	throw new Error("Set correct NODE_ENV")
}

const {str} = envalid
const env = envalid.cleanEnv(process.env, {
	NODE_ENV: str({choices: ['development', 'production']}),
	MAIN_SERVER_HOST: str()
})

const minimizer = [new TerserPlugin({ // for minify JS files and delete licence files.
	extractComments: false,
	terserOptions: {
		mangle: true,
		sourceMap: false
	},
})]
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);



const fallback = {
	buffer: require.resolve("buffer/"),
	"crypto": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
	"stream": require.resolve("stream-browserify"),
	"events": require.resolve("events"),

}


/** @type {webpack.Configuration} */
export const config = {
	devServer: {
		host: "localhost",
		port: 7777,
		devMiddleware: {
			writeToDisk: true,
			publicPath: path.join(ROOT_DIR, "dist"), // Публичный путь экспорта файлов
		},
		allowedHosts: "all",
		historyApiFallback: true
	},

	devtool: DEVELOPMENT ? "inline-source-map" : false,
	mode: env.NODE_ENV,
	entry: {
		popup: [path.join(ROOT_DIR, "src", "popup.tsx")],
		// worker: path.join(ROOT_DIR, "src", "worker.ts"),
		// content: path.join(ROOT_DIR, "src", "content.ts"),
	},
	output: {
		path: path.join(ROOT_DIR, "dist"),
		filename: "[name].js",
		publicPath: ""
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs"],
		fallback
	},

	optimization: {
		minimize: true,
		minimizer: DEVELOPMENT ? [] : minimizer,
	},
	module: {
		rules: [
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.m?js/,
				type: "javascript/auto",
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},

			{test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader'},
			{
				test: /\.svg$/,
				use: ["@svgr/webpack"]
			},
			{
				test: /\.html$/,
				loader: "html-loader",
				exclude: /node_modules/
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					configFile: path.join(ROOT_DIR, "tsconfig.json")
				},
			},
			{
				test: /\.(js)x?$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: JSON.parse(fs.readFileSync(path.join(ROOT_DIR, ".babelrc")))
			},
			{
				test: /\.(scss|css)$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							url: false
						}
					},
					"sass-loader"
				]
			},
		],

	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(NODE_ENV),
				MAIN_SERVER_HOST: JSON.stringify(env.MAIN_SERVER_HOST)
			}
		}),
		new CleanWebpackPlugin({ // Чистит build директорию.
			cleanStaleWebpackAssets: false
		}),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(ROOT_DIR, "src", "popup.html"),
			filename: "popup.html",
			chunks: ["popup"], // entrypoint

		}),
		// new HtmlWebpackPlugin({
		// 	template: path.join(__dirname, "src", "options.html"),
		// 	filename: "options.html",
		// 	chunks: ["options"]
		// }),
		new CopyWebpackPlugin({
			patterns: [
				// {from: "_locales", to: "_locales", noErrorOnMissing: true, },
				{from: "static", to: "static", noErrorOnMissing: true,},
				{from: "src/manifest.json", to: "manifest.json"},
			]
		}),
		new WriteFilePlugin(),
		new webpack.ProvidePlugin({
			process: 'process/browser', // install process
			Buffer: ['buffer', 'Buffer'],
		})
	]
}

export default config