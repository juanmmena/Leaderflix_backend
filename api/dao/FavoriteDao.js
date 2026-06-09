const { supabase } = require("../config/database");

/**
 * DAO de favoritos usando Supabase (PostgreSQL).
 * Reemplaza FavoriteDao de Mongoose.
 */
class FavoriteDAO {
  _check(error, context) {
    if (error) throw new Error(`[FavoriteDAO] ${context}: ${error.message}`);
  }

  async getFavoritesByUser(userId) {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId);
    this._check(error, "getFavoritesByUser");
    return data;
  }

  async getFavoriteByUserAndVideo(userId, videoId) {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .maybeSingle();
    this._check(error, "getFavoriteByUserAndVideo");
    return data; // null si no existe
  }

  async addFavorite(data) {
    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert(data)
      .select()
      .single();
    this._check(error, "addFavorite");
    return favorite;
  }

  async removeFavorite(userId, videoId) {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .select()
      .single();
    this._check(error, "removeFavorite");
    return data;
  }
}

module.exports = new FavoriteDAO();