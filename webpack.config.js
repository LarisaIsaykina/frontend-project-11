
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
       path: path.resolve(__dirname,  'dist')
   },

    devServer: {
        open: true,
      },
      
  mode: process.env.NODE_ENV || 'development',
  devtool: false,
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
