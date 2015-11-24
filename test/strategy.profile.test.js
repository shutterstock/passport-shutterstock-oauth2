/* global describe, it, expect, before */
/* jshint expr: true */

var ShutterstockStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  var strategy =  new ShutterstockStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
  
  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (url != 'https://api.shutterstock.com/v2/user') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
    
    var body = '{"user": {"customer_id": "1234567890", "first_name": "Anony", "full_name": "Anony Mouse", "id": "987654321", "last_name": "Mouse", "language": "fr", "organization_id": "654321", "username": "anonymouse"}}';
  
    callback(null, body, undefined);
  };
    
  describe('loading profile', function() {
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('shutterstock');
      
      expect(profile.id).to.equal('987654321');
      expect(profile.username).to.equal('anonymouse');
      expect(profile.displayName).to.equal('Anony Mouse');
      expect(profile.emails).to.not.exist;
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('encountering an error', function() {
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });
  
});
