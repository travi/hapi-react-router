# hapi-react-router

hapi route to delegate routing for html content to react-router

[![Build Status](https://img.shields.io/travis/travi/hapi-react-router.svg?style=flat)](https://travis-ci.org/travi/hapi-react-router)

[![npm](https://img.shields.io/npm/v/@travi/hapi-react-router.svg?maxAge=2592000)](https://www.npmjs.com/package/@travi/hapi-react-router)
[![license](https://img.shields.io/github/license/travi/hapi-react-router.svg)](LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```
$ npm install @travi/hapi-react-router -S
```

## Usage

Include this plugin in the [manifest](https://github.com/hapijs/glue) of your hapi application
to direct all requests to `/html` to a server-side renderer for your react-router routes. It is
assumed that something ([not included](https://github.com/travi/hapi-html-request-router)) is
in place to direct all `text/html` requests to this `/html` route.

### Example
```js
export default {
    connections: [{port: 8090}],
    registrations: [
        {plugin: '@travi/hapi-html-request-router'},
        {
            plugin: {
                register: '@travi/hapi-react-router',
                options: {
                    respond: (reply, {renderedContent}) => {
                        reply.view('layout', {renderedContent});
                    },
                    routes: (
                        <Route path="/" component={Wrap}>
                            <IndexRoute component={Index}/>
                            <Route path="/foo" component={Foo}/>
                            <Route path="/bar" component={Bar}/>
                        </Route>
                    ),
                    Root: ({store, children}) => (
                        <Provider store={store}>
                            {children}
                        </Provider>
                    ),
                    store: createStore(reducer)
                }
            }
        }
    ]
}
```

add something about redial

### Dependencies for you to provide

This plugin provides you the ability to customize a few steps of the process. Default implementations
are currently not provided, so these dependencies are required.

* `respond`: a function that will that allows you to call `reply` on your own, allowing you to perform
  additional steps before the response
* `routes`: the definition of your react-router routes that this plugin should match the request url
  against
* `Root`: a react component that will wrap the mounted components that result from the matched route
* `store`: a data store that will be passed as a prop to the `<Root />` component so that your
  component can inject it into the context through a provider component.

## Local Development

### Install dependencies
```
$ nvm install
$ npm install
```

### Verification
```
$ npm test
```

### Run the example app
```
$ npm start
```
