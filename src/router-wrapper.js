import Boom from '@hapi/boom';
import {StatusCodes} from 'http-status-codes';
import matchRoute from './route-matcher';
import fetchData from './data-fetcher';
import defaultRenderFactory from './default-render-factory';

export default async function renderThroughReactRouter(request, h, {render, routes, respond, Root, store}) {
  try {
    const {renderProps, status, redirectLocation} = await matchRoute(request.raw.req.url, routes);

    if (redirectLocation) {
      const state = redirectLocation.state || {};

      switch (state.status) {
        case StatusCodes.MOVED_PERMANENTLY:
          return h.redirect(redirectLocation.pathname).permanent();
        case StatusCodes.MOVED_TEMPORARILY:
          return h.redirect(redirectLocation.pathname).temporary();
        default:
          return h.redirect(redirectLocation.pathname).temporary();
      }
    } else {
      await fetchData({renderProps, store});

      const defaultRender = defaultRenderFactory(request, store, renderProps, Root);

      return respond(h, {
        store,
        status,
        renderedContent: render ? render(defaultRender, request) : {html: defaultRender()}
      });
    }
  } catch (e) {
    throw Boom.boomify(e);
  }
}
