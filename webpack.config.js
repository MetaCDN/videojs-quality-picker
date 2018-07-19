/* eslint-disable */
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    context: `${__dirname}/lib`,
    entry: './vjs-quality-picker',
    output: {
        path: isDev ? `${__dirname}/example` : `${__dirname}/dist`,
        filename: 'vjs-quality-picker.js'
    },
    module: {
      loaders: [{
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/
      }]
    },
    devServer: isDev ? {
      contentBase: __dirname,
      publicPath: '/dist/',
      inline: true,
      port: 8080,
    }: null,
};
