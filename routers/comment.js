const commentRouter = require('express').Router();
const postController = require('../controllers/post_controller');
const commentController = require('../controllers/comment_controller');
const authContext = require('../middlewares/auth_context');
const pagesController = require('../controllers/pages_controller');
const { formErrorHandler } = require('../errors/errorHandlers');

// Create comment
commentRouter.post(
    '/:postId',
    authContext.restrictedResource(authContext.ROLES.user),
    commentController.createComment,
    // pagesController.redirectTo('/')
);

module.exports = {
    commentRouter
};