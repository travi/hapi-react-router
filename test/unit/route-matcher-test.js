import {OK, NOT_FOUND} from 'http-status-codes';
import * as reactRouter from 'react-router';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import matchRoute from '../../src/route-matcher';

suite('route matcher', () => {
  let sandbox;
  const createLocation = sinon.stub();
  const routes = any.simpleObject();
  const redirectLocation = any.string();
  const renderProps = any.simpleObject();
  const url = any.string();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(reactRouter, 'createMemoryHistory').returns({createLocation});
    sandbox.stub(reactRouter, 'match');
  });

  teardown(() => {
    sandbox.restore();
    createLocation.reset();
  });

  test('that renderProps is returned when matching resolves to a route', () => {
    const location = any.string();
    createLocation.withArgs(url).returns(location);
    const renderPropWithComponents = {...renderProps, components: any.listOf(() => ({displayName: any.word()}))};
    reactRouter.match.withArgs({location, routes}).yields(null, null, renderPropWithComponents);

    return assert.becomes(matchRoute(url, routes), {
      redirectLocation: null,
      renderProps: renderPropWithComponents,
      status: OK
    });
  });

  test('that redirectLocation is returned when matching resolves to a redirect', () => {
    const location = any.string();
    createLocation.withArgs(url).returns(location);
    reactRouter.match.withArgs({location, routes}).yields(null, redirectLocation, null);

    return assert.becomes(matchRoute(url, routes), {
      redirectLocation,
      renderProps: null,
      status: OK
    });
  });

  test('that a matching error results in a rejection', () => {
    const error = new Error('from test');
    reactRouter.match.yields(error);

    return assert.isRejected(matchRoute(), error);
  });

  test('that the status code is returned as 404 when the catch-all route matches', () => {
    const components = [{displayName: any.string()}, {displayName: 'NotFound'}, {displayName: any.string()}];
    const renderPropsWithComponents = {components};
    reactRouter.match.yields(null, redirectLocation, renderPropsWithComponents);

    return assert.becomes(matchRoute(url, routes), {
      redirectLocation,
      renderProps: renderPropsWithComponents,
      status: NOT_FOUND
    });
  });
});
