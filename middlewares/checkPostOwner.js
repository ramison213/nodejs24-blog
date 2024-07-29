const Post = require('../models/post');
const { notFoundHandler } = require('../errors/errorHandlers');
const logger = require('../utils/logger')('check_post_owner');


async function checkPostOwner(req, res, next) {
    try {
        const postId = req.params.postId;
        const userId = req.session.context.userId;

        const post = await Post.findById(postId);

        if (!post) {
            logger.info('Post not found', postId);

            return notFoundHandler('Post not found');
        }

        if (post.author.toString() !== userId) {
            logger.info('User do not have permission', `userId: ${userId}, `, `postId: ${postId}, `);

            return notFoundHandler('You do not have permission to delete this post');
        }

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkPostOwner
};