const { supabase } = require("../config/database");

/**
 * DAO de comentarios usando Supabase (PostgreSQL).
 * Reemplaza CommentDao de Mongoose.
 */
class CommentDao {
  _check(error, context) {
    if (error) throw new Error(`[CommentDao] ${context}: ${error.message}`);
  }

  async getCommentsByVideo(videoId) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("video_id", videoId)
      .order("created_at", { ascending: false });
    this._check(error, "getCommentsByVideo");
    return data;
  }

  async addComment(commentData) {
    const { data, error } = await supabase
      .from("comments")
      .insert(commentData)
      .select()
      .single();
    this._check(error, "addComment");
    return data;
  }

  async updateComment(commentId, commentText) {
    const { data, error } = await supabase
      .from("comments")
      .update({ comment_text: commentText })
      .eq("id", commentId)
      .select()
      .single();
    this._check(error, "updateComment");
    return data;
  }

  async deleteComment(commentId) {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .select()
      .single();
    this._check(error, "deleteComment");
    return data;
  }
}

module.exports = new CommentDao();