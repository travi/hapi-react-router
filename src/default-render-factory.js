import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext} from 'react-router';

export default function (request, store, renderProps, Root) {
  return otherProps => renderToString(
    <Root request={request} store={store} {...otherProps}>
      <RouterContext {...renderProps} />
    </Root>
  );
}
