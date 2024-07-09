const { AuthError, ValidationError } = require('./index');
const logger = require('../utils/logger')('form_handler');

/**
 * @param {Error} err
 * @param {import('express').Request & { session: { context: { username: string, role: string } } }} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */
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

module.exports = {
    formErrorHandler
}