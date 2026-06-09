const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { createClient } = require("pexels");
const routes = require("./routes/routes.js");
const { connectDB } = require("./config/database"); // ahora es Supabase

const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS
 */
const allowedOrigins = process.env.ORIGIN?.split(",").map(s => s.trim()).filter(Boolean);
app.use(
  allowedOrigins && allowedOrigins.length > 0
    ? cors({ origin: allowedOrigins })
    : cors()
);

/**
 * Verificar conexión a Supabase al arrancar
 */
connectDB();

/**
 * Pexels client
 */
const pexelsClient = createClient(process.env.PEXELS_API_KEY);

/**
 * GET /api/videos/popular
 */
app.get("/api/videos/popular", async (req, res) => {
  try {
    const data = await pexelsClient.videos.popular({ per_page: 6 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

/**
 * GET /api/videos/search
 */
app.get("/api/videos/search", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const data = await pexelsClient.videos.search({ query, per_page: 6 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

/**
 * Rutas de la aplicación
 */
app.use("/", routes);

app.get("/", (req, res) => res.send("Server is running"));

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;