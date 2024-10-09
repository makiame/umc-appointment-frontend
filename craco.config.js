const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Настройка JavaScript файлов
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: 'static/js/umc-appointment-bundle.js',
        chunkFilename: 'static/js/umc-appointment-chunk.[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
      };

      // Поиск плагина MiniCssExtractPlugin по имени и изменение его опций
      webpackConfig.plugins.forEach((plugin) => {
        if (plugin.constructor.name === 'MiniCssExtractPlugin') {
          // Изменяем имена CSS файлов
          plugin.options.filename = 'static/css/umc-appointment-bundle.css';
          plugin.options.chunkFilename = 'static/css/umc-appointment-chunk.[name].css';
        }
      });

      return webpackConfig;
    },
  },
};
