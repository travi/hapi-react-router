# hapi-react-router

[hapi](https://hapi.dev/) route to delegate routing for html content to
[react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs)

<!--status-badges start -->

[![Build Status](https://img.shields.io/travis/travi/hapi-react-router.svg?style=flat\&branch=master)](https://travis-ci.org/travi/hapi-react-router)
[![Codecov](https://img.shields.io/codecov/c/github/travi/hapi-react-router.svg)](https://codecov.io/github/travi/hapi-react-router)
[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Register with your Hapi v18+ server](#register-with-your-hapi-v18-server)
  * [Example](#example)
    * [Dependencies:](#dependencies)
    * [Register with the Hapi server](#register-with-the-hapi-server)
      * [Optional custom renderer that passes blankie (optional to provide yourself) nonces as a prop](#optional-custom-renderer-that-passes-blankie-optional-to-provide-yourself-nonces-as-a-prop)
  * [Dependencies for you to provide](#dependencies-for-you-to-provide)
  * [Redial fetch trigger arguments](#redial-fetch-trigger-arguments)
* [Contribution](#contribution)
  * [Install dependencies](#install-dependencies)
  * [Verification](#verification)
  * [Run the example app](#run-the-example-app)

## Usage

<!--consumer-badges start -->

[![npm](https://img.shields.io/npm/v/@travi/hapi-react-router.svg?maxAge=2592000)](https://www.npmjs.com/package/@travi/hapi-react-router)
![node][node-badge]
[![license](https://img.shields.io/github/license/travi/hapi-react-router.svg)](LICENSE)
[![Try @travi/hapi-react-router on RunKit][runkit-badge]][runkit-link]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @travi/hapi-react-router -S
```

:warning: this plugin expects [external babel-helpers](https://babeljs.io/docs/plugins/external-helpers/)
to be provided by the consumer

### Register with your [Hapi](https://hapi.dev/) v18+ server

Include this plugin in the [manifest](https://github.com/hapijs/glue) of your
hapi application to direct all requests to `/html` to a server-side renderer
for your react-router routes. It is assumed that something
([not included](https://github.com/travi/hapi-html-request-router)) is in place
to direct all `text/html` requests to this `/html` route.

In addition, [redial](https://github.com/markdalgleish/redial) `fetch` hooks
will be triggered and rendering will wait for all related requests to complete.
This enables populating the data store based on the components that are mounted
for the current route. See [redial arguments](#redial-fetch-trigger-arguments)
for the list of arguments supplied to triggered fetches.

### Example

#### Dependencies:

```javascript
import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
```

#### Register with the Hapi server

```javascript
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
```

##### Optional custom renderer that passes blankie (optional to provide yourself) nonces as a prop

```javascript
          render: (defaultRender, request) => ({html: defaultRender({nonces: request.plugins.blankie.nonces})})
        }
      }
    ]
  }
};
```

### Dependencies for you to provide

This plugin provides you the ability to customize a few steps of the process.
Default implementations are currently not provided, so these dependencies are
required.

* `respond`: a function that will that allows you to call `reply` on your own,
  allowing you to perform additional steps before the response
* `routes`: the definition of your react-router routes that this plugin should
  match the request url against
  * If you use a [catch-all route](https://github.com/ReactTraining/react-router/blob/c3cd9675bd8a31368f87da74ac588981cbd6eae7/upgrade-guides/v1.0.0.md#notfound-route)
    to display an appropriate message when the route does not match, it should
    have a `displayName` of `NotFound`. This will enable the status code to be
    passed to `respond` as `404`. Please note that the automatic mapping of the
    `name` property should not be relied on because it can be mangled during
    minification and, therefore, not match in production.
* `Root`: a react component that will wrap the mounted components that result
  from the matched route
* `store`: a data store that will be passed as a prop to the `<Root />`
  component so that your component can inject it into the context through a
  provider component.
* `render`: _optional_ custom renderer to replace the default renderer. Passed `defaultRenderer` and `request` as arguments so additional props can be passed to the defaultRenderer, potentially from the request.

### Redial fetch trigger arguments

* `params`: pass-through of react-router params taken from the path
* `dispatch`: redux store [dispatch](https://redux.js.org/api/store/#dispatchaction) method
* `state`: current state of the redux store
* `getState`: [method](https://redux.js.org/api/store/#getstate) to get the
  latest state of the redux store
* `store`: the raw redux store. :warning: WARNING: this should only be used for
  unique circumstances (e.g., creating a custom subscription to the store)

## Contribution

<!--contribution-badges start -->

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Install dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

### Run the example app

```sh
$ npm start
```

[node-badge]: https://img.shields.io/node/v/@travi/javascript-scaffolder.svg

[runkit-link]: https://npm.runkit.com/@travi/hapi-react-router

[runkit-badge]: https://badge.runkitcdn.com/@travi/hapi-react-router.svg

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjkgMzY5Ij48Y2lyY2xlIGN4PSIxODkuOSIgY3k9IjE5MC4yIiByPSIxODQuNSIgZmlsbD0iI2ZmZTQyZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUgLTYpIi8+PHBhdGggZmlsbD0iIzhiYjViNSIgZD0iTTI1MSAyNTZsLTM4LTM4YTE3IDE3IDAgMDEwLTI0bDU2LTU2YzItMiAyLTYgMC03bC0yMC0yMWE1IDUgMCAwMC03IDBsLTEzIDEyLTktOCAxMy0xM2ExNyAxNyAwIDAxMjQgMGwyMSAyMWM3IDcgNyAxNyAwIDI0bC01NiA1N2E1IDUgMCAwMDAgN2wzOCAzOHoiLz48cGF0aCBmaWxsPSIjZDk1NjEyIiBkPSJNMzAwIDI4OGwtOCA4Yy00IDQtMTEgNC0xNiAwbC00Ni00NmMtNS01LTUtMTIgMC0xNmw4LThjNC00IDExLTQgMTUgMGw0NyA0N2M0IDQgNCAxMSAwIDE1eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik04MSAxODVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzI1YzRjMyIgZD0iTTIyMCAxMDBsMjMgMjNjNCA0IDQgMTEgMCAxNkwxNDIgMjQwYy00IDQtMTEgNC0xNSAwbC0yNC0yNGMtNC00LTQtMTEgMC0xNWwxMDEtMTAxYzUtNSAxMi01IDE2IDB6Ii8+PHBhdGggZmlsbD0iIzFkZGVkZCIgZD0iTTk5IDE2N2wxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjMDBhZmIzIiBkPSJNMjMwIDExMGwxMyAxM2M0IDQgNCAxMSAwIDE2TDE0MiAyNDBjLTQgNC0xMSA0LTE1IDBsLTEzLTEzYzQgNCAxMSA0IDE1IDBsMTAxLTEwMWM1LTUgNS0xMSAwLTE2eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik0xMTYgMTQ5bDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMxZGRlZGQiIGQ9Ik0xMzQgMTMxbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMxYmNmY2UiIGQ9Ik0xNTIgMTEzbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik0xNzAgOTVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzFiY2ZjZSIgZD0iTTYzIDE2N2wxOC0xOCAxOCAxOC0xOCAxOHpNOTggMTMxbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMzNGVkZWIiIGQ9Ik0xMzQgOTVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzFiY2ZjZSIgZD0iTTE1MyA3OGwxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjMzRlZGViIiBkPSJNODAgMTEzbDE4LTE3IDE4IDE3LTE4IDE4ek0xMzUgNjBsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzk4ZWRlYiIgZD0iTTI3IDEzMWwxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjYjUzZTAyIiBkPSJNMjg1IDI1OGw3IDdjNCA0IDQgMTEgMCAxNWwtOCA4Yy00IDQtMTEgNC0xNiAwbC02LTdjNCA1IDExIDUgMTUgMGw4LTdjNC01IDQtMTIgMC0xNnoiLz48cGF0aCBmaWxsPSIjOThlZGViIiBkPSJNODEgNzhsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzAwYTNhMiIgZD0iTTIzNSAxMTVsOCA4YzQgNCA0IDExIDAgMTZMMTQyIDI0MGMtNCA0LTExIDQtMTUgMGwtOS05YzUgNSAxMiA1IDE2IDBsMTAxLTEwMWM0LTQgNC0xMSAwLTE1eiIvPjxwYXRoIGZpbGw9IiMzOWQ5ZDgiIGQ9Ik0yMjggMTA4bC04LThjLTQtNS0xMS01LTE2IDBMMTAzIDIwMWMtNCA0LTQgMTEgMCAxNWw4IDhjLTQtNC00LTExIDAtMTVsMTAxLTEwMWM1LTQgMTItNCAxNiAweiIvPjxwYXRoIGZpbGw9IiNhMzM5MDQiIGQ9Ik0yOTEgMjY0bDggOGM0IDQgNCAxMSAwIDE2bC04IDdjLTQgNS0xMSA1LTE1IDBsLTktOGM1IDUgMTIgNSAxNiAwbDgtOGM0LTQgNC0xMSAwLTE1eiIvPjxwYXRoIGZpbGw9IiNlYjZlMmQiIGQ9Ik0yNjAgMjMzbC00LTRjLTYtNi0xNy02LTIzIDAtNyA3LTcgMTcgMCAyNGw0IDRjLTQtNS00LTExIDAtMTZsOC04YzQtNCAxMS00IDE1IDB6Ii8+PHBhdGggZmlsbD0iIzEzYWNiZCIgZD0iTTEzNCAyNDhjLTQgMC04LTItMTEtNWwtMjMtMjNhMTYgMTYgMCAwMTAtMjNMMjAxIDk2YTE2IDE2IDAgMDEyMiAwbDI0IDI0YzYgNiA2IDE2IDAgMjJMMTQ2IDI0M2MtMyAzLTcgNS0xMiA1em03OC0xNDdsLTQgMi0xMDEgMTAxYTYgNiAwIDAwMCA5bDIzIDIzYTYgNiAwIDAwOSAwbDEwMS0xMDFhNiA2IDAgMDAwLTlsLTI0LTIzLTQtMnoiLz48cGF0aCBmaWxsPSIjYmY0NDA0IiBkPSJNMjg0IDMwNGMtNCAwLTgtMS0xMS00bC00Ny00N2MtNi02LTYtMTYgMC0yMmw4LThjNi02IDE2LTYgMjIgMGw0NyA0NmM2IDcgNiAxNyAwIDIzbC04IDhjLTMgMy03IDQtMTEgNHptLTM5LTc2Yy0xIDAtMyAwLTQgMmwtOCA3Yy0yIDMtMiA3IDAgOWw0NyA0N2E2IDYgMCAwMDkgMGw3LThjMy0yIDMtNiAwLTlsLTQ2LTQ2Yy0yLTItMy0yLTUtMnoiLz48L3N2Zz4=

[github-actions-ci-link]: https://github.com/travi/hapi-react-router/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://github.com/travi/hapi-react-router/workflows/Node.js%20CI/badge.svg
