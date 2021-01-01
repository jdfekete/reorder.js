import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import versionInjector from 'rollup-plugin-version-injector';
import localResolve from 'rollup-plugin-local-resolve';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

export default {
    input: 'src/index.js',
    plugins: [
        versionInjector(),
        localResolve(),
        resolve({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
            extensions: ['.js']
        }),
        commonjs(),
        serve({
            open: true,
            openPage: '/index.html',
            verbose: true,
            contentBase: ['examples',
                          'dist',
                          'lib',
                          'node_modules/parcoord-es/dist'
                         ],
            historyApiFallback: false,
            host: 'localhost',
            port: 3004
        }),
        livereload({
            watch: ['examples', 'dist'],
            verbose: false
        })
    ],
    external: [],
    output: {
        name: "reorder",
        file: "dist/reorder.js",
        format: "umd"
    }
};
