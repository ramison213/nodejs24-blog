const logger = require('../utils/logger')('pages controller');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */


/**
 * @param {string} templateName
 */

function renderPage(templateName) {
    return (req, resp) => {
        resp.render(templateName, req.__pageContext);
    }
}

module.exports = {
    renderPage
}