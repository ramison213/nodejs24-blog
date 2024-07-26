const postService = require('../services/post_service');
const path = require('path');
const { withAsyncHandler } = require('../errors/errorHandlers');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string, userId: string } } }} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */
async function createPost(req, resp, next) {
    const { postTitle, postContent } = req.body;

    const newPost = await postService.saveNewPost({
        title: postTitle,
        content: postContent,
        author: req.session.context.userId
    });

    logger.info(`new post [${newPost.title}] successfully created by [${newPost.author}]`);

    next();
}

async function fetchAllPosts(req, resp, next) {
    const postsList = await postService.getAllPosts();

    req.__pageContext.postsList = postService.formatPostDates(postsList);

    next();
}

async function fetchUserPosts(req, resp, next) {
    const postsList = await postService.getUserPosts(req.session.context.userId);

    req.__pageContext.userPostsList = postService.formatPostDates(postsList);

    next();
}

async function deletePost(req, resp, next) {
    const { postId } = req.params;
    await postService.deletePostById(postId);

    next();
}

module.exports = {
    createPost: withAsyncHandler(createPost),
    fetchAllPosts: withAsyncHandler(fetchAllPosts),
    fetchUserPosts: withAsyncHandler(fetchUserPosts),
    deletePost: withAsyncHandler(deletePost)
}