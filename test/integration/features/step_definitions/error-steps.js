import {defineSupportCode} from 'cucumber';
import {assert} from 'chai';
import {NOT_FOUND} from 'http-status-codes';
import {World} from '../support/world';

defineSupportCode(({When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  When('a request is made for a route that does not exist', function () {
    return this.makeRequest({url: '/missing'}).then(response => {
      this.serverResponse = response;
    });
  });

  Then('a not-found response is returned', function (callback) {
    assert.equal(this.serverResponse.statusCode, NOT_FOUND);
    assert.equal(this.serverResponse.headers['content-type'], 'text/html; charset=utf-8');
    assert.include(this.serverResponse.payload, 'Page Not Found');

    callback();
  });
});
