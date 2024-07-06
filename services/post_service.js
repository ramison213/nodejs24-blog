const Post = require('../models/post');
const Comment = require('../models/comment');
const moment = require('moment');

/**
 * @typedef {Object} Author
 * @property {string} _id
 * @property {string} username
 */

/**
 * @typedef {Object} Comment
 * @property {string} _id
 * @property {string} content
 * @property {Author} author
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Post
 * @property {string} _id
 * @property {string} title
 * @property {string} content
 * @property {Author} author
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Comment[]} comments
 */

/**
 * @returns {Promise<Post[]>}
 */
async function getAllPosts() {
    return Post
        .find()
        .populate('author', 'username')
        .populate('comments')
        .sort({ createdAt: -1 })
        .lean();
}

/**
 * @param {string} userId
 * @returns {Promise<Post[]>}
 */
async function getUserPosts(userId) {
    return Post
        .find({ author: userId })
        .populate('author', 'username')
        .populate('comments')
        .sort({ createdAt: -1 })
        .lean();
}


/**
 * Formats the date
 * @param {Post[]} posts
 * @returns {Post[]} formatted posts
 */
function formatPostDates(posts) {
    return posts
        .map(post => ({
            ...post,
            createdAt: moment(post.createdAt).format('DD.MM.YYYY HH:mm')
        }));
}

/**
 * @param {String} title
 * @param {String} content
 * @param {String} author
 * @returns {Promise<Object>}
 */
async function saveNewPost({ title, content, author }) {
    const newPost = new Post({ title, content, author });
    await newPost.save();

    return newPost;
}

/**
 * @param {String} postId
 * @returns {Promise<Object>}
 */
// async function deletePostById(postId) {
//     const post = await Post.findByIdAndDelete(postId);
//
//     if (post) {
//         await Comment.deleteMany({ post: postId });
//     }
//
//     return post;
// }

module.exports = {
    getAllPosts,
    saveNewPost,
    // deletePostById,
    formatPostDates,
    getUserPosts
};