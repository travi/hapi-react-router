import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Wrap from './components/wrap';
import Index from './components/index';
import Foo from './components/foo';
import Bar from './components/bar';
import NotFound from './components/not-found';

export default (
  <Route path="/" component={Wrap}>
    <IndexRoute component={Index} />
    <Route path="/foo" component={Foo} />
    <Route path="/bar" component={Bar} />
    <Route path="*" component={NotFound} />
  </Route>
);
