const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const User = {
  async create(data) {
    const { username, password } = data;
    const existingUser = await User.findOne(username);
    if (existingUser) {
      throw new Error('Usuario ya existe');
    }
    const query = {
      text: `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
      values: [username, password],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async findOne(username) {
    const query = {
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },
  async changePassword(id, newPassword) {
    const query = {
      text: `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
      values: [newPassword, id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },
};

module.exports = User;