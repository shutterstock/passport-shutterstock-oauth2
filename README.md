# Passport-Shutterstock

[Passport](http://passportjs.org/) strategy for authenticating with [Shutterstock](https://shutterstock.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Shutterstock in your Node.js applications.
By plugging into Passport, Shutterstock authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-shutterstock-oauth2

## Usage

#### Configure Strategy

The Shutterstock authentication strategy authenticates users using a Shutterstock account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new ShutterstockStrategy({
        clientID: process.env.SHUTTERSTOCK_CLIENT_ID,
        clientSecret: process.env.SHUTTERSTOCK_CLIENT_SECRET,
        callbackURL: 'http://127.0.0.1:3000/auth/shutterstock/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ shutterstockId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

For more configuration options see the [login example](/examples/login) or [developers.shutterstock.com](https://developers.shutterstock.com/guides/authentication).

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'shutterstock'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/shutterstock',
      passport.authenticate('shutterstock'));

    app.get('/auth/shutterstock/callback',
      passport.authenticate('shutterstock', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](/examples/login).

    $ export DEBUG="*passport*,*session*"
    $ cd examples/login
    $ npm install
    $ npm start
    $ open http://localhost:3000

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/shutterstock/passport-shutterstock-oauth2.png)](http://travis-ci.org/shutterstock/passport-shutterstock-oauth2)

## Credits

  This strategy is based on Jared Hanson's GitHub strategy for passport:
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2017 Shutterstock <[http://shutterstock.com/](http://shutterstock.com/)>

Copyright (c) 2011-2015 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
