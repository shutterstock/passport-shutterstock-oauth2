/* global describe, it, expect, before */
/* jshint expr: true */

var ShutterstockStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  describe('loading profile using custom URL', function() {
    var strategy =  new ShutterstockStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://api.shutterstock.com/v2/user'
      },
      function() {});
  
    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://api.shutterstock.com/v2/user') { return callback(new Error('wrong url argument')); }
      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
    
      var body = '{"user": {"customer_id": "1234567890", "first_name": "Anony", "full_name": "Anony Mouse", "id": "987654321", "last_name": "Mouse", "language": "fr", "organization_id": "654321", "username": "anonymouse"}}';
  
      callback(null, body, undefined);
    };
    
    
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
      expect(profile.profileUrl).to.not.exist;
      expect(profile.emails).to.not.exist;
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
});
