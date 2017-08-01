/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/route.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: ['es2015-rollup', 'stage-3', 'react']
    })
  ],
  targets: [
    {dest: 'lib/plugin.cjs.js', format: 'cjs'},
    {dest: 'lib/plugin.es.js', format: 'es'}
  ]
};
