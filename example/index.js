// #### Dependencies:
import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

// #### Register with the Hapi server

// remark-usage-ignore-next 5
function Wrap() {
  return null;
}
function Index() {
  return null;
}
function Foo() {
  return null;
}
function Bar() {
  return null;
}
function NotFound() {
  return null;
}

export default {
  server: {port: process.env.PORT},
  register: {
    plugins: [
      {plugin: '@travi/hapi-html-request-router'},
      {
        plugin: '@travi/hapi-react-router',
        options: {
          respond: (reply, {renderedContent}) => {
            reply.view('layout', {renderedContent});
          },
          routes: (
            <Route path="/" component={Wrap}>
              <IndexRoute component={Index} />
              <Route path="/foo" component={Foo} />
              <Route path="/bar" component={Bar} />
              <Route path="*" component={NotFound} />
            </Route>
          ),
          Root: ({store, children}) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
          configureStore: ({session}) => createStore(reducer, composeMiddlewares(session)),

          // ##### Optional custom renderer that passes blankie (optional to provide yourself) nonces as a prop
          render: (defaultRender, request) => ({html: defaultRender({nonces: request.plugins.blankie.nonces})})
        }
      }
    ]
  }
};
