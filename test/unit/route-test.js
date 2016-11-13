import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {register} from '../../src/route';

suite('route', () => {
    suite('plugin', () => {
        test('that the plugin is defined', () => {
            assert.deepEqual(register.attributes, {
                name: 'html-route'
            });
        });

        test('that the request for html is handled', () => {
            const
                next = sinon.spy(),
                server = {route: sinon.spy()};

            register(server, null, next);

            assert.calledOnce(next);
            assert.calledWith(server.route, sinon.match({
                method: 'GET',
                path: '/html'
            }));
        });

        test('that rendered content is sent in the response', () => {
            const
                route = sinon.stub(),
                respond = sinon.spy(),
                reply = any.simpleObject();

            register({route}, {respond}, () => undefined);
            route.yieldTo('handler', null, reply);

            assert.calledWith(respond, reply, {renderedContent: '<p>Hello World</p>'});
        });
    });
});
