import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SerieDetail = () => {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false); 

  useEffect(() => {
    const fetchSerieDetails = () => {
        axios.get(`http://localhost:3000/series/${id}`,
           { withCredentials: true })
           .then((response) => {
            setSerie(response.data.serie);
            setIsFavorited(response.data.isFavorite);
           })
           .catch((error) => {
            console.log(error);
           });
    };
    fetchSerieDetails();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!serie) return;

    axios.post(`http://localhost:3000/series/add`, {
      serieId: id,
      serieName: serie.name,
      poster_path: serie.poster_path,
    }, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        setIsFavorited(true);
        toast.success("Serie añadida a favoritos");
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Fallo al añadir a favoritos");
    });
  };

  const handleRemoveFromFavorites = async () => {
    if (!serie) return; 
    axios.delete(`http://localhost:3000/series/delete/${id}`,
      { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setIsFavorited(false);
          toast.success("Serie quitada de favoritos");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      });
  };

  if (!serie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail">
      <img src={serie.poster_path} alt={serie.name} className='poster' />
      <div className="info">
        <h1>{serie.name}</h1>
        <p><b>Sinopsis:</b> {serie.overview}</p>
        <p><b>Fecha de lanzamiento:</b> {serie.first_air_date}</p>
        <p><b>Temporadas:</b> {serie.number_of_seasons}</p>
        <p><b>Géneros:</b> {serie.genres}</p>
        <p><b>Calificación:</b> {serie.vote_average} / 10</p>
        <p><b>Creado por:</b> {serie.created_by}</p>
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
            {serie.cast.slice(0, 10).map((actor, index) => (
              <li key={index}>
                <p><b>{actor.actor_name}</b> - <i>{actor.character}</i></p>
              </li>
            ))}
          </ul>
        </div>
        <div className="crew">
          <h3>Equipo de producción:</h3>
          <ul className="crew-list">
            {serie.crew.slice(0, 10).map((member, index) => (
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

export default SerieDetail;
