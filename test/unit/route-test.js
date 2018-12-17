import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {plugin} from '../../src/route';
import * as routerWrapper from '../../src/router-wrapper';

suite('route', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(routerWrapper, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the plugin is defined', () => {
    assert.deepEqual(plugin.pkg, require('../../package.json'));
  });

  test('that the request for html is handled', async () => {
    const render = () => undefined;
    const route = sinon.stub();
    const respond = sinon.spy();
    const routes = sinon.spy();
    const auth = {credentials: any.simpleObject()};
    const request = {...any.simpleObject(), auth};
    const reply = any.simpleObject();
    const server = {route};
    const Root = any.simpleObject();
    const store = any.simpleObject();
    const configureStore = sinon.stub();
    configureStore.withArgs({session: {auth: auth.credentials}, server}).returns(store);

    await plugin.register(server, {render, respond, routes, Root, configureStore});

    assert.calledWith(route, sinon.match({
      method: 'GET',
      path: '/html'
    }));

    route.yieldTo('handler', request, reply);

    assert.calledWith(routerWrapper.default, request, reply, {render, routes, respond, Root, store});
  });
});
