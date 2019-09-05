module.exports = function override(config, env) {
  // Override the url-loader with the sprite loader which allows to load svg as we want
  config.module.rules[2].oneOf[0] = {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
  };

  return config;
}