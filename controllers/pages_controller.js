const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));
const postService = require('../services/post_service');
const userService = require('../services/user_service');

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string } } }} req
 * @param {import('express').Response} _resp
 * @param {import('express').NextFunction} next
 */
function addPageContext(req, _resp, next) {
    const isLoggedIn = !!req.session?.context?.role;
    req.__pageContext = {
        isLoggedIn,
        role: req.session?.context?.role,
        currentUrl: req.url
    };

    const userMark = isLoggedIn ? `${req.__pageContext.role} ${req.session.context.username}`: 'unauthorized';
    logger.info(`page access from [${userMark}]`);

    next();
}

/**
 * @param {import('express').Request & { session: { context: { username: string, role: string } } }} req
 * @param {import('express').Response} _resp
 * @param {import('express').NextFunction} next
 */
async function createPost(req, _resp, next) {
    const { postTitle, postContent } = req.body;
    const username = req.session.context.username;

    try {
        const author = await userService.getUserByUsername(username);
        const newPost = await postService.saveNewPost({ title: postTitle, content: postContent, author: author._id });

        logger.info(`new post [${newPost.title}] successfully created by [${newPost.author}]`);

        next();
    } catch (err) {
        next(err);
    }
}

async function fetchAllPosts(req, _resp, next) {
    const postsList = await postService.getAllPosts();

    req.__pageContext.postsList = postService.formatPostDates(postsList);

    next();
}

async function fetchUserPosts(req, _resp, next) {
    const user = await userService.getUserByUsername(req.session.context.username);
    const postsList = await postService.getUserPosts(user._id);

    req.__pageContext.userPostsList = postService.formatPostDates(postsList);

    next();
}

/**
 * @param {string} templateName
 */
function renderPage(templateName) {
    return (req, resp) => {
        resp.render(templateName, req.__pageContext);
    }
}

module.exports = {
    addPageContext,
    createPost,
    fetchAllPosts,
    fetchUserPosts,
    renderPage
}