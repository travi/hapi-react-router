export function register(server, options, next) {
    server.route({
        method: 'GET',
        path: '/html',
        handler: (request, reply) => {
            options.respond(reply, {renderedContent: '<p>Hello World</p>'});
        }
    });

    next();
}

register.attributes = {
    name: 'html-route'
};
