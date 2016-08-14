'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('passport:shutterstock:strategy');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var util = require('util');

var Profile = require('./profile');

/**
 * `Strategy` constructor.
 *
 * The Shutterstock authentication strategy authenticates requests by delegating to
 * Shutterstock using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Shutterstock application's Client ID
 *   - `clientSecret`  your Shutterstock application's Client Secret
 *   - `callbackURL`   URL to which Shutterstock will redirect the user after granting authorization
 *   - `realm`         Which user type. valid realms include: 'contributor', 'customer' (default is 'customer')
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'user.view', 'licenses.create', 'licenses.view', 'purchases.view', or none (default is 'user.view').
 *                     (see https://developers.shutterstock.com/guides/authentication#scopes for more info)
 *   — `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *                     (see https://developers.shutterstock.com/guides/authentication#grant-types for more info)
 *
 * Examples:
 *
 *     passport.use(new ShutterstockStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/shutterstock/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
var SERVER = 'https://api.shutterstock.com/v2';

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || SERVER + '/oauth/authorize';
  options.tokenURL = options.tokenURL || SERVER + '/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};
  this._realm = options.realm || null;
  options.state = true;

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-shutterstock-oauth2';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'shutterstock';
  this._userProfileURL = SERVER + '/user';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Include the realm parameter if specified
 */
Strategy.prototype.authorizationParams = Strategy.prototype.tokenParams = function() {
  if (this._realm) {
    return {
      realm: this._realm
    };
  }
  return {};
};
/**
 * Retrieve user profile from Shutterstock.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `shutterstock`
 *   - `id`               the user's Shutterstock ID
 *   - `username`         the user's Shutterstock username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Shutterstock
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  debug('Access Token', accessToken);

  this._oauth2.get(this._userProfileURL, accessToken, function(err, body) {
    var json;

    if (err) {
      debug(err)
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      debug(ex);
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'shutterstock';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
