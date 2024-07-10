const commentRouter = require('express').Router();
const commentController = require('../controllers/comment_controller');
const authContext = require('../middlewares/auth_context');
const pagesController = require('../controllers/pages_controller');
const { formErrorHandler } = require('../errors/errorHandlers');
const express = require('express');

const formDataParser = express.urlencoded({ extended: false });

// Create comment
commentRouter.route('/:postId')
    .post(
        formDataParser,
        authContext.restrictedResource(authContext.ROLES.user),
        commentController.createComment,
        pagesController.redirectToPrevPage()
    );

module.exports = {
    commentRouter
};