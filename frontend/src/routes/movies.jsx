import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      axios.get(`http://localhost:3000/movies`, {
        params: {
          page: currentPage,
          popularOrTopRated: isPopular ? 'popular' : 'top_rated',
        },
        withCredentials: true,
      })
      .then((response) => {
        setMovies(response.data.movies);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      });
    };
    fetchMovies();
  }, [currentPage, isPopular]);

  const handleMovieClick = (id) => {
    navigate(`/private/movie/${id}`);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(500, currentPage + 2); // 500 es el número máximo aceptado por la API de TMDB

  return (
    <div>
      <h1>Películas</h1>
      <div className="button-group">
            <button 
            className={`toggle-button ${!isPopular ? 'active' : ''}`} 
            onClick={() => setIsPopular(false)}
            >
            Mejor Puntuadas
            </button>
            <button 
            className={`toggle-button ${isPopular ? 'active' : ''}`} 
            onClick={() => setIsPopular(true)}
            >
            Populares
            </button>
      </div>
      <ul className="media-list">
        {movies.map((movie) => (
          <li key={movie.id} onClick={() => handleMovieClick(movie.id)} style={{ cursor: 'pointer' }}>
            <div className='card'>
              <img src={movie.poster_path} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p><b>Generos:</b> {movie.genres}</p>
              <p><b>Fecha de lanzamiento:</b> {movie.release_date}</p>
              <p><b>Calificación:</b> {movie.vote_average} / 10 </p>              
            </div>
          </li>
        ))}
      </ul>
      <div className='pagination'>
      {startPage > 1 && (
          <button onClick={() => paginate(1)}>Primera</button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNumber) => (
          <button
            key={pageNumber}
            className={currentPage === pageNumber ? 'active' : ''}
            onClick={() => paginate(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Movies;