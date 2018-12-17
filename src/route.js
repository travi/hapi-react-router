/* eslint import/prefer-default-export: "off" */
import renderThroughReactRouter from './router-wrapper';

export const plugin = {
  pkg: require('../package.json'),
  async register(server, options) {
    server.route({
      method: 'GET',
      path: '/html',
      handler: (request, h) => renderThroughReactRouter(request, h, {
        render: options.render,
        routes: options.routes,
        respond: options.respond,
        Root: options.Root,
        store: options.configureStore({session: {auth: request.auth.credentials}, server})
      })
    });
  }
};
