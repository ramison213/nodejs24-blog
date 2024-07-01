const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */

function addPageContext(req, resp, next) {
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

module.exports = {
    addPageContext,
    renderPage
}