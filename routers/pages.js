const express = require('express');
const { Router } = require('express');
const pagesRouter = new Router();
const authController = require('../controllers/auth_controller');
const pagesController = require('../controllers/pages_controller');
const postController = require('../controllers/post_controller');
const authContext = require('../middlewares/auth_context');
const { userValidator } = require('../middlewares/user_validator');
const { postValidator } = require('../middlewares/post_validator');
const { formErrorHandler } = require('../errors/errorHandlers');

const formDataParser = express.urlencoded({ extended: false });

pagesRouter.use(pagesController.addPageContext);

// Home page
pagesRouter.route('/')
    .get(
        postController.fetchAllPosts,
        pagesController.renderPage('./pages/index')
    )

// My posts page
pagesRouter.route('/my-posts')
    .all(
        authContext.restrictedResource(authContext.ROLES.user)
    )
    .get(
        postController.fetchUserPosts,
        pagesController.renderPage('./pages/my-posts')
    )
    .post(
        formDataParser,
        postValidator,
        postController.createPost,
        formErrorHandler,
        postController.fetchUserPosts,
        pagesController.renderPage('./pages/my-posts')
    )

// Login (sign-in) page
pagesRouter.route('/login')
    .get(pagesController.renderPage('./pages/login'))
    .post(
        formDataParser,
        userValidator,
        authController.logUserIn,
        authContext.authInitSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage('./pages/login')
    )

// Sign-up page
pagesRouter.route('/signup')
    .get(pagesController.renderPage('./pages/signup'))
    .post(
        formDataParser,
        userValidator,
        authController.createUserAccount,
        authContext.authInitSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage('./pages/signup')
    )

// Auth - logout
pagesRouter.get('/logout', authContext.authDestroySessionAndRedirect);

module.exports = {
    pagesRouter
}