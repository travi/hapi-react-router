import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import redial from 'redial';
import fetchData from '../../src/data-fetcher';

suite('data fetcher', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(redial, 'trigger');
  });

  teardown(() => sandbox.restore());

  test('that redial triggers the fetch hook for mounted components', () => {
    const components = any.simpleObject();
    const params = any.simpleObject();
    const dispatch = any.simpleObject();
    const state = any.simpleObject();
    const getState = sinon.stub().returns(state);
    const renderProps = {...any.simpleObject(), components, params};
    const store = {...any.simpleObject(), dispatch, getState};
    redial.trigger.withArgs('fetch', components, {params, dispatch, state}).resolves();

    return assert.isFulfilled(fetchData({renderProps, store}), {renderProps});
  });

  test('that a redial rejection bubbles', () => {
    const error = new Error(any.word());
    redial.trigger.rejects(error);

    return assert.isRejected(fetchData({
      renderProps: any.simpleObject(),
      store: {...any.simpleObject(), getState: () => undefined}
    }), error);
  });
});
