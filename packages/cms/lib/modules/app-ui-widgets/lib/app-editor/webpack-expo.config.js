const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function(env, argv) {
  console.log('argv', argv)
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.mode = 'production';

  config.output = {
          path: __dirname + '/../../../app-widgets/public/', //
          //	path: __dirname + '/dist',
          filename: 'js/index.js',
          //	filename: 'js/openstad-component.js',
          library: 'AppEditor',
          libraryTarget: 'window',
  };

  // Finally return the new config for the CLI to use.
  return config;
};
