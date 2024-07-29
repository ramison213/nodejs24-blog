const { AuthError, ValidationError } = require('./index');
const logger = require('../utils/logger')('error_handler');

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
            data: { ...req.body },
            errors: err.errors
        }

        delete req.__pageContext.data.password;
        logger.info('Saved metadata in context:', req.__pageContext);

        return next();
    }

    next(err);
}

const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

function globalErrorHandler(err, req, resp, _next) {
    logger.error('Unexpected server error', err);
    resp.status(500).render('./errors/500');
}

function notFoundHandler(msg) {
    return (req, resp, _next) => {
        resp.status(404).render('errors/404', { message: msg });
    }
}

module.exports = {
    formErrorHandler,
    withAsyncHandler,
    globalErrorHandler,
    notFoundHandler
}