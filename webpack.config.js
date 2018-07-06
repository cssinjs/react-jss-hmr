'use strict'

const webpack = require('webpack')

const env = process.env.NODE_ENV
const isDev = env === 'development'
const isTest = env === 'test'
const isProd = env === 'production'

const definitions = {
  __DEV__: isDev,
  __TEST__: isTest
}

if (isProd) {
  definitions['process.env.NODE_ENV'] = JSON.stringify(env)
}

const plugins = [
  new webpack.DefinePlugin(definitions)
]

let externals

if (!isTest) {
  externals = {
    react: 'React',
    'react-jss': {
      commonjs: 'react-jss',
      commonjs2: 'react-jss',
      amd: 'react-jss'
    }
  }
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    library: 'reactJssHmr',
    libraryTarget: 'umd'
  },
  plugins,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  externals,
  devtool: 'source-map'
}
