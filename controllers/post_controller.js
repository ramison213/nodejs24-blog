const userService = require('../services/user_service');
const postService = require('../services/post_service');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

async function deletePost(req, resp, next) {
    const { postId } = req.params;
    await postService.deletePostById(postId);

    next();
}

module.exports = {
    deletePost
}