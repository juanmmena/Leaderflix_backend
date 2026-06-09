const Favorite = require("../models/Favorite");

class FavoriteDAO {
  async getFavoritesByUser(userId) {
    return await Favorite.find({ userId });
  }

  async getFavoriteByUserAndVideo(userId, video_id) {
    return await Favorite.findOne({ userId, video_id });
  }

  async addFavorite(data) {
    const newFavorite = new Favorite(data);
    return await newFavorite.save();
  }

  async removeFavorite(userId, video_id) {
    return await Favorite.findOneAndDelete({ userId, video_id });
  }
}

module.exports = new FavoriteDAO();
