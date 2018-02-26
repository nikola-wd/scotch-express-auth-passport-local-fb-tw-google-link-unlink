passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
},
  function (req, email, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function () {
      //  Whether we're signing up or connecting an account, we'll need
      //  to know if the email address is in use.
      User.findOne({ 'local.email': email }, function (err, existingUser) {
        // if there are any errors, return the error
        if (err) { return done(err); }
        // check to see if there's already a user with that email
        if (existingUser) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          //  If we're logged in, we're connecting a new local account.
          if (req.user) {
            var user = req.user;
            user.local.email = email;
            user.local.password = user.generateHash(password);
            user.save(function (err) {
              if (err) { throw err; }
              return done(null, user);
            });
          }
        } else {
          // if there is no user with that email
          // We're not logged in, so we're creating a brand new user.
          var newUser = new User();
          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          // save the user
          newUser.save(function (err) {
            if (err) { throw err; }
            return done(null, newUser);
          });
        }
      }); // end User.findOne
    }); // end process.nextTick
  })); // end of local signup strategy && passport.use