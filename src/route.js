import renderThroughReactRouter from './router-wrapper';

export function register(server, options, next) {
    server.route({
        method: 'GET',
        path: '/html',
        handler: (req, reply) => renderThroughReactRouter(req.raw.req.url, reply, options.routes, options.respond)
    });

    next();
}

register.attributes = {
    name: 'html-route'
};
