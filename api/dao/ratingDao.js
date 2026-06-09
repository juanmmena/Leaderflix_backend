const { supabase } = require("../config/database");

/**
 * DAO de calificaciones usando Supabase (PostgreSQL).
 * Reemplaza ratingDao de Mongoose.
 */

async function getRatingsByVideo(videoId) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("video_id", videoId);
  if (error) throw new Error(`[RatingDao] getRatingsByVideo: ${error.message}`);
  return data;
}

/**
 * Inserta o actualiza (upsert) la calificación de un usuario para un video.
 * Equivale al findOneAndUpdate con upsert:true de Mongoose.
 */
async function addOrUpdateRating({ video_id, user_id, rating }) {
  const { data, error } = await supabase
    .from("ratings")
    .upsert(
      { video_id, user_id, rating },
      { onConflict: "video_id,user_id" } // respeta el UNIQUE del schema
    )
    .select()
    .single();
  if (error) throw new Error(`[RatingDao] addOrUpdateRating: ${error.message}`);
  return data;
}

module.exports = { getRatingsByVideo, addOrUpdateRating };