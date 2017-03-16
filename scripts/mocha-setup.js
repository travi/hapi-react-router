import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

sinon.behavior = require('sinon/lib/sinon/behavior');

sinon.defaultConfig = {
  injectInto: null,
  properties: ['spy', 'stub', 'mock', 'clock', 'server', 'requests'],
  useFakeTimers: true,
  useFakeServer: true
};
require('sinon-as-promised');

sinon.assert.expose(chai.assert, {prefix: ''});
chai.use(chaiAsPromised);
