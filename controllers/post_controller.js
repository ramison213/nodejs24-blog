const userService = require('../services/user_service');
const postService = require('../services/post_service');
const path = require('path');
const { withAsyncHandler } = require('../errors/errorHandlers');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string } } }} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */
async function createPost(req, resp, next) {
    const { postTitle, postContent } = req.body;
    const username = req.session.context.username;

    const author = await userService.getUserByUsername(username);
    const newPost = await postService.saveNewPost({ title: postTitle, content: postContent, author: author._id });

    logger.info(`new post [${newPost.title}] successfully created by [${newPost.author}]`);

    next();
}

async function fetchAllPosts(req, resp, next) {
    const postsList = await postService.getAllPosts();

    req.__pageContext.postsList = postService.formatPostDates(postsList);

    next();
}

async function fetchUserPosts(req, resp, next) {
    const user = await userService.getUserByUsername(req.session.context.username);
    const postsList = await postService.getUserPosts(user._id);

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