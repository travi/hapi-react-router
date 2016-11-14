import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import matchRoute from './route-matcher';

export default function renderThroughReactRouter(request, reply, {routes, respond, Root}) {
    return matchRoute(request.raw.req.url, routes).then(({renderProps}) => {
        respond(reply, {renderedContent: renderToString(
            <Root request={request}>
                <RouterContext {...renderProps} />
            </Root>
        )});
    }).catch((err) => reply(Boom.wrap(err)));
}
