import {trigger} from 'redial';

export default function ({renderProps, store, status}) {
  return trigger('fetch', renderProps.components, {
    params: renderProps.params,
    dispatch: store.dispatch,
    state: store.getState()
  }).then(() => Promise.resolve(({renderProps, status}))).catch(e => Promise.reject(e));
}
