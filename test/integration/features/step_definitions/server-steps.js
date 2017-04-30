import React from 'react';
import {createStore} from 'redux';
import {Route} from 'react-router';
import hapi from 'hapi';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

function respond(reply, {renderedContent, status}) {
  reply.view('layout', {renderedContent}).code(status);
}

function Root({children}) {
  return children;
}

function Wrap({children}) {
  return children;
}

function NotFound() {
  return <p>Page Not Found</p>;
}
NotFound.displayName = 'NotFound';

const routes = (
  <Route path="/" component={Wrap}>
    <Route path="*" component={NotFound} />
  </Route>
);

defineSupportCode(({Before, setWorldConstructor}) => {
  setWorldConstructor(World);

  Before(function () {
    if (!this.server) {
      this.server = new hapi.Server();
      this.server.connection();

      return new Promise((resolve, reject) => {
        this.server.register([
          {register: require('@travi/hapi-html-request-router')},
          {
            register: require('../../../../src/route'),
            options: {respond, routes, Root, configureStore: () => createStore(() => undefined)}
          },
          {register: require('vision')},
          {
            register: require('good'),
            options: {
              reporters: {
                console: [
                  {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{log: '*', request: '*', response: '*', error: '*'}]
                  },
                  {module: 'good-console'},
                  'stdout'
                ]
              }
            }
          }
        ], err => {
          if (err) reject(err);
          else {
            this.server.views({
              engines: {mustache: require('hapi-mustache')},
              relativeTo: __dirname,
              path: '../../../../example'
            });

            resolve();
          }
        });
      });
    }

    return Promise.resolve();
  });
});
