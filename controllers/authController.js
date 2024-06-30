const bcrypt = require('bcrypt');
const User = require('../models/User');
const { ROLES } = require('../middlewares/authContext');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));
const { AuthError } = require('../errors');

const MESSAGES = {
    TAKEN: 'Cannot use this username',
    AUTH_UNKNOWN_ERROR: 'Unknown auth error'
}

async function createUserAccount(req, resp, next) {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(7);
        const hashedPass = await bcrypt.hash(password, salt);
        const role = ROLES.user;

        const newUser = new User({ username, password: hashedPass, role });
        await newUser.save();

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
    createUserAccount
}