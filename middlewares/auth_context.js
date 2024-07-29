const { session: sessionConfig } = require('config');
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

function authDestroySessionAndRedirect(req, resp) {
    if (!req.session.context) {
        logger.warn('No session context found');
        resp.clearCookie(sessionConfig.cookieName);

        return resp.redirect(req.baseUrl || '/');
    }

    const { role, username } = req.session.context;

    req.session.destroy((err) => {
        if (err) {
            logger.error(`Error destroying session for [${role}] [${username}]`, err);
            resp.clearCookie(sessionConfig.cookieName);

            return resp.redirect(`${req.baseUrl}/`);
        }

        logger.info(`Session for [${role}] [${username}] terminated`);
        resp.clearCookie(sessionConfig.cookieName);

        resp.redirect(`${req.baseUrl}/`);
    });
}

/**
 * @param {ROLES[]} availableForRoles
 */
function restrictedResource(availableForRoles = []) {
    return (req, resp, next) => {
        const role = req.session?.context?.role || 'unauthorised';

        if (availableForRoles.includes(role)) {
            return next();
        }

        // if no session - redirect back to home
        logger.info(`Resource is unavailable for [${role}]!`);
        resp.redirect(`${req.baseUrl}/login`);
    };
}

module.exports = {
    ROLES,
    authInitSessionAndRedirect,
    authDestroySessionAndRedirect,
    restrictedResource
}