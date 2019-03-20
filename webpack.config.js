const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');

let webpackMode = process.env.WEBPACK_MODE;
let dev = webpackMode === 'development';

const config = {
  mode: webpackMode,
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: dev ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [dev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|mp3|ogg|oga|m4a|webm|woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.(xml)$/,
        use: ['xml-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'javascript app',
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src', 'favicon.png'),
      minify: dev ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    })
  ]
}

if (dev) {
  config.devServer = {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.plugins.push(new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
  }));
  config.plugins.push(new ImageminPlugin())
}

module.exports = config;