/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/route.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['travi', {targets: {node: 8, browser: true}, react: true, modules: false}]]
    })
  ],
  targets: [
    {dest: 'lib/plugin.cjs.js', format: 'cjs'},
    {dest: 'lib/plugin.es.js', format: 'es'}
  ]
};
