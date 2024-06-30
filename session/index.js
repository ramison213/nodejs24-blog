const { session: sessionConfig } = require('config');

const expressSession = require('express-session');
const MongoStorage = require('connect-mongo');

const cookieParams = {
    httpOnly: true,
    sameSite: 'strict',
    secure: sessionConfig.secureCookie
}

const sessionStore = MongoStorage.create({
    mongoUrl: process.env.DATA_SOURCE,
})

const sessionMiddleware = expressSession({
    secret: sessionConfig.secret,
    name: sessionConfig.cookieName,
    cookie: cookieParams,
    saveUninitialized: false,
    resave: false,
    store: sessionStore
});

module.exports = {
    sessionMiddleware
};