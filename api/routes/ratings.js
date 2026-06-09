const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");


// Obtener calificaciones de un video
router.get("/:videoId", ratingController.getRatings);

// Agregar o actualizar calificación
router.post("/", ratingController.addRating);

module.exports = router;