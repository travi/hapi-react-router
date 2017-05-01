import {trigger} from 'redial';

export default function ({renderProps, store}) {
  return trigger('fetch', renderProps.components, {
    params: renderProps.params,
    dispatch: store.dispatch,
    state: store.getState()
  });
}
