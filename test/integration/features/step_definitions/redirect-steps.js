import {MOVED_TEMPORARILY, MOVED_PERMANENTLY} from 'http-status-codes';
import {assert} from 'chai';
import {When, Then} from 'cucumber';

let redirectType;

When(/^a request is made for a route that (.*) redirects to another route$/, function (expectedRedirectType) {
  if ('temporarily' === expectedRedirectType) {
    redirectType = MOVED_TEMPORARILY;
    return this.makeRequest({url: '/temporary-redirect'});
  } else if ('permanently' === expectedRedirectType) {
    redirectType = MOVED_PERMANENTLY;
    return this.makeRequest({url: '/permanent-redirect'});
  }

  throw new Error('invalid redirect type');
});

When(/^a request is made for a route that redirects to another route$/, function () {
  redirectType = MOVED_TEMPORARILY;
  return this.makeRequest({url: '/redirect'});
});

Then('the response redirects to the new route', function (callback) {
  assert.equal(this.serverResponse.statusCode, redirectType);

  callback();
});
