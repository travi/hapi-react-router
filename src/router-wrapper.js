import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import matchRoute from './route-matcher';

export default function renderThroughReactRouter(url, reply, routes, respond) {
    return matchRoute(url, routes).then(({renderProps}) => {
        respond(reply, {renderedContent: renderToString(<RouterContext {...renderProps} />)});
    }).catch((err) => reply(Boom.wrap(err)));
}
