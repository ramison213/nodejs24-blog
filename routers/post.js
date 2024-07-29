const postRouter = require('express').Router();
const postController = require('../controllers/post_controller');
const authContext = require('../middlewares/auth_context');
const pagesController = require('../controllers/pages_controller');
const { checkPostOwner } = require('../middlewares/checkPostOwner');

// Delete post by ID
postRouter.delete(
    '/:postId',
    authContext.restrictedResource(authContext.ROLES.user),
    checkPostOwner,
    postController.deletePost,
    pagesController.redirectToPrevPage()
);

module.exports = {
    postRouter
};