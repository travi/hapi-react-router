import React from 'react';
import {defineSupportCode} from 'cucumber';
import {createStore} from 'redux';
import {Route} from 'react-router';
import hapi from 'hapi';
import {World} from '../support/world';

function respond() {

}

function Root() {
  return <div />;
}

const routes = (
  <Route path="/" />
);

defineSupportCode(({Before, setWorldConstructor}) => {
  setWorldConstructor(World);

  Before(function () {
    if (!this.server) {
      this.server = new hapi.Server();
      this.server.connection();

      return new Promise((resolve, reject) => {
        this.server.register([
          {
            register: require('../../../../src/route'),
            options: {respond, routes, Root, configureStore: () => createStore(() => undefined)}
          },
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
          else resolve();
        });
      });
    }

    return Promise.resolve();
  });
});
