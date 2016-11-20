import {createStore} from 'redux';
import respond from './respond';
import routes from './routes';
import Root from './components/root';

export default {
    connections: [{port: 8090}],
    registrations: [
        {plugin: 'vision'},
        {
            plugin: {
                register: 'visionary',
                options: {
                    'engines': {'mustache': 'hapi-mustache'},
                    'path': './example'
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: {
                        interval: 1000
                    },
                    reporters: {
                        console: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{log: '*', request: '*', response: '*', error: '*'}]
                            },
                            {module: 'good-console'},
                            'stdout'
                        ]
                    }
                }
            }
        },
        {plugin: '@travi/hapi-html-request-router'},
        {
            plugin: {
                register: '../src/route',
                options: {respond, routes, Root, store: createStore(() => undefined)}
            }
        }
    ]
};
