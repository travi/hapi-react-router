import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {register} from '../../src/route';
import * as routerWrapper from '../../src/router-wrapper';

suite('route', () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.sandbox.create();

        sandbox.stub(routerWrapper, 'default');
    });

    teardown(() => sandbox.restore());

    test('that the plugin is defined', () => {
        assert.deepEqual(register.attributes, {
            name: 'html-route'
        });
    });

    test('that the request for html is handled', () => {
        const
            next = sinon.spy(),
            route = sinon.stub(),
            respond = sinon.spy(),
            routes = sinon.spy(),
            auth = any.simpleObject(),
            request = {...any.simpleObject(), auth},
            reply = any.simpleObject(),
            Root = any.simpleObject(),
            store = any.simpleObject(),
            configureStore = sinon.stub();
        configureStore.withArgs({session: {auth}}).returns(store);

        register({route}, {respond, routes, Root, configureStore}, next);

        assert.calledOnce(next);
        assert.calledWith(route, sinon.match({
            method: 'GET',
            path: '/html'
        }));

        route.yieldTo('handler', request, reply);

        assert.calledWith(routerWrapper.default, request, reply, {routes, respond, Root, store});
    });
});
