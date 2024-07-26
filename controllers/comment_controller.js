const commentService = require('../services/comment_service');
const { withAsyncHandler } = require('../errors/errorHandlers');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string, userId: string } } }} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */
async function createComment(req, resp, next) {
    const { commentContent } = req.body;
    const username = req.session.context.username;

    const postId = req.params.postId;
    await commentService.saveNewComment({
        content: commentContent,
        authorId: req.session.context.userId,
        postId: postId
    });

    logger.info(`new comment successfully created by [${username}]`);

    next();
}


module.exports = {
    createComment: withAsyncHandler(createComment),
}