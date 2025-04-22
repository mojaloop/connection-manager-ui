const path = require('path');

module.exports = function override(config, env) {
  configureSvgLoader(config);
  configurePathAliases(config);
  return config;
};

function configureSvgLoader(config) {
  try {
    const fileLoaderRule = config.module.rules.find(rule => 
      rule.oneOf && Array.isArray(rule.oneOf) && rule.oneOf.some(oneOf => 
        oneOf.test && oneOf.test.toString().includes('svg')
      )
    );

    if (!fileLoaderRule) {
      console.warn('Could not find SVG rule in webpack config');
      return;
    }

    const svgLoaderIndex = fileLoaderRule.oneOf.findIndex(oneOf => 
      oneOf.test && oneOf.test.toString().includes('svg')
    );
    
    if (svgLoaderIndex >= 0) {
      fileLoaderRule.oneOf[svgLoaderIndex] = {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      };
    } else {
      console.warn('Could not find SVG rule in oneOf array');
    }
  } catch (error) {
    console.error('Error configuring SVG loader:', error);
  }
}

function configurePathAliases(config) {
  const srcDirs = {
    'App': 'App',
    'Auth': 'Auth',
    'utils': 'utils',
    'components': 'components',
    'tests': 'tests',
    'reducers': 'reducers',
    'assets': 'assets',
    'icons': 'icons'
  };

  const aliases = Object.entries(srcDirs).reduce((acc, [alias, dir]) => {
    acc[alias] = path.resolve(__dirname, `src/${dir}`);
    return acc;
  }, {});

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      ...aliases
    }
  };
}

module.exports.devServer = function(configFunction) {
  return function(proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    if (!config.proxy) config.proxy = {};
    config.proxy['/config'] = 'http://localhost:8080';
    return config;
  };
};
