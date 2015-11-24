'use strict';

/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  if (json.user){
    json = json.user;
  }
  
  var profile = {};
  profile.id = String(json.id);
  /*jshint camelcase: false */
  profile.displayName = json.full_name;
  profile.name = profile.name || {};
  profile.name.givenName = json.first_name;
  profile.name.familyName = json.last_name;
  profile.username = json.username;
  if (json.contributor_id) {
    profile.profileUrl = 'http://www.shutterstock.com/gallery-' + json.id + 'p1.html';
  }
  /*jshint camelcase: true */
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  
  return profile;
};
