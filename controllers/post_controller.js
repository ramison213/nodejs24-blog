const userService = require('../services/user_service');
const postService = require('../services/post_service');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

module.exports = {}