const ratingDao = require("../dao/ratingDao");

/**
 * Obtiene las calificaciones de un video y calcula el promedio.
 */
exports.getRatings = async (req, res) => {
  try {
    const { videoId } = req.params;
    const ratings = await ratingDao.getRatingsByVideo(videoId);

    const average =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        : 0;

    res.json({ ratings, average });
  } catch (error) {
    console.error("Error al obtener calificaciones:", error);
    res.status(500).json({ message: "Error al obtener calificaciones" });
  }
};

/**
 * Agrega o actualiza la calificación de un usuario para un video.
 */
exports.addRating = async (req, res) => {
  try {
    const { video_id, user_id, rating } = req.body;

    if (!video_id || !user_id || !rating) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const result = await ratingDao.addOrUpdateRating({ video_id, user_id, rating });
    res.json({ message: "Calificación guardada", rating: result });
  } catch (error) {
    console.error("Error al agregar calificación:", error);
    res.status(500).json({ message: "Error al agregar calificación" });
  }
};