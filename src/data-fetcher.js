import {trigger} from 'redial';

export default function ({renderProps, store}) {
  const {getState} = store;

  return trigger('fetch', renderProps.components, {
    params: renderProps.params,
    dispatch: store.dispatch,
    state: getState(),
    getState
  });
}
