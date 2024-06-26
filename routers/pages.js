const { Router } = require('express');
const pagesRouter = new Router();
// const userService = require('../services/user_service');

// Home page
pagesRouter.get('/', (req, resp) => {
    // const userList = userService.getUserList();
    resp.render('./pages/index', {
        url: req.url
    });
})

// My posts page
pagesRouter.get('/my-posts', (req, resp) => {
    resp.render('./pages/my-posts', {
        url: req.url
    });
})


// Login (sign-in) page
pagesRouter.get('/login', (req, resp) => {
    resp.render('./pages/login', {
        url: req.url
    });
})

// Register (sign-up) page
pagesRouter.get('/register', (req, resp) => {
    resp.render('./pages/register', {
        url: req.url
    });
})

// Auth - logout
pagesRouter.get('/logout', (req, resp) => {
    // TODO change logout func
    resp.redirect('/');
});

module.exports = {
    pagesRouter
}
