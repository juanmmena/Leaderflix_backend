const CommentDao = require("../dao/CommentDao");

exports.getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await CommentDao.getCommentsByVideo(videoId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await CommentDao.addComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error al agregar comentario" });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment_text } = req.body;
    const updated = await CommentDao.updateComment(commentId, comment_text);
    if (!updated) return res.status(404).json({ message: "Comentario no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar comentario" });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await CommentDao.deleteComment(commentId);
    if (!deleted) return res.status(404).json({ message: "Comentario no encontrado" });
    res.json({ message: "Comentario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar comentario" });
  }
};
