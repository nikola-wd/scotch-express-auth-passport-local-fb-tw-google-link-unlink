// app/routes.js
module.exports = (app, passport) => {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', (req, res) => {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });



  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });



  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // =====================================
  // LOGIN LOCAL =========================
  // =====================================
  // show the login form
  app.get('/login', (req, res) => {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));



  // =====================================
  // SIGNUP LOCAL ========================
  // =====================================
  // show the signup form
  app.get('/signup', (req, res) => {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));








  // --------------- 3RD PARTY AUTH ----------------------------------------------


  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // ------------- END FB AUTH ROUTES ----------------------------------------------------






  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
  // ------------- END TWITTER AUTH ROUTES ----------------------------------------------------






  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));
  // ------------- END GOOGLE AUTH ROUTES ----------------------------------------------------





  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================
  // LOCALLY --------------------------------
  app.get('/connect/local', (req, res) => {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // FACEBOOK -------------------------------
  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));


  // TWITTER --------------------------------
  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback', passport.authorize('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));


  // GOOGLE ---------------------------------
  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));







  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', (req, res) => {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save((err) => {
      res.redirect('/profile');
    });
  });

  // ---- FOR SOCIAL MEDIA PROFILES WE ARE JUST REMOVING TOKEN, OTHER INFO STAYS IN CASE USER CHANGES HIS MIND AND WANT'S TO CONNECT AGAIN ---- //
  // facebook -------------------------------
  app.get('/unlink/facebook', (req, res) => {
    var user            = req.user;
    user.facebook.token = undefined;
    user.save((err) => {
      res.redirect('/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', (req, res) => {
    var user           = req.user;
    user.twitter.token = undefined;
    user.save((err) => {
      res.redirect('/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', (req, res) => {
    var user          = req.user;
    user.google.token = undefined;
    user.save((err) => {
      res.redirect('/profile');
    });
  });






}; // end module.exports








// ROUTE MIDDLEWARE to ensure user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) { return next(); }
  // if they aren't redirect them to the home page
  res.redirect('/');
}