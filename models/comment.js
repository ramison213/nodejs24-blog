const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

const Comment = model('Comment', commentSchema);

module.exports = Comment;