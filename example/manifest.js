import {createStore} from 'redux';
import mustache from 'mustache';
import respond from './respond';
import routes from './routes';
import Root from './components/root';

export default {
  server: {port: 8090},
  register: {
    plugins: [
      {
        plugin: 'vision',
        options: {
          engines: {
            mustache: {
              compile: template => {
                mustache.parse(template);

                return context => mustache.render(template, context);
              }
            }
          },
          path: './example'
        }
      },
      {
        plugin: 'good',
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
      },
      {plugin: '@travi/hapi-html-request-router'},
      {
        plugin: '../src/route',
        options: {respond, routes, Root, configureStore: () => createStore(() => undefined)}
      }
    ]
  }
};
