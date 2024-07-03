const express = require('express');
const { Router } = require('express');
const { createUserAccount, logUserIn } = require('../controllers/authController');
const pagesController = require('../controllers/pagesController');
const pagesRouter = new Router();
const { userValidator } = require('../middlewares/validators');
const { AuthError, ValidationError } = require('../errors');
const { authInitSessionAndRedirect, authDestroySessionAndRedirect, restrictedResource, ROLES } = require('../middlewares/authContext');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

const formDataParser = express.urlencoded({ extended: false });

async function formErrorHandler(err, req, resp, next) {
    logger.error(err.message, err);

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
pagesRouter.get('/',
    pagesController.renderPage('./pages/index')
)

// My posts page
pagesRouter.route('/my-posts')
    .get(
        restrictedResource(ROLES.user),
        pagesController.renderPage('./pages/my-posts')
    )

// Login (sign-in) page
pagesRouter.route('/login')
    .get(pagesController.renderPage('./pages/login'))
    .post(
        formDataParser,
        userValidator,
        logUserIn,
        authInitSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage('./pages/login')
    )

// Sign-up page
pagesRouter.route('/signup')
    .get(pagesController.renderPage('./pages/signup'))
    .post(
        formDataParser,
        userValidator,
        createUserAccount,
        authInitSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage('./pages/signup')
    )

// Auth - logout
pagesRouter.get('/logout', authDestroySessionAndRedirect);

module.exports = {
    pagesRouter
}