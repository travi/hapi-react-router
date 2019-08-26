import React from 'react';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import {Route, Redirect} from 'react-router';
import {provideHooks} from 'redial';
import hapi from '@hapi/hapi';
import {MOVED_TEMPORARILY, MOVED_PERMANENTLY} from 'http-status-codes';
import mustache from 'mustache';
import any from '@travi/any';
import {setWorldConstructor, Before} from 'cucumber';
import {World} from '../support/world';

const reducer = (state, action) => {
  if ('loaded-existing-data' === action.type) {
    return {...state, dataPoint: action.dataPoint};
  }

  return state;
};

function respond(reply, {renderedContent, status}) {
  return reply.view('layout', {renderedContent}).code(status);
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

Before(async function () {
  this.dataPoint = any.word();
  dataPoint = this.dataPoint;     // eslint-disable-line prefer-destructuring

  if (!this.server) {
    this.server = hapi.server();

    await this.server.register([
      {plugin: require('@travi/hapi-html-request-router')},
      {
        plugin: require('../../../../src/route'),
        options: {respond, routes, Root, configureStore: () => createStore(reducer)}
      },
      {
        plugin: require('vision'),
        options: {
          engines: {
            mustache: {
              compile: template => {
                mustache.parse(template);

                return context => mustache.render(template, context);
              }
            }
          },
          path: './example'
        }
      },
      {
        plugin: require('good'),
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
    ]);
  }
});
