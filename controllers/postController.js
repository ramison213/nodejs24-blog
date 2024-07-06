const path = require('path');
const { getUserByUsername } = require('../services/user_service');
const { saveNewPost } = require('../services/post_service');
const logger = require('../utils/logger')(path.basename(__filename));

const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

async function createPost(req, resp, next) {
    const { postTitle, postContent } = req.body;
    const username = req.session.context.username;

    try {
        const author = await getUserByUsername(username);
        const newPost = await saveNewPost({ title: postTitle, content: postContent, author: author._id });

        logger.info(`new post [${newPost.title}] successfully created by [${newPost.author}]`);

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createPost: withAsyncHandler(createPost)

}