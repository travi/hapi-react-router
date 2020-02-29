import React from 'react';
import domServer from 'react-dom/server';
import {RouterContext} from 'react-router';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import defaultRenderFactory from './default-render-factory';

suite('default-render factory', () => {
  let sandbox;
  const Root = any.simpleObject();
  const store = any.simpleObject();
  const context = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(React, 'createElement');
    sandbox.stub(domServer, 'renderToString');
  });

  teardown(() => sandbox.restore());

  test('that the router-context is rendered within the provided root component', () => {
    const renderProps = any.simpleObject();
    const rootComponent = any.simpleObject();
    const html = any.string();
    const request = any.simpleObject();
    React.createElement.withArgs(RouterContext, renderProps).returns(context);
    React.createElement.withArgs(Root, {request, store}, context).returns(rootComponent);
    domServer.renderToString.withArgs(rootComponent).returns(html);

    assert.equal(defaultRenderFactory(request, store, renderProps, Root)(), html);
  });

  test('that the additional props are passed to the root component, when provided', () => {
    const renderProps = any.simpleObject();
    const rootComponent = any.simpleObject();
    const html = any.string();
    const request = any.simpleObject();
    const otherProps = any.simpleObject();
    React.createElement.withArgs(RouterContext, renderProps).returns(context);
    React.createElement.withArgs(Root, {request, store, ...otherProps}, context).returns(rootComponent);
    domServer.renderToString.withArgs(rootComponent).returns(html);

    assert.equal(defaultRenderFactory(request, store, renderProps, Root)(otherProps), html);
  });
});
