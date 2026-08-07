const pool = require('../config/database');

class SociosModel {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM socios');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM socios WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { nombre, email, plan, estado } = data;
    const [result] = await pool.query(
      'INSERT INTO socios (nombre, email, plan, estado) VALUES (?, ?, ?, ?)',
      [nombre, email, plan, estado]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, email, plan, estado } = data;
    const [result] = await pool.query(
      'UPDATE socios SET nombre = ?, email = ?, plan = ?, estado = ? WHERE id = ?',
      [nombre, email, plan, estado, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM socios WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = SociosModel;
