'use strict';

function validateString(value) {
  if (!value) {
    return ''
  }

  value = String(value);
  return value.trim();
}

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
  if (json.user) {
    json = json.user;
  }

  var profile = {};
  profile.id = validateString(json.id);
  /*jshint camelcase: false */
  profile.displayName = validateString(json.full_name);
  profile.name = profile.name || {};
  profile.name.givenName = validateString(json.first_name);
  profile.name.familyName = validateString(json.last_name);
  profile.username = validateString(json.username);
  profile.language = validateString(json.language || 'en');
  if (json.contributor_id) {
    profile.profileUrl = 'http://www.shutterstock.com/gallery-' + json.id + 'p1.html';
  }
  /*jshint camelcase: true */
  if (json.email) {
    profile.emails = [{
      value: validateString(json.email)
    }];
  }

  return profile;
};
