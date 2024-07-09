const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));
const postService = require('../services/post_service');
const userService = require('../services/user_service');

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string } } }} req
 * @param {import('express').Response} _resp
 * @param {import('express').NextFunction} next
 */
function addPageContext(req, _resp, next) {
    const isLoggedIn = !!req.session?.context?.role;
    req.__pageContext = {
        isLoggedIn,
        role: req.session?.context?.role,
        currentUrl: req.url
    };

    const userMark = isLoggedIn ? `${req.__pageContext.role} ${req.session.context.username}`: 'unauthorized';
    logger.info(`page access from [${userMark}]`);

    next();
}

/**
 * @param {string} templateName
 */
function renderPage(templateName) {
    return (req, resp) => {
        resp.render(templateName, req.__pageContext);
    }
}

/**
 * @param {string} url
 * @returns {Function}
 */
function redirectTo(url) {
    return (req, resp) => {
        resp.redirect(`${url}`);
    };
}

async function handlePostCreation(req, resp, next) {
    if (req.__pageContext.errors) {
        renderPage('./pages/my-posts')(req, resp, next);
    } else {
        redirectTo('/my-posts')(req, resp, next);
    }
}

module.exports = {
    addPageContext,
    renderPage,
    redirectTo,
    handlePostCreation
}