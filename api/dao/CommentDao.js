const Comment = require("../models/Comment");

class CommentDao {
    async getCommentsByVideo (videoId) {
        return await Comment.find({ video_id: videoId });
    };

    async addComment (commentData) {
        const comment = new Comment(commentData);
        return await comment.save();
    };

    async updateComment (commentId, commentText) {
        return await Comment.findByIdAndUpdate(
            commentId,
            { comment_text: commentText },
            { new: true }
        );
    };

    async deleteComment (commentId) {
        return await Comment.findByIdAndDelete(commentId);
    };
}

module.exports = new CommentDao();