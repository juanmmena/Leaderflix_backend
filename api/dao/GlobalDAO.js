class GlobalDAO {
  constructor(tableName, supabaseClient) {
    this.tableName = tableName;
    this.supabase = supabaseClient;
  }

  async create(data) {
    try {
      const { data: row, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating document: ${error.message}`);
      }
      return row;
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async read(id) {
    try {
      const { data: row, error } = await this.supabase
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error || !row) {
        throw new Error("Document not found");
      }
      return row;
    } catch (error) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const { data: row, error } = await this.supabase
        .from(this.tableName)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error || !row) {
        throw new Error("Document not found");
      }
      return row;
    } catch (error) {
      throw new Error(`Error updating document by ID: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { data: row, error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error || !row) {
        throw new Error("Document not found");
      }
      return row;
    } catch (error) {
      throw new Error(`Error deleting document by ID: ${error.message}`);
    }
  }

  async getAll(filter = {}) {
    try {
      let query = this.supabase.from(this.tableName).select("*");

      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: rows, error } = await query;

      if (error) {
        throw new Error(`Error getting documents: ${error.message}`);
      }
      return rows || [];
    } catch (error) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}

module.exports = GlobalDAO;
