const path = require('path')
const Ugly = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: [
    path.resolve('./game.js')
  ],
  output: {
    filename: 'main.js',
    path: path.resolve('./build')
  },
  plugins: [
    new Ugly()
  ]
}
