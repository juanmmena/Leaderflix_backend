const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    video_id: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

// Evita duplicados: un usuario solo puede calificar un video una vez
ratingSchema.index({ video_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);

