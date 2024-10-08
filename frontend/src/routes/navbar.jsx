import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
      await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('/')
        toast.success('Sesión cerrada');
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
        navigate('/');
      });
  };
  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link to="/private/movies">Películas</Link>
        </li>
        <li>
          <Link to="/private/series">Series</Link>
        </li>
        <li>
          <Link to="/private/favoritas">Favoritas</Link>
        </li>
        <li>
          <Link to="/private/buscar">Buscar</Link>
        </li>
        <li>
          <Link to="/private/cuenta">Cuenta</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
