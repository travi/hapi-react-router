import {OK} from 'http-status-codes';
import {assert} from 'chai';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

defineSupportCode(({When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  When('a request is made for an existing route', function () {
    return this.makeRequest({url: '/existing-route'}).then(response => {
      this.serverResponse = response;
    });
  });

  Then('the route is rendered successfully', function (callback) {
    assert.equal(this.serverResponse.statusCode, OK);
    assert.equal(this.serverResponse.headers['content-type'], 'text/html; charset=utf-8');

    callback();
  });

  Then('asynchronously fetched data is included in the page', function (callback) {
    assert.include(this.serverResponse.payload, this.dataPoint);

    callback();
  });
});
