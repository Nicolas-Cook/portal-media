import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Buscar = () => {
  const [query, setQuery] = useState('');
  const [isMovie, setIsMovie] = useState(true);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const url = (isMovie ? 'http://localhost:3000/movies/search' : 'http://localhost:3000/series/search');
    await axios.get(url, {
        params: {
          query,
        },
        withCredentials: true,
      })
      .then((response) => {
          setResults(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      });
  };

  const handleMediaTypeChange = (e) => {
    setIsMovie(e.target.value === 'movie');
  };

  const handleMediaClick = (id, mediaType) => {
    navigate(`/private/${mediaType}/${id}`);
  }

  return (
    <div className="search-page">
      <h1>Buscar</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas o series"
        />
        <select value={isMovie ? 'movie' : 'serie'} onChange={handleMediaTypeChange}>
          <option value="movie">Películas</option>
          <option value="serie">Series</option>
        </select>
        <button type="submit">Buscar</button>
      </form>

      <ul className="search-results">
        {results.map((item) => (
          <li key={item.id}
          onClick={() => handleMediaClick(item.id, isMovie ? 'movie' : 'serie')}
          style={{ cursor: 'pointer' }}
          >
            <h3>{item.title}</h3>
            <img src={item.poster_path} alt={item.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Buscar;
