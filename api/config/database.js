const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

/**
 * Cliente de Supabase inicializado con las variables de entorno.
 * Reemplaza la conexión de Mongoose a MongoDB.
 *
 * Variables requeridas en .env:
 *   SUPABASE_URL  — URL del proyecto, ej: https://xxxx.supabase.co
 *   SUPABASE_KEY  — service_role key (para uso en backend)
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Verifica que las variables de entorno estén definidas.
 * Termina el proceso si faltan para evitar errores silenciosos.
 */
const connectDB = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error("❌ Faltan SUPABASE_URL o SUPABASE_KEY en el archivo .env");
    process.exit(1);
  }
  console.log("✅ Supabase client inicializado correctamente");
};

module.exports = { supabase, connectDB };