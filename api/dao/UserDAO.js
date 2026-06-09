const { supabase } = require("../config/database");

/**
 * DAO de usuarios usando Supabase (PostgreSQL).
 * Reemplaza UserDAO + GlobalDAO de Mongoose.
 */
class UserDAO {
  // ── Helpers internos ──────────────────────────────────────

  /** Lanza un error si Supabase devuelve un error */
  _check(error, context) {
    if (error) throw new Error(`[UserDAO] ${context}: ${error.message}`);
  }

  // ── CRUD genérico ─────────────────────────────────────────

  async create(data) {
    const { data: user, error } = await supabase
      .from("users")
      .insert(data)
      .select()
      .single();
    this._check(error, "create");
    return user;
  }

  async read(id) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    this._check(error, "read");
    return user;
  }

  async update(id, updateData) {
    const { data: user, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    this._check(error, "update");
    return user;
  }

  async delete(id) {
    const { data: user, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select()
      .single();
    this._check(error, "delete");
    return user;
  }

  async getAll(filter = {}) {
    let query = supabase.from("users").select("*");
    // Aplica filtros simples key=value si se pasan
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    this._check(error, "getAll");
    return data;
  }

  // ── Método específico ─────────────────────────────────────

  async findByEmail(email) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // devuelve null si no existe (no lanza error)
    this._check(error, "findByEmail");
    return user;
  }
}

module.exports = new UserDAO();