var axios = require('axios');
var express = require('express');
var router = express.Router();
var Serie = require('../models/serie');

router.get('/', async (req, res) => {
    try {
        const language = req.query.language || 'es-CL';
        const page = req.query.page || 1;
        const genres = await Serie.fetchGenres();
        const popularOrTopRated = req.query.popularOrTopRated || 'top_rated';
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${popularOrTopRated}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
                page: page
            }
        });
        const series = response.data.results.map((serie) => ({
            id: serie.id,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${serie.poster_path}`,
            name: serie.name,
            genres: serie.genre_ids.map((genreId) => {
                const genre = genres.find((g) => g.genre_id === genreId);
                return genre ? genre.name : '';
              }).join(', '),
            first_air_date: serie.first_air_date,
            vote_average: serie.vote_average
          }));
        res.json(series);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/favorites', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const favorites = await Serie.fetchFavorites(userId);
        res.json(favorites);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const language = req.query.language || 'es-CL';
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
                query: query
            }
        });
        const series = response.data.results.map((serie) => ({
            id: serie.id,
            title: serie.name,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${serie.poster_path}`,
        }));
        res.json(series);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/:serieId/:season?', async (req, res) => {
    try {
        const serieId = req.params.serieId;
        const userId = req.session.user.id;
        const season = req.params.season || 1;
        const language = req.query.language || 'es';
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
            }
        });
        const cast = await Serie.fetchCast(serieId, season);
        const crew = await Serie.fetchCrew(serieId, season);
        const {name, created_by, poster_path, overview, first_air_date, genres, vote_average, number_of_seasons} = response.data;
        const serie = {
            id: serieId,
            name: name,
            number_of_seasons: number_of_seasons,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
            overview: overview,
            first_air_date: first_air_date,
            genres: genres.map((genre) => genre.name).join(', '),
            vote_average: vote_average,
            created_by: created_by.map((person) => person.name).join(', '),
            cast: cast,
            crew: crew
        };
        const isFavorite = await Serie.isFavoriteSerie(userId, serieId);
        res.json({serie, isFavorite});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/add', async (req, res) => {
    const userId = req.session.user.id;
    const serieId = req.body.serieId;
    const serieName = req.body.serieName;
    const poster_path = req.body.poster_path;
    try {
        if (!serieId){
        return res.status(400).json({ message: 'Se requiere un ID de serie' });
        }
        await Serie.add({ userId, serieId, serieName, poster_path});
        res.status(200).json({ message: 'Serie agregada' });
    } catch (error) {
        if (error.message.includes("Serie ya ha sido agregada")){
            res.status(400).json({ error: "Serie ya agregada a favoritos"});
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/delete/:serieId', async (req, res) => {
    const userId = req.session.user.id;
    const serieId = req.params.serieId;
    try {
        await Serie.delete({ userId, serieId });
        res.json({ message: 'Película eliminada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

module.exports = router;