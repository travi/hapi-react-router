import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {register} from '../../src/route';
import * as routerWrapper from '../../src/router-wrapper';

suite('route', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(routerWrapper, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the plugin is defined', () => {
    assert.deepEqual(register.attributes, {
      pkg: require('../../package.json')
    });
  });

  test('that the request for html is handled', () => {
    const next = sinon.spy();
    const route = sinon.stub();
    const respond = sinon.spy();
    const routes = sinon.spy();
    const auth = {credentials: any.simpleObject()};
    const request = {...any.simpleObject(), auth};
    const reply = any.simpleObject();
    const Root = any.simpleObject();
    const store = any.simpleObject();
    const configureStore = sinon.stub();
    configureStore.withArgs({session: {auth: auth.credentials}}).returns(store);

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
