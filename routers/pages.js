const express = require('express');
const { Router } = require('express');
const pagesRouter = new Router();
const authController = require('../controllers/auth_controller');
const pagesController = require('../controllers/pages_controller');
const { AuthError, ValidationError } = require('../errors');
const authContext = require('../middlewares/auth_context');
const { userValidator } = require('../middlewares/user_validator');
const { postValidator } = require('../middlewares/post_validator');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

const formDataParser = express.urlencoded({ extended: false });

async function formErrorHandler(err, req, resp, next) {
    logger.error('ERROR', err.message, err);

    if (err instanceof ValidationError || err instanceof AuthError) {
        req.__pageContext = {
            ...req.__pageContext,
            data: req.body,
            errors: err.errors
        }

        delete req.__pageContext.data.password;
        logger.info('Saved metadata in context:', req.__pageContext);

        return next();
    }

    next(err);
}

pagesRouter.use(pagesController.addPageContext);

// Home page
pagesRouter.route('/')
    .get(
        pagesController.fetchAllPosts,
        pagesController.renderPage('./pages/index')
    )

// My posts page
pagesRouter.route('/my-posts')
    .all(
        authContext.restrictedResource(authContext.ROLES.user)
    )
    .get(
        pagesController.fetchUserPosts,
        pagesController.renderPage('./pages/my-posts')
    )
    .post(
        formDataParser,
        postValidator,
        pagesController.createPost,
        formErrorHandler,
        pagesController.fetchUserPosts,
        pagesController.handlePostCreation
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