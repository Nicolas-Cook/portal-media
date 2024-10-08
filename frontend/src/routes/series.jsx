import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
        axios.get(`http://localhost:3000/series`, {
          params: {
            page: currentPage,
            popularOrTopRated: isPopular ? 'popular' : 'top_rated',
          },
          withCredentials: true,
        })
        .then((response) => {
            setSeries(response.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
          navigate('/');
        });
    };
    fetchSeries();
  }, [currentPage, isPopular]);

  const handleSerieClick = (id) => {
    navigate(`/private/serie/${id}`);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(500, currentPage + 2); // 500 es el número máximo aceptado por la API de TMDB

  return (
    <div>
      <h1>Series</h1>
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
        {series.map((serie) => (
          <li key={serie.id} onClick={() => handleSerieClick(serie.id)} style={{ cursor: 'pointer' }}>
            <div className='card'>
                <img src={serie.poster_path} alt={serie.name} />
                <h2>{serie.name}</h2>
                <p>Géneros: {serie.genres}</p>
                <p>Fecha de lanzamiento: {serie.first_air_date}</p>
                <p>Calificación: {serie.vote_average}/10</p>
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

export default Series;