module.exports = function override(config, env) {
  // Override the url-loader with the sprite loader which allows to load svg as we want
  const svgLoaderFound = config.module.rules.some(rule => 
    rule.oneOf && rule.oneOf.some(oneOf => 
      oneOf.test && oneOf.test.toString().includes('svg')
    )
  );

  if (svgLoaderFound) {
    // Find the rule containing svg loader
    const ruleIndex = config.module.rules.findIndex(rule => 
      rule.oneOf && rule.oneOf.some(oneOf => 
        oneOf.test && oneOf.test.toString().includes('svg')
      )
    );

    if (ruleIndex !== -1 && config.module.rules[ruleIndex].oneOf) {
      // Update the svg loader configuration
      config.module.rules[ruleIndex].oneOf[0] = {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
      };
    }
  }

  // Add resolve configuration
  config.resolve = {
    ...config.resolve,
    modules: [
      'node_modules',
      `${process.cwd()}/src`
    ],
    alias: {
      ...config.resolve.alias
    }
  };

  // Add production-specific optimizations
  if (env === 'production') {
    // Optimize chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      }
    };
  }

  return config;
}

module.exports.devServer = function (configFunction) {
  return function (proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    if (!config.proxy) config.proxy = {};
    config.proxy['/config'] = 'http://localhost:8080';
    return config;
  };
};