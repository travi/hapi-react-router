import React from 'react';
import {RouterContext} from 'react-router';
import domServer from 'react-dom/server';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import Boom from 'boom';
import renderThroughReactRouter from '../../src/router-wrapper';
import * as routeMatcher from '../../src/route-matcher';
import * as dataFetcher from '../../src/data-fetcher';

suite('router-wrapper', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(routeMatcher, 'default');
    sandbox.stub(dataFetcher, 'default');
    sandbox.stub(Boom, 'wrap');
    sandbox.stub(React, 'createElement');
    sandbox.stub(domServer, 'renderToString');
  });

  teardown(() => sandbox.restore());

  test('that response contains the rendered content when the react-router route matches', () => {
    const url = any.string();
    const routes = any.simpleObject();
    const respond = sinon.spy();
    const request = {raw: {req: {url}}};
    const reply = sinon.spy();
    const renderProps = any.simpleObject();
    const context = any.simpleObject();
    const Root = any.simpleObject();
    const store = any.simpleObject();
    const rootComponent = any.simpleObject();
    const renderedContent = any.string();
    routeMatcher.default.withArgs(url, routes).resolves({renderProps});
    dataFetcher.default.withArgs({renderProps, store}).resolves({renderProps});
    React.createElement.withArgs(RouterContext, sinon.match(renderProps)).returns(context);
    React.createElement.withArgs(Root, {request, store}).returns(rootComponent);
    domServer.renderToString.withArgs(rootComponent).returns(renderedContent);

    return renderThroughReactRouter(request, reply, {routes, respond, Root, store}).then(() => {
      assert.notCalled(reply);
      assert.calledWith(respond, reply, {renderedContent, store});
    });
  });

  test('that errors that bubbled are passed to the response', () => {
    const reply = sinon.spy();
    const error = new Error('from test');
    const wrappedError = any.simpleObject();
    routeMatcher.default.rejects(error);
    Boom.wrap.withArgs(error).returns(wrappedError);

    return renderThroughReactRouter({raw: {req: {url: any.string()}}}, reply, {}).then(() => {
      assert.calledWith(reply, wrappedError);
    });
  });
});
