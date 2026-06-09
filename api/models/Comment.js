const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  video_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  comment_text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
