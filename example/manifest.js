export default {
    connections: [{port: 8090}],
    registrations: [
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
        {plugin: '../src/route'}
    ]
};
