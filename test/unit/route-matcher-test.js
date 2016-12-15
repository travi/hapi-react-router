import * as reactRouter from 'react-router';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import matchRoute from '../../src/route-matcher';

suite('route matcher', () => {
  let sandbox;
  const createLocation = sinon.stub();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(reactRouter, 'createMemoryHistory').returns({createLocation});
    sandbox.stub(reactRouter, 'match');
  });

  teardown(() => {
    sandbox.restore();
    createLocation.reset();
  });

  test('that renderProps and redirectLocation are returned when matching resolves', () => {
    const url = any.string();
    const location = any.string();
    const routes = any.simpleObject();
    const renderProps = any.simpleObject();
    const redirectLocation = any.string();
    createLocation.withArgs(url).returns(location);
    reactRouter.match.withArgs({location, routes}).yields(null, redirectLocation, renderProps);

    return assert.becomes(matchRoute(url, routes), {redirectLocation, renderProps});
  });

  test('that a matching error results in a rejection', () => {
    const error = new Error('from test');
    reactRouter.match.yields(error);

    return assert.isRejected(matchRoute(), error);
  });
});
