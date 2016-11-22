import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';

export default function renderThroughReactRouter(request, reply, {routes, respond, Root, store}) {
    return matchRoute(request.raw.req.url, routes)
        .then(({renderProps}) => fetchData({renderProps, store}))
        .then(({renderProps}) => respond(reply, {
            store,
            renderedContent: renderToString(
                <Root request={request} store={store}>
                    <RouterContext {...renderProps} />
                </Root>
            )
        }))
        .catch((err) => reply(Boom.wrap(err)));
}
