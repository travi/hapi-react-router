import React from 'react';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import {Route, Redirect} from 'react-router';
import {provideHooks} from 'redial';
import hapi from 'hapi';
import {MOVED_TEMPORARILY, MOVED_PERMANENTLY} from 'http-status-codes';
import any from '@travi/any';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

const reducer = (state, action) => {
  if ('loaded-existing-data' === action.type) {
    return {...state, dataPoint: action.dataPoint};
  }

  return state;
};

function respond(reply, {renderedContent, status}) {
  reply.view('layout', {renderedContent}).code(status);
}

function Root({children, store}) {
  return <Provider store={store}>{children}</Provider>;
}

function Wrap({children}) {
  return children;
}

function NotFound() {
  return <p>Page Not Found</p>;
}
NotFound.displayName = 'NotFound';

function ServerError() {
  return <div />;
}

const ConnectedError = connect(() => ({}))(provideHooks({
  fetch: () => Promise.reject(new Error('failed to fetch data'))
})(ServerError));

function Existing({dataPoint}) {
  return <div>{dataPoint}</div>;
}

defineSupportCode(({Before, setWorldConstructor}) => {
  setWorldConstructor(World);

  let dataPoint;

  const ConnectedExisting = connect(state => ({dataPoint: state.dataPoint}))(provideHooks({
    fetch({dispatch}) {
      return new Promise(resolve => setTimeout(() => {
        dispatch({type: 'loaded-existing-data', dataPoint});
        resolve();
      }, 1000));
    }
  })(Existing));

  const routes = (
    <Route path="/" component={Wrap}>
      <Route path="existing-route" component={ConnectedExisting} />
      <Route path="server-error" component={ConnectedError} />
      <Redirect from="temporary-redirect" to="/existing-route" state={{status: MOVED_TEMPORARILY}} />
      <Redirect from="permanent-redirect" to="/existing-route" state={{status: MOVED_PERMANENTLY}} />
      <Redirect from="redirect" to="/existing-route" />
      <Route path="*" component={NotFound} />
    </Route>
  );

  Before(function () {
    this.dataPoint = any.word();
    dataPoint = this.dataPoint;     // eslint-disable-line prefer-destructuring

    if (!this.server) {
      this.server = new hapi.Server();
      this.server.connection();

      return new Promise((resolve, reject) => {
        this.server.register([
          {register: require('@travi/hapi-html-request-router')},
          {
            register: require('../../../../src/route'),
            options: {respond, routes, Root, configureStore: () => createStore(reducer)}
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
