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
  profile.username = json.username;
  if (json.contributor_id) {
    profile.profileUrl = 'http://www.shutterstock.com/gallery-' + json.id + 'p1.html';
  }
  /*jshint camelcase: true */
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  if (json.can_license_enhanced) {
    profile.can_license_enhanced = json.can_license_enhanced;
  }
  if (json.organization_id) {
    profile.organization_id = json.organization_id;
  }
  
  return profile;
};
