import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';

export default function renderThroughReactRouter(request, reply, {routes, respond, Root, store}) {
  return matchRoute(request.raw.req.url, routes)
    .then(({renderProps, status}) => fetchData({renderProps, store, status}))
    .then(({renderProps, status}) => respond(reply, {
      store,
      status,
      renderedContent: renderToString(
        <Root request={request} store={store}>
          <RouterContext {...renderProps} />
        </Root>
      )
    }))
    .catch(err => reply(Boom.wrap(err)));
}
