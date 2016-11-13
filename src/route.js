export function handler(request, reply) {
    reply();
}

export function register(server, options, next) {
    server.route({
        method: 'GET',
        path: '/html',
        handler
    });

    next();
}

register.attributes = {
    name: 'html-route'
};
