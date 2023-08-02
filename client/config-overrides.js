const webpack = require('webpack');

module.exports = function override(config, env) {
    // ...add 'crypto', 'stream', 'buffer', 'process', 'path', 'os' to the fallbacks if not already present:
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser')
    };
  
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
};
