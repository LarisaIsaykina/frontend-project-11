
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));


export default {
  mode:  process.env.NODE_ENV || 'development',
  devtool: false,
  devServer: {
    open: true,
  },
  entry: './src/index.js',
  output: {
      filename: 'main.js',
      path: resolve(__dirname,  'dist')
 },

  module: {
    rules: [
   
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: 'url-loader?limit=10000',
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          use: 'file-loader',
        },
    
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html',
    }),
   
  ],
};
////////////////////////////////////////////////////////////////
