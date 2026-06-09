const favoriteDAO = require("../dao/FavoriteDao");

exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await favoriteDAO.getFavoritesByUser(userId);
    res.json(favorites);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { video_id, image, duration, video_url, user_name } = req.body;

    // Evitar duplicados
    const existing = await favoriteDAO.getFavoriteByUserAndVideo(userId, video_id);
    if (existing) {
      return res.status(400).json({ message: "El video ya está en favoritos" });
    }

    const newFavorite = await favoriteDAO.addFavorite({
      userId,
      video_id,
      image,
      duration,
      video_url,
      user_name,
    });

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ message: "Error al agregar favorito" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, videoId } = req.params;

    const deleted = await favoriteDAO.removeFavorite(userId, videoId);
    if (!deleted) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ message: "Error al eliminar favorito" });
  }
};
