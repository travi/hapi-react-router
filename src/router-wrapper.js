import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import {MOVED_PERMANENTLY, MOVED_TEMPORARILY} from 'http-status-codes';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';

export default async function renderThroughReactRouter(request, reply, {routes, respond, Root, store}) {
  try {
    const {renderProps, status, redirectLocation} = await matchRoute(request.raw.req.url, routes);

    if (redirectLocation) {
      const state = redirectLocation.state || {};
      switch (state.status) {
        case MOVED_PERMANENTLY:
          reply.redirect(redirectLocation.pathname).permanent();
          break;
        case MOVED_TEMPORARILY:
          reply.redirect(redirectLocation.pathname).temporary();
          break;
        default:
          reply.redirect(redirectLocation.pathname).temporary();
          break;
      }
    } else {
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
    }
  } catch (e) {
    reply(Boom.wrap(e));
  }
}
