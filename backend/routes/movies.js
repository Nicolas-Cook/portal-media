var axios = require('axios');
var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

router.get('/', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const language = req.query.language || 'es-CL';
        const genres = await Movie.fetchGenres();
        const popularOrTopRated = req.query.popularOrTopRated || 'top_rated';
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${popularOrTopRated}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
                page: page
            }
        });
        const movies = response.data.results.map((movie) => ({
            id: movie.id,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
            title: movie.title,
            genres: movie.genre_ids.map((genreId) => {
                const genre = genres.find((g) => g.genre_id === genreId);
                return genre ? genre.name : '';
              }).join(', '),
            release_date: movie.release_date,
            vote_average: movie.vote_average
          }));
          res.json({movies});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/favorites', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const favorites = await Movie.fetchFavorites(userId);
        res.json(favorites);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const language = req.query.language || 'es-CL';
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
                query: query
            }
        });
        const movies = response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
        }));
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/:movieId', async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const userId = req.session.user.id;
        const language = req.query.language || 'es-CL';
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language,
            }
        });
        const cast = await Movie.fetchCast(movieId);
        const crew = await Movie.fetchCrew(movieId);
        const {title, poster_path, overview, release_date, genres, vote_average} = response.data;
        const movie = {
            title: title,
            poster_path: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
            overview: overview,
            release_date: release_date,
            genres: genres.map((genre) => genre.name).join(', '),
            vote_average: vote_average,
            cast: cast,
            crew: crew
        };
        const isFavorite = await Movie.isFavoriteMovie(userId, movieId);
        res.json({movie, isFavorite});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/add', async (req, res) => {
    const userId = req.session.user.id;
    const movieId = req.body.movieId;
    const movieName = req.body.movieName;
    const poster_path = req.body.poster_path;
    try {
        if (!movieId){
        return res.status(400).json({ message: 'Se requiere un ID de película' });
        }
        await Movie.add({ userId, movieId, movieName, poster_path });
        res.status(200).json({ message: 'Película agregada' });
    } catch (error) {
        if (error.message.includes("Película ya ha sido agregada")){
            res.status(400).json({ error: "Película ya agregada a favoritos"});
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/delete/:movieId', async (req, res) => {
    const userId = req.session.user.id;
    const movieId = req.params.movieId;
    try {
        await Movie.delete({ userId, movieId });
        res.json({ message: 'Película eliminada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

module.exports = router;