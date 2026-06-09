const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { supabase } = require("../config/database");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Paso 1: Solicitar recuperación de contraseña ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuario en Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hora

    // Guardar token en la base de datos
    await supabase
      .from("users")
      .update({
        reset_password_token: resetToken,
        reset_password_expires: expires,
      })
      .eq("id", user.id);

    const resetURL = `https://leaderflix-frontend.vercel.app/reset_password?token=${resetToken}`;

    const msg = {
      to: user.email,
      from: "nextstepoficioal@gmail.com",
      subject: "Recuperación de contraseña",
      html: `
        <p>Has solicitado recuperar tu contraseña</p>
        <p>Haz clic aquí: <a href="${resetURL}">${resetURL}</a></p>
      `,
    };

    await sgMail.send(msg);
    res.json({ msg: "Se envió un email para recuperar tu contraseña" });
  } catch (err) {
    console.error("ForgotPassword error:", err.response?.body || err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// --- Paso 2: Resetear contraseña con el token ---
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar usuario por token válido y no expirado
    const { data: user, error } = await supabase
      .from("users")
      .select("id, reset_password_expires")
      .eq("reset_password_token", token)
      .maybeSingle();

    if (error) throw error;

    if (
      !user ||
      !user.reset_password_expires ||
      new Date(user.reset_password_expires) < new Date()
    ) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña y limpiar token
    await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      })
      .eq("id", user.id);

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};