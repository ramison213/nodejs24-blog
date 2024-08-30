const Comment = require('../models/comment');
const Post = require('../models/post');
const { NotFoundError } = require("../errors");

/**
 * @property {string} content
 * @property {string} author
 * @property {string} post
 * @returns {Promise<Object>}
 */
async function saveNewComment({ content, authorId, postId }) {
    const post = await Post.findById(postId);

    if (post) {
        const newComment = new Comment({ content, author: authorId, post: postId });
        await newComment.save();
        post.comments.push(newComment);
        await post.save();

        return newComment;
    } else {
        throw new NotFoundError({ msg: 'Post not found' });
    }
}


module.exports = {
    saveNewComment
};