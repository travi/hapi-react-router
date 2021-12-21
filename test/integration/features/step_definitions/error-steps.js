import {When, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {NOT_FOUND, INTERNAL_SERVER_ERROR} from 'http-status-codes';

When('a request is made for a route that does not exist', function () {
  return this.makeRequest({url: '/missing'});
});

When('a request is made for a route that fails to load data', function () {
  return this.makeRequest({url: '/server-error'});
});

Then('a not-found response is returned', function (callback) {
  assert.equal(this.serverResponse.statusCode, NOT_FOUND);
  assert.equal(this.serverResponse.headers['content-type'], 'text/html; charset=utf-8');
  assert.include(this.serverResponse.payload, 'Page Not Found');

  callback();
});

Then('a server-error response is returned', function (callback) {
  assert.equal(this.serverResponse.statusCode, INTERNAL_SERVER_ERROR);

  callback();
});
