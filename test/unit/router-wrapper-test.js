import React from 'react';
import {RouterContext} from 'react-router';
import domServer from 'react-dom/server';
import {MOVED_TEMPORARILY, MOVED_PERMANENTLY} from 'http-status-codes';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import Boom from 'boom';
import renderThroughReactRouter from '../../src/router-wrapper';
import * as routeMatcher from '../../src/route-matcher';
import * as dataFetcher from '../../src/data-fetcher';

suite('router-wrapper', () => {
  let sandbox;
  const Root = any.simpleObject();
  const routes = any.simpleObject();
  const store = any.simpleObject();
  const url = any.string();
  const request = {raw: {req: {url}}};
  const redirectResponse = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(routeMatcher, 'default');
    sandbox.stub(dataFetcher, 'default');
    sandbox.stub(Boom, 'wrap');
    sandbox.stub(React, 'createElement');
    sandbox.stub(domServer, 'renderToString');
  });

  teardown(() => sandbox.restore());

  test('that response contains the rendered content when the react-router route matches', () => {
    const respond = sinon.stub();
    const reply = sinon.spy();
    const renderProps = any.simpleObject();
    const status = any.integer();
    const context = any.simpleObject();
    const rootComponent = any.simpleObject();
    const renderedContent = any.string();
    const response = any.string();
    routeMatcher.default.withArgs(url, routes).resolves({renderProps, status});
    dataFetcher.default.withArgs({renderProps, store, status}).resolves({renderProps, status});
    React.createElement.withArgs(RouterContext, sinon.match(renderProps)).returns(context);
    React.createElement.withArgs(Root, {request, store}).returns(rootComponent);
    domServer.renderToString.withArgs(rootComponent).returns(renderedContent);
    respond.withArgs(reply, {renderedContent, store, status}).returns(response);

    return assert.becomes(renderThroughReactRouter(request, reply, {routes, respond, Root, store}), response);
  });

  test('that a temporary redirect results when a redirectLocation is defined with a 302 status', () => {
    const respond = sinon.stub();
    const redirect = sinon.stub();
    const temporary = sinon.stub();
    const permanent = sinon.stub();
    const redirectPathname = any.url();
    const redirectLocation = {pathname: redirectPathname, state: {status: MOVED_TEMPORARILY}};
    routeMatcher.default.withArgs(url, routes).resolves({redirectLocation});
    redirect.withArgs(redirectPathname).returns({temporary, permanent});
    temporary.returns(redirectResponse);

    return assert.becomes(
      renderThroughReactRouter(request, {redirect}, {routes, respond, Root, store}),
      redirectResponse
    ).then(() => {
      assert.notCalled(respond);
      assert.notCalled(permanent);
    });
  });

  test('that a permanent redirect results when a redirectLocation is defined with a 301 status', () => {
    const respond = sinon.spy();
    const redirect = sinon.stub();
    const temporary = sinon.stub();
    const permanent = sinon.stub();
    const redirectPathname = any.url();
    const redirectLocation = {pathname: redirectPathname, state: {status: MOVED_PERMANENTLY}};
    routeMatcher.default.withArgs(url, routes).resolves({redirectLocation});
    redirect.withArgs(redirectPathname).returns({temporary, permanent});
    permanent.returns(redirectResponse);

    return assert.becomes(
      renderThroughReactRouter(request, {redirect}, {routes, respond, Root, store}),
      redirectResponse
    ).then(() => {
      assert.notCalled(respond);
      assert.notCalled(temporary);
    });
  });

  test('that a temporary redirect results when a redirectLocation is defined without a status set', () => {
    const respond = sinon.spy();
    const redirect = sinon.stub();
    const temporary = sinon.stub();
    const permanent = sinon.stub();
    const redirectPathname = any.url();
    const redirectLocation = {pathname: redirectPathname};
    routeMatcher.default.withArgs(url, routes).resolves({redirectLocation});
    redirect.withArgs(redirectPathname).returns({temporary, permanent});
    temporary.returns(redirectResponse);

    return assert.becomes(
      renderThroughReactRouter(request, {redirect}, {routes, respond, Root, store}),
      redirectResponse
    ).then(() => {
      assert.notCalled(respond);
      assert.notCalled(permanent);
    });
  });

  test('that errors that bubbled are passed to the response', () => {
    const reply = sinon.spy();
    const error = new Error('from test');
    const wrappedError = any.simpleObject();
    routeMatcher.default.rejects(error);
    Boom.wrap.withArgs(error).returns(wrappedError);

    return assert.isRejected(renderThroughReactRouter({raw: {req: {url: any.string()}}}, reply, {}), wrappedError);
  });
});
