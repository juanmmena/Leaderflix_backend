import Rating from "../models/Rating.js";

export async function getRatingsByVideo(videoId) {
  return await Rating.find({ video_id: videoId });
}

export async function addOrUpdateRating({ video_id, user_id, rating }) {
  return await Rating.findOneAndUpdate(
    { video_id, user_id },
    { rating },
    { new: true, upsert: true }
  );
}
