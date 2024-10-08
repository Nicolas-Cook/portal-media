import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false); 

  useEffect(() => {
    const fetchMovieDetails = () => {
        axios.get(`http://localhost:3000/movies/${id}`,
           { withCredentials: true })
           .then(function(response) {
            setMovie(response.data.movie);
            setIsFavorited(response.data.isFavorite);
           })
           .catch(function(error) {
            console.log(error);
           });
    };
    fetchMovieDetails();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!movie) return;
    axios.post(`http://localhost:3000/movies/add`, {
      movieId: id,
      movieName: movie.title,
      poster_path: movie.poster_path,
    }, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        setIsFavorited(true);
        toast.success("Película agregada a favoritos");
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error al quitar de favoritos");
    });
  };

  const handleRemoveFromFavorites = async () => {
    if (!movie) return; 
    axios.delete(`http://localhost:3000/movies/delete/${id}`,
      { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setIsFavorited(false);
          toast.success("Película quitada de favoritos");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      });
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail">
      <img src={movie.poster_path} alt={movie.title} className='poster' />
      <div className="info">
        <h1>{movie.title}</h1>
        <p><b>Sinopsis:</b> {movie.overview}</p>
        <p><b>Fecha de lanzamiento:</b> {movie.release_date}</p>
        <p><b>Géneros:</b> {movie.genres}</p>
        <p><b>Calificación:</b> {movie.vote_average} / 10</p>
        {isFavorited ? (
          <button onClick={handleRemoveFromFavorites}>
            Quitar de Favoritos
          </button>
        ) : (
          <button onClick={handleAddToFavorites}>
            Añadir a Favoritos
          </button>
        )}
      </div>
      <div className='cast-crew'>
        <div className="cast">
          <h3>Reparto:</h3>
          <ul className="cast-list">
            {movie.cast.slice(0, 10).map((actor, index) => (
              <li key={index}>
                <p><b>{actor.actor_name}</b> - <i>{actor.character}</i></p>
              </li>
            ))}
          </ul>
        </div>
        <div className="crew">
          <h3>Equipo de producción:</h3>
          <ul className="crew-list">
            {movie.crew.slice(0, 10).map((member, index) => (
              <li key={index}>
                <p><b>{member.name}</b> - {member.job}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
