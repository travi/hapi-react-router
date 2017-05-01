import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';

export default async function renderThroughReactRouter(request, reply, {routes, respond, Root, store}) {
  try {
    const {renderProps, status} = await matchRoute(request.raw.req.url, routes);
    await fetchData({renderProps, store});

    respond(reply, {
      store,
      status,
      renderedContent: renderToString(
        <Root request={request} store={store}>
          <RouterContext {...renderProps} />
        </Root>
      )
    });
  } catch (e) {
    reply(Boom.wrap(e));
  }
}
