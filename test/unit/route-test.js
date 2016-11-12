import sinon from 'sinon';
import {assert} from 'chai';
import {register, handler} from '../../src/route';

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
            assert.calledWith(server.route, {
                method: 'GET',
                path: '/html',
                handler
            });
        });
    });
});
