const Comment = require('../models/comment');
const Post = require('../models/post');

/**
 * @property {string} content
 * @property {string} author
 * @property {string} post
 * @returns {Promise<Object>}
 */
async function saveNewComment({ content, authorId, postId }) {
    const newComment = new Comment({ content, author: authorId, post: postId });
    await newComment.save();

    const post = await Post.findById(postId);

    if (post) {
        post.comments.push(newComment);
        await post.save();
    }

    return newComment;
}

module.exports = {
    saveNewComment
};