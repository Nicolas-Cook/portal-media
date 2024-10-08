const { Pool } = require('pg');
require('dotenv').config();
var axios = require('axios');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const Serie = {
  async add(data) {
    const { userId, serieId, serieName, poster_path } = data;
    const existingFavorite = await Serie.find({userId, serieId});
    if (existingFavorite) {
      throw new Error('La serie ya ha sido agregada');
    }
    const query = {
      text: `INSERT INTO favorite_series (user_id, serie_id, name, poster) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [userId, serieId, serieName, poster_path],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async find(data) {
    const { userId, serieId } = data;
    const query = {
      text: `SELECT * FROM favorite_series WHERE user_id = $1 AND serie_id = $2`,
      values: [userId, serieId],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async delete(data) {
    const { userId, serieId } = data;
    console.log(data)
    const query = {
      text: `DELETE FROM favorite_series WHERE user_id = $1 AND serie_id = $2`,
      values: [userId, serieId],
    };
    await pool.query(query);
  },

  async fetchGenres() {
    try {
      const query = `SELECT COUNT(*) FROM serie_genres`;
      const result = await pool.query(query);
      if (result.rows[0].count == 0) {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'es',
          },
        });
        const genres = response.data.genres;
        const values = genres.map((genre) => `(${genre.id}, '${genre.name}')`).join(',');
        const insertQuery = `INSERT INTO serie_genres (genre_id, name) VALUES ${values}`;
        await pool.query(insertQuery);
        console.log('Generos insertados');
      }
      const genresQuery = `SELECT * FROM serie_genres`;
      const genresResult = await pool.query(genresQuery);
      return genresResult.rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  async fetchCast(serieId, seasonNumber){
    try{
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}/credits`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });
      const cast = response.data.cast;
      const actors = cast.map((actor) => ({
        actor_name: actor.name,
        character: actor.character
      }));
      return actors
    } catch(error){
      console.error(error)
      return []
    }
  },
  async fetchCrew(serieId, seasonNumber){
    try{
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}/credits`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });
      const crew = response.data.crew;
      const team = crew.map((person) => ({
        name: person.name,
        job: person.job
      }));
      return team
    } catch(error){
      console.error(error)
      return []
    }
  },

  async fetchFavorites(userId) {
    console.log("fetchFavorites");
    try {
      const query = {
        text: `SELECT * FROM favorite_series WHERE user_id = $1`,
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch {
      console.error(error);
      return [];
    }
  },

  async isFavoriteSerie(userId, serieId) {
    const query = {
      text: `SELECT EXISTS (SELECT 1 FROM favorite_series WHERE user_id = $1 AND serie_id = $2)`,
      values: [userId, serieId],
    };
    const result = await pool.query(query);
    return result.rows[0].exists;
  }
};


module.exports = Serie;