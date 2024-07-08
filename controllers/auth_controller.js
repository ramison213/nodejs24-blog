const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));
const bcrypt = require('bcrypt');
const authContext = require('../middlewares/auth_context');
const { AuthError } = require('../errors');
const userService = require('../services/user_service');

const MESSAGES = {
    TAKEN: 'Cannot use this username',
    AUTH_UNKNOWN_ERROR: 'Unknown auth error',
    INVALID_CREDENTIALS: 'Invalid creds!',
    DB_ERROR: 'Database error',
}

async function logUserIn(req, resp, next) {
    const { username, password } = req.body;
    let user;

    try {
        user = await userService.getUserByUsername(username);
    } catch (err) {
        if (err.name === 'MongoServerError') {
            return next(new AuthError({
                msg: MESSAGES.DB_ERROR,
                errors: { auth: MESSAGES.DB_ERROR }
            }));
        }

        next(new AuthError({
            msg: MESSAGES.AUTH_UNKNOWN_ERROR,
            errors: { auth: MESSAGES.AUTH_UNKNOWN_ERROR }
        }));
    }

    if (!user) {
        return next(new AuthError({
            msg: `user [${username}] - invalid creds`,
            errors: { auth: MESSAGES.INVALID_CREDENTIALS }
        }));
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
        return next(new AuthError({
            msg: `user [${username}] - invalid creds`,
            errors: { auth: MESSAGES.INVALID_CREDENTIALS }
        }));
    }

    const role = user.role || authContext.ROLES.user;
    req.__authContext = { username, role };

    logger.info(`user [${username}] with role [${role}] - successfully logged in`);

    next();
}

async function createUserAccount(req, resp, next) {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(7);
        const hashedPass = await bcrypt.hash(password, salt);
        const role = authContext.ROLES.user;

        const newUser = await userService.saveNewUser({ username, hashedPass, role });

        req.__authContext = { username, role };
        logger.info(`User [${newUser.username}] with role [${newUser.role}] successfully created`);

        next();
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return next(new AuthError({
                msg: MESSAGES.TAKEN,
                errors: { username: [MESSAGES.TAKEN] }
            }));
        }

        next(new AuthError({
            msg: MESSAGES.AUTH_UNKNOWN_ERROR,
            errors: { username: [MESSAGES.AUTH_UNKNOWN_ERROR] }
        }));
    }
}

module.exports = {
    logUserIn,
    createUserAccount
}