import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';
import Boom from 'boom';
import {MOVED_PERMANENTLY, MOVED_TEMPORARILY} from 'http-status-codes';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';

export default async function renderThroughReactRouter(request, h, {routes, respond, Root, store}) {
  try {
    const {renderProps, status, redirectLocation} = await matchRoute(request.raw.req.url, routes);

    if (redirectLocation) {
      const state = redirectLocation.state || {};

      switch (state.status) {
        case MOVED_PERMANENTLY:
          return h.redirect(redirectLocation.pathname).permanent();
        case MOVED_TEMPORARILY:
          return h.redirect(redirectLocation.pathname).temporary();
        default:
          return h.redirect(redirectLocation.pathname).temporary();
      }
    } else {
      await fetchData({renderProps, store});

      return respond(h, {
        store,
        status,
        renderedContent: renderToString((
          <Root request={request} store={store}>
            <RouterContext {...renderProps} />
          </Root>
        ))
      });
    }
  } catch (e) {
    throw Boom.wrap(e);
  }
}
