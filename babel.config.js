module.exports = {
    presets: [
      '@babel/preset-env',       // For modern JavaScript (ES6+)
      '@babel/preset-react',     // For React JSX
      '@babel/preset-typescript', // For TypeScript support (important for Jest with TypeScript)
    ],
    plugins: [
      '@babel/plugin-transform-runtime', // For async/await and other JS features support
    ],
  };