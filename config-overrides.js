module.exports = function override(config, env) {
  // Override the url-loader with the sprite loader which allows to load svg as we want
  if (config.module.rules[2] && config.module.rules[2].oneOf) {
    config.module.rules[2].oneOf[0] = {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
    };
  }

  return config;
}

module.exports.devServer = function(configFunction) {
  return function(proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    if (!config.proxy) config.proxy = {};
    config.proxy['/config'] = 'http://localhost:8080';
    return config;
  };
};