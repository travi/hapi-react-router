import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/route.js',
    plugins: [
        babel({
            babelrc: false,
            exclude: ['./node_modules/**'],
            presets: ['es2015-rollup', 'react']
        })
    ],
    targets: [
        {dest: 'lib/plugin.cjs.js', format: 'cjs'},
        {dest: 'lib/plugin.es.js', format: 'es'}
    ]
};
