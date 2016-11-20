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
        const
            components = any.simpleObject(),
            params = any.simpleObject(),
            dispatch = any.simpleObject(),
            state = any.simpleObject(),
            getState = sinon.stub().returns(state),
            renderProps = {...any.simpleObject(), components, params},
            store = {...any.simpleObject(), dispatch, getState};
        redial.trigger.withArgs('fetch', components, {params, dispatch, state}).resolves();

        return assert.isFulfilled(fetchData({renderProps, store}));
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
