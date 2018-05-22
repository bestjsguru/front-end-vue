const path = require('path')
const pkg = require('./package')
const mode = process.env.NODE_ENV === 'production' ? 'error' : 'warn'

module.exports = {
  entry: [
    'src/polyfills.js',
    'src/index.js'
  ],
  html: {
    title: pkg.productName,
    description: pkg.description,
    template: path.join(__dirname, 'index.ejs')
  },
  postcss: {
    plugins: [
      // Your postcss plugins
    ]
  },
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-offline')({
      pwa: './src/pwa.js', // Path to pwa runtime entry
      pluginOptions: {} // Additional options for offline-plugin
    })
  ],
  parserOptions: {
    'parser': 'babel-eslint',
    'sourceType': 'module'
  },

  extends: [ 'eslint:recommended', 'plugin:vue/recommended' ],

}
