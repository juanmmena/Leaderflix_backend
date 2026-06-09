const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcryptjs");

class UserController extends GlobalController {
  constructor() {
    super(UserDAO);
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserDAO.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      res.json({
        message: "Login exitoso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          birthdate: user.birthdate,
        }
      });

    } catch (err) {
      res.status(500).json({ message: "Error en login", error: err.message });
    }
  }

  async register(req, res) {
    const { username, email, password, birthdate } = req.body;

    try {
      const existingUser = await UserDAO.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El correo ya está registrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserDAO.create({
        username,
        email,
        password: hashedPassword,
        birthdate,
      });

      res.status(201).json({
        message: "Usuario registrado con éxito",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          birthdate: newUser.birthdate,
        }
      });

    } catch (err) {
      res.status(500).json({ message: "Error en registro", error: err.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { username, email, birthdate, password } = req.body;

    try {
      const updateData = { username, email, birthdate };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await UserDAO.update(id, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({
        message: "Perfil actualizado correctamente",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          birthdate: updatedUser.birthdate,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err);
      res.status(500).json({ message: "Error al actualizar usuario", error: err.message });
    }
  }
}

module.exports = new UserController();

