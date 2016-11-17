# hapi-react-router

hapi route to delegate routing for html content to react-router

[![Build Status](https://img.shields.io/travis/travi/hapi-react-router.svg?style=flat)](https://travis-ci.org/travi/hapi-react-router)

[![npm](https://img.shields.io/npm/v/@travi/hapi-react-router.svg?maxAge=2592000)](https://www.npmjs.com/package/@travi/hapi-react-router)
[![license](https://img.shields.io/github/license/travi/hapi-react-router.svg)](LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```
$ npm install @travi/hapi-react-router
```

## Usage

Include this plugin in the [manifest](https://github.com/hapijs/glue) of your hapi application
to direct all requests to `/html` to a server-side renderer for your react-router routes. It is
assumed that something ([not included](https://github.com/travi/hapi-html-request-router)) is
in place to direct all `text/html` requests to this `/html` route.

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
