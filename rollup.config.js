/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/route.js',
  external: [
    'react',
    'react-dom/server',
    'react-router',
    'boom',
    'http-status-codes',
    'redial'
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['travi', {targets: {node: 8, browser: true}, react: true, modules: false}]]
    })
  ],
  output: [
    {file: 'lib/plugin.cjs.js', format: 'cjs'},
    {file: 'lib/plugin.es.js', format: 'es'}
  ]
};
