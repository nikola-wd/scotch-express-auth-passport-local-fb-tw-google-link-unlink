// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth': {
    'clientID': 'FB_CLIENT_ID_HERE', // your App ID
    'clientSecret': 'FB_CLIENT_SECRET_HERE', // your App Secret
    'callbackURL': 'http://localhost:8080/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields': ['id', 'email', 'name'] // For requesting permissions from Facebook API
  },

  'twitterAuth': {
    'consumerKey': 'TWITTER_CONSUMER_KEY_ID_HERE',
    'consumerSecret': 'TWITTER_CONSUMER_SECRET_HERE',
    'callbackURL': 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID': 'GOOGLE_CLIENT_ID_HERE',
    'clientSecret': 'GOOGLE_CLIENT_SECRET_HERE',
    'callbackURL': 'http://localhost:8080/auth/google/callback'
  }

};