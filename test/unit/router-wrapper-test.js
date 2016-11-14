import React from 'react';
import {RouterContext} from 'react-router';
import domServer from 'react-dom/server';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import Boom from 'boom';
import renderThroughReactRouter from '../../src/router-wrapper';
import * as routeMatcher from '../../src/route-matcher';

suite('router-wrapper', () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.sandbox.create();

        sandbox.stub(routeMatcher, 'default');
        sandbox.stub(Boom, 'wrap');
        sandbox.stub(React, 'createElement');
        sandbox.stub(domServer, 'renderToString');
    });

    teardown(() => sandbox.restore());

    test('that response contains the rendered content when the react-router route matches', () => {
        const
            url = any.string(),
            routes = any.simpleObject(),
            respond = sinon.spy(),
            request = {raw: {req: {url}}},
            reply = sinon.spy(),
            renderProps = any.simpleObject(),
            context = any.simpleObject(),
            Root = any.simpleObject(),
            rootComponent = any.simpleObject(),
            renderedContent = any.string();
        routeMatcher.default.withArgs(url, routes).resolves({renderProps});
        React.createElement.withArgs(RouterContext, sinon.match(renderProps)).returns(context);
        React.createElement.withArgs(Root, {request}).returns(rootComponent);
        domServer.renderToString.withArgs(rootComponent).returns(renderedContent);

        return renderThroughReactRouter(request, reply, {routes, respond, Root}).then(() => {
            assert.notCalled(reply);
            assert.calledOnce(respond);
            assert.calledWith(respond, reply, {renderedContent});
        });
    });

    test('that errors that bubbled are passed to the response', () => {
        const
            reply = sinon.spy(),
            error = new Error('from test'),
            wrappedError = any.simpleObject();
        routeMatcher.default.rejects(error);
        Boom.wrap.withArgs(error).returns(wrappedError);

        return renderThroughReactRouter({raw: {req: {url: any.string()}}}, reply, {}).then(() => {
            assert.calledWith(reply, wrappedError);
        });
    });
});
