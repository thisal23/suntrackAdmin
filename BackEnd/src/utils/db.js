const { pool } = require('../config/database');

class DB {
  static async query(sql, params) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  static async findOne(table, conditions) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const where = keys.map(key => `${key} = ?`).join(' AND ');
    
    const sql = `SELECT * FROM ${table} WHERE ${where} LIMIT 1`;
    const results = await this.query(sql, values);
    return results[0];
  }

  static async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = Array(values.length).fill('?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return result;
  }

  static async update(table, data, conditions) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
    const values = [...Object.values(data), ...Object.values(conditions)];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const result = await this.query(sql, values);
    return result;
  }

  static async delete(table, conditions) {
    const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);
    
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.query(sql, values);
    return result;
  }

  static async findAll(table, options = {}) {
    const {
      conditions = {},
      orderBy = 'id',
      order = 'DESC',
      limit = 10,
      offset = 0
    } = options;

    let sql = `SELECT * FROM ${table}`;
    const values = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    sql += ` ORDER BY ${orderBy} ${order}`;

    // ✅ Inject LIMIT/OFFSET directly after validating
    if (Number.isInteger(limit) && Number.isInteger(offset)) {
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    return await this.query(sql, values);
  }

  static async count(table, conditions = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${table}`;
    const values = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    const result = await this.query(sql, values);
    return result[0].count;
  }

  static async search(table, searchFields, searchTerm, options = {}) {
    const {
      orderBy = 'id',
      order = 'DESC',
      limit = 10,
      offset = 0
    } = options;

    const searchClauses = searchFields
      .map(field => `${field} LIKE ?`)
      .join(' OR ');
    const values = Array(searchFields.length).fill(`%${searchTerm}%`);

    let sql = `SELECT * FROM ${table} WHERE ${searchClauses}`;
    sql += ` ORDER BY ${orderBy} ${order}`;

    // ✅ Inject LIMIT/OFFSET safely
    if (Number.isInteger(limit) && Number.isInteger(offset)) {
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    return await this.query(sql, values);
  }

  static async findById(table, id) {
    return await this.findOne(table, { id });
  }

  static async beginTransaction() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  static async commit(connection) {
    await connection.commit();
    connection.release();
  }

  static async rollback(connection) {
    await connection.rollback();
    connection.release();
  }
}

module.exports = DB;
