const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video_id: { type: Number, required: true },
  image: String,
  duration: Number,
  video_url: String,
  user_name: String,
});

module.exports = mongoose.model("Favorite", favoriteSchema);
