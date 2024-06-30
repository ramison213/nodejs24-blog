const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

const ROLES = {
    admin: 'admin',
    user: 'user'
}

/**
 *
 * @param {string?} redirectTo
 * @returns {(function(
 *      req: import('express').Request & { __authContext: { role: string, username: string } },
 *      resp: import('express').Response
 * ): void)|*}
 */

function authInitSessionAndRedirect(redirectTo) {
    return (req, resp) => {
        logger.info(`Creating session for [${req.__authContext.role}] [${req.__authContext.username}]`);
        req.session.context = req.__authContext;

        resp.redirect(redirectTo || req.baseUrl || '/');
    };
}

module.exports = {
    ROLES,
    authInitSessionAndRedirect
}