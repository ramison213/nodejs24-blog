const { Router } = require('express');
const { createUserAccount } = require("../controllers/authController");
const pagesRouter = new Router();
const express = require('express');

const formDataParser = express.urlencoded({ extended: false });

pagesRouter.use((req, res, next) => {
    res.locals.url = req.url;
    next();
});

// Home page
pagesRouter.get('/', (req, resp) => {
    // const userList = userService.getUserList();
    resp.render('./pages/index');
})

// My posts page
pagesRouter.get('/my-posts', (req, resp) => {
    resp.render('./pages/my-posts');
})

// Login (sign-in) page
pagesRouter.get('/login', (req, resp) => {
    resp.render('./pages/login');
})

// Sign-up page
pagesRouter.route('/signup')
    .get((req, resp) => {
        resp.render('./pages/signup');
    })
    .post(
        formDataParser,
        createUserAccount
    )

// Auth - logout
pagesRouter.get('/logout', (req, resp) => {
    // TODO change logout func
    resp.redirect('/');
});

module.exports = {
    pagesRouter
}