import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isMovie, setIsMovie] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = () => {
      axios.get(
        isMovie
          ? 'http://localhost:3000/movies/favorites'
          : 'http://localhost:3000/series/favorites',
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setFavorites(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      })
  };

  useEffect(() => {
    fetchFavorites();
  }, [isMovie]);

  const handleMediaClick = (id, mediaType) => {
    navigate(`/private/${mediaType}/${id}`);
  }

  return (
    <div>
        <h1>{isMovie ? 'Películas' : 'Series'} Favoritas</h1>
        <div className="button-group">
            <button 
            className={`toggle-button ${isMovie ? 'active' : ''}`} 
            onClick={() => setIsMovie(true)}
            >
            Películas
            </button>
            <button 
            className={`toggle-button ${!isMovie ? 'active' : ''}`} 
            onClick={() => setIsMovie(false)}
            >
            Series
            </button>
        </div>
      {favorites.length > 0 ? (
        <ul className='fav-list'>
          {favorites.map((favorite) => (
            <li key={favorite.id}
            onClick={() => handleMediaClick(isMovie ? favorite.movie_id : favorite.serie_id, isMovie ? 'movie' : 'serie')}
             style={{ cursor: 'pointer' }}>
                <div className='fav-card'>
                    <img className='fav-poster'
                        src={favorite.poster}
                        alt={favorite.name}
                    />
                    <h3>{favorite.name}</h3>
                </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No hay favoritos agregados</div>
      )}
    </div>
  );
};

export default Favorites;