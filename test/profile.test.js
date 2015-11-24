'use strict';

/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {
    
  describe('example profile', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/data/example_customer.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('987654321');
      expect(profile.username).to.equal('anonymouse');
      expect(profile.displayName).to.equal('Anony Mouse');
      expect(profile.name.givenName).to.equal('Anony');
      expect(profile.name.familyName).to.equal('Mouse');
      expect(profile.profileUrl).to.not.exist;
      expect(profile.emails).to.have.length(1);
    });
  });

  describe('example contributor profile', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/data/example_contributor.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('2271398');
      expect(profile.username).to.equal('anonymouse');
      expect(profile.displayName).to.equal('Anony Mouse');
      expect(profile.name.givenName).to.equal('Anony');
      expect(profile.name.familyName).to.equal('Mouse');
      expect(profile.profileUrl).to.equal('http://www.shutterstock.com/gallery-' + profile.id + 'p1.html');
      expect(profile.emails).to.have.length(1);
    });
  });
  
  describe('example profile with null email', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/data/example-null-email.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('987654321');
      expect(profile.username).to.equal('anonymouse');
      expect(profile.displayName).to.equal('Anony Mouse');
      expect(profile.name.givenName).to.equal('Anony');
      expect(profile.name.familyName).to.equal('Mouse');
      expect(profile.profileUrl).to.not.exist;
      expect(profile.emails).to.not.exist;
    });
  });
  
});
