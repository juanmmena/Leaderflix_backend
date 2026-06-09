const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/FavoriteController");

router.get("/:userId", favoriteController.getFavorites);
router.post("/:userId", favoriteController.addFavorite);
router.delete("/:userId/:videoId", favoriteController.removeFavorite);

module.exports = router;
