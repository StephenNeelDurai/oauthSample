const conf = require('./conf')
const clientID = conf.clientID;
const clientSecret = conf.clientSecret;
// Required dependencies
const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

//parse body
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//view engine config
app.set('view engine', 'ejs');

// cookieSession config
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:7000/auth/google/callback'
},
    (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        done(null, profile); // passes the profile data to serializeUser
    }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('home.ejs', {});
    }
}

var address = 'India', phone = '9876543210', message = 'This is a sample data for successfull login.';
// Routes
app.get('/', isUserAuthenticated, (req, res) => {
    let user = req.user;
    res.render('home.ejs', { user: { accessToken: user.accessToken, id: user.id, name: user.displayName ? user.displayName : '', isLoggedIn: true, image: user.photos && Array.isArray(user.photos) && user.photos[0] && user.photos[0].value ? user.photos[0].value : null } });
});
//To fetch user data
app.get('/user', (req, res) => {
    try {
        if (checkUseraccessTokenFromGetReq(req)) {
            //Now we can fetch data for this user from db
            //Dummy data for success response
            let userDetails = { address: address, phone: phone };
            res.send({ status: true, data: { user: { details: userDetails, } }, message: message });
        } else {
            res.status(400).send('Parameter Missing');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/user', (req, res) => {
    try {
        if (checkUseraccessTokenFromPostReq(req)) {
            //Now we can update data for this user to db
            //Dummy data for success response
            let userDetails = { name: req.body.user.name };
            res.send({ status: true, data: { user: userDetails }, message: 'User Name Updated Successfully!' });
        } else {
            res.status(400).send('Parameter Missing');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
//To check accessToken is available in request
function checkUseraccessTokenFromPostReq(req) {
    return req && req.body && req.body.accessToken && req.body.user && req.body.user.name
}
function checkUseraccessTokenFromGetReq(req) {
    return req && req.query && req.query.accessToken
}

// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
}));

// The middleware receives the data from Google and runs the function on Strategy config
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
module.exports = app;
