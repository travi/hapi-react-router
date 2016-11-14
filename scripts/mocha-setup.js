import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

sinon.assert.expose(chai.assert, {prefix: ''});
chai.use(chaiAsPromised);
